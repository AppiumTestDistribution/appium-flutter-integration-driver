import { browser } from '@wdio/globals';
import { w3cElementToWdioElement } from './utils.js';

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

export async function flutterScrollTillVisible(
  this: WebdriverIO.Browser,
  finder: WebdriverIO.Element,
  scrollView?: WebdriverIO.Element,
  scrollDirection?: 'up' | 'right' | 'down' | 'left',
  delta?: number,
  maxScrolls?: number,
  settleBetweenScrollsTimeout?: number,
  dragDuration?: number,
): Promise<WebdriverIO.Element | null> {
  const response = await browser.executeScript('flutter: scrollTillVisible', [
    {
      finder,
      scrollView,
      scrollDirection,
      delta,
      maxScrolls,
      settleBetweenScrollsTimeout,
      dragDuration,
    },
  ]);
  return await w3cElementToWdioElement(this, response);
}
