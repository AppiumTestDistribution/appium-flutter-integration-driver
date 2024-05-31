import { browser } from '@wdio/globals';

export async function flutterWaitForVisible(
  this: WebdriverIO.Browser,
  ...args: any
) {
  return await browser.executeScript('flutter: waitFor', [...args]);
}

export async function flutterWaitForAbsent(
  this: WebdriverIO.Browser,
  ...args: any
) {
  return await browser.executeScript('flutter: waitForAbsent', [...args]);
}

export async function flutterDoubleClick(
  this: WebdriverIO.Browser,
  element: any,
) {
  await browser.executeScript('flutter: doubleClick', [{ origin: element }]);
  return element;
}

export async function flutterGestureDoubleClick(
  this: WebdriverIO.Browser,
  origin: WebdriverIO.Element,
  offset: Flutter.Point,
) {
  await browser.executeScript('flutter: gestureDoubleClick', [
    { origin, offset },
  ]);
  return this;
}
