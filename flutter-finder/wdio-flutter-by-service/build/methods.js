import { browser } from '@wdio/globals';
import { w3cElementToWdioElement } from './utils.js';
import * as fs from "node:fs";
export async function flutterWaitForVisible(options) {
    return await browser.executeScript('flutter: waitForVisible', [options]);
}
export async function flutterWaitForAbsent(options) {
    return await browser.executeScript('flutter: waitForAbsent', [options]);
}
export async function flutterDoubleClick(options) {
    const { element, offset } = options;
    return await browser.executeScript('flutter: doubleClick', [
        { origin: element, offset: offset },
    ]);
}
export async function flutterLongPress(options) {
    const { element, offset } = options;
    return await browser.executeScript('flutter: longPress', [
        { origin: element, offset: offset },
    ]);
}
export async function flutterScrollTillVisible(options) {
    const response = await browser.executeScript('flutter: scrollTillVisible', [
        options,
    ]);
    return await w3cElementToWdioElement(this, response);
}
export async function flutterDragAndDrop(options) {
    return await browser.executeScript('flutter: dragAndDrop', [options]);
}
export async function flutterInjectImage(filePath) {
    const base64Image = await convertFileToBase64(filePath);
    return await browser.executeScript('flutter: injectImage', [{ base64Image }]);
}
export async function flutterActivateInjectedImage(options) {
    return await browser.executeScript('flutter: activateInjectedImage', [options]);
}
async function convertFileToBase64(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'base64' }, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data);
        });
    });
}
