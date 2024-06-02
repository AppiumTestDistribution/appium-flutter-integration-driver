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
  options: {
    element?: WebdriverIO.Element;
    offset?: Flutter.Point;
  },
) {
  const { element, offset } = options;
  return await browser.executeScript('flutter: doubleClick', [
    { origin: element, offet: offset },
  ]);
}

export async function flutterScrollTillVisible(
  this: WebdriverIO.Browser,
  options: {
    finder: WebdriverIO.Element;
    scrollView?: WebdriverIO.Element;
    scrollDirection?: 'up' | 'right' | 'down' | 'left';
    delta?: number;
    maxScrolls?: number;
    settleBetweenScrollsTimeout?: number;
    dragDuration?: number;
  },
): Promise<WebdriverIO.Element | null> {
  const response = await browser.executeScript('flutter: scrollTillVisible', [
    options,
  ]);
  return await w3cElementToWdioElement(this, response);
}
