import { browser } from '@wdio/globals';

export async function flutterWaitForVisible(
  this: WebdriverIO.Browser,
  options: {
    element: WebdriverIO.Element;
    locator: Flutter.Locator;
  },
) {
  return await browser.executeScript('flutter: waitForVisible', [options]);
}

export async function flutterWaitForAbsent(
  this: WebdriverIO.Browser,
  options: {
    element: WebdriverIO.Element;
    locator: Flutter.Locator;
  },
) {
  return await browser.executeScript('flutter: waitForAbsent', [options]);
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
