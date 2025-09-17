import { LocatorConfig } from './types.js';
import { command } from 'webdriver';
import { browser } from '@wdio/globals';
import path from 'path';
import { createRequire } from 'module';
import { pathToFileURL } from 'url';
import fs from 'fs';

const require = createRequire(import.meta.url);
let getElement: any;

const constructElementObject = async function () {
  if(!getElement) {
    const wdioPath = require.resolve('webdriverio');
    const targetPath = wdioPath.replace(".cjs", "js")
    const fileUrl = targetPath.replace("indexjs", "index.js");
  
    let fileContent = fs.readFileSync(fileUrl, "utf8");
    const exportRegex = /export\s*{([^}]*)}/;
  
    const exportBlock = fileContent.match(exportRegex);
    if(exportBlock && !/\bgetElement\b/.test(exportBlock[1])) {
      fileContent = fileContent.replace(exportRegex, (match, group) => {
        return `export {${group.trim().endsWith(",") ? group.trim() : group.trim() + ","} getElement };`;
      });
  
      fs.writeFileSync(fileUrl, fileContent, "utf8");
    }
  
    getElement = (await import(fileUrl)).getElement;
  }
  
  return getElement;
};

const flutterElementFinder = function (
  finderName: string,
  strategy: string,
  isMultipleFind: boolean = false,
) {
  return async function (
    this: WebdriverIO.Browser | WebdriverIO.Element,
    selector: any,
  ) {
    const suffix = isMultipleFind ? 'elements' : 'element';
    const elementId = (this as WebdriverIO.Element)['elementId'];
    const endpoint = !elementId
      ? `/session/:sessionId/${suffix}`
      : `/session/:sessionId/element/:elementId/${suffix}`;
    if (typeof selector !== 'string') {
      selector = JSON.stringify(selector);
    }
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
    if (response && response.error) {
      throw new Error(response.message);
    }

    if (isMultipleFind) {
      return await Promise.all(
        response.map((element: any) => w3cElementToWdioElement(this, element)),
      );
    } else {
      return await w3cElementToWdioElement(this, response);
    }
  };
};

export async function w3cElementToWdioElement(context: any, response: any) {
  const getElement = await constructElementObject();
  return getElement.call(context, null, response);
}

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
    registerCustomMethod(
      `${methodName}`,
      (value: any) => {
        // For complex finders (descendant, ancestor), use 'selector' property
        // For simple finders, use 'value' property
        if (config.name === 'flutterByDescendant' || config.name === 'flutterByAncestor') {
          return {
            using: config.stategy,
            selector: typeof value !== 'string' ? value : JSON.parse(value),
          };
        } else {
          return {
            using: config.stategy,
            value: typeof value !== 'string' ? JSON.stringify(value) : value,
          };
        }
      },
      {
        attachToBrowser: true,
        attachToElement: false,
      },
    );
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
