import { LocatorConfig } from './types.js';
import { command } from 'webdriver';
import { browser } from '@wdio/globals';
import _ from 'lodash';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const constructElementObject = async function () {
  const wdioPath = require.resolve('webdriverio');
  const pathToMatch = path.join('cjs', 'index.js');
  const pathToReplace = path.join('utils', 'getElementObject.js');
  return (
    await import(path.join(wdioPath.replace(pathToMatch, ''), pathToReplace))
  ).getElement;
};

const flutterElementFinder = function (
  finderName: string,
  strategy: string,
  isMultipleFind: boolean = false,
) {
  return async function (
    this: WebdriverIO.Browser | WebdriverIO.Element,
    selector: string,
  ) {
    const suffix = isMultipleFind ? 'elements' : 'element';
    const elementId = (this as WebdriverIO.Element)['elementId'];
    const endpoint = !elementId
      ? `/session/:sessionId/${suffix}`
      : `/session/:sessionId/element/:elementId/${suffix}`;
    const args = [elementId, strategy, selector].filter(Boolean);

    const variables = elementId
      ? [
          {
            name: 'elementId',
            type: 'string',
            description: 'a valid parameter',
            required: true,
          },
        ]
      : [];

    const parameters = [
      {
        name: 'using',
        type: 'string',
        description: 'a valid parameter',
        required: true,
      },
      {
        name: 'value',
        type: 'string',
        description: 'a valid parameter',
        required: true,
      },
    ];

    const findElement = command('POST', endpoint, {
      command: finderName,
      variables,
      parameters,
      ref: '',
    });

    const response: any = await findElement.call(browser as any, ...args);
    const getElement = await constructElementObject();
    if (isMultipleFind) {
      return response.map((element: any) =>
        getElement.call(this, null, element),
      );
    } else {
      return getElement.call(this, null, response);
    }
  };
};

export function registerLocators(locatorConfig: Array<LocatorConfig>) {
  for (let config of locatorConfig) {
    const methodName = config.name;
    const $ = flutterElementFinder(methodName, config.stategy, false);
    const $$ = flutterElementFinder(methodName, config.stategy, true);
    registerCustomMethod(`${methodName}$`, $, {
      attachToBrowser: true,
      attachToElement: true,
    });
    registerCustomMethod(`${methodName}$$`, $$, {
      attachToBrowser: true,
      attachToElement: true,
    });
  }
}

export function registerCustomMethod(
  methodName: string,
  handler: any,
  attach: { attachToBrowser: boolean; attachToElement: boolean },
) {
  if (attach.attachToBrowser) {
    browser.addCommand(methodName, handler);
  }

  if (attach.attachToElement) {
    browser.addCommand(methodName, handler, true);
  }
}
