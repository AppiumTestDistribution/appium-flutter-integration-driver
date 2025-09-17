import { browser } from '@wdio/globals';
import { w3cElementToWdioElement } from './utils.js';
import * as fs from "node:fs";

export type WaitForOption = {
    element?: WebdriverIO.Element;
    locator?: Flutter.Locator;
    timeout?: number;
}

export async function flutterWaitForVisible(
  this: WebdriverIO.Browser,
  options: WaitForOption,
) {
  return await browser.executeScript('flutter: waitForVisible', [options]);
}

export async function flutterWaitForAbsent(
  this: WebdriverIO.Browser,
  options: WaitForOption,
) {
  return await browser.executeScript('flutter: waitForAbsent', [options]);
}

export async function flutterDoubleClick(
  this: WebdriverIO.Browser,
  options: {
    element?: WebdriverIO.Element;
    offset?: Flutter.Point;
  },
) {
  const { element, offset } = options;
  return await browser.executeScript('flutter: doubleClick', [
    { origin: element, offset: offset },
  ]);
}

export async function flutterLongPress(
  this: WebdriverIO.Browser,
  options: {
    element: WebdriverIO.Element;
    offset?: Flutter.Point;
  },
) {
  const { element, offset } = options;
  return await browser.executeScript('flutter: longPress', [
    { origin: element, offset: offset },
  ]);
}


export async function flutterScrollTillVisible(
  this: WebdriverIO.Browser,
  options: {
    finder: WebdriverIO.Element | Flutter.Locator;
    scrollView?: WebdriverIO.Element;
    scrollDirection?: 'up' | 'right' | 'down' | 'left';
    delta?: number;
    maxScrolls?: number;
    settleBetweenScrollsTimeout?: number;
    dragDuration?: number;
  },
): Promise<WebdriverIO.Element | null> {
  // Convert the finder to the proper format for the server
  let finderForServer;
  if (options.finder && typeof options.finder === 'object' && 'using' in options.finder) {
    // It's a locator object (like from flutterByDescendant)
    finderForServer = options.finder;
  } else {
    // It's an element, extract the locator
    finderForServer = options.finder;
  }
  
  const serverOptions = {
    ...options,
    finder: finderForServer,
  };
  
  const response = await browser.executeScript('flutter: scrollTillVisible', [
    serverOptions,
  ]);
  return await w3cElementToWdioElement(this, response);
}

export async function flutterDragAndDrop(this: WebdriverIO.Browser, options: {
    source: WebdriverIO.Element;
    target: WebdriverIO.Element;
    }) {
    return await browser.executeScript('flutter: dragAndDrop', [options]);
}

export async function flutterInjectImage(this: WebdriverIO.Browser, filePath: string) {
    const base64Image = await convertFileToBase64(filePath);
    return await browser.executeScript('flutter: injectImage', [{ base64Image }]);
}

export async function flutterActivateInjectedImage(this: WebdriverIO.Browser, options: {
    imageId: String;
}) {
    return await browser.executeScript('flutter: activateInjectedImage', [options]);
}

async function convertFileToBase64(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, { encoding: 'base64' }, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        });
    });
}
