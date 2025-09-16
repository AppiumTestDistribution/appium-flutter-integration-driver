import { LocatorConfig } from './types.js';
import { registerCustomMethod, registerLocators } from './utils.js';
import * as methods from './methods.js';

export class FlutterIntegrationDriverService {
  private locatorConfig: LocatorConfig[] = [
    {
      name: 'flutterByValueKey',
      stategy: '-flutter key',
    },
    {
      name: 'flutterBySemanticsLabel',
      stategy: '-flutter semantics label',
    },
    {
      name: 'flutterByToolTip',
      stategy: '-flutter tooltip',
    },
    {
      name: 'flutterByText',
      stategy: '-flutter text',
    },
    {
      name: 'flutterByTextContaining',
      stategy: '-flutter text containing',
    },
    {
      name: 'flutterByType',
      stategy: '-flutter type',
    },
    {
      name: 'flutterByDescendant',
      stategy: '-flutter descendant',
    },
    {
      name: 'flutterByAncestor',
      stategy: '-flutter ancestor',
    },
  ];
  /**
   * this browser object is passed in here for the first time
   */
  async before(config: any, capabilities: any, browser: WebdriverIO.Browser) {
    registerLocators(this.locatorConfig);

    for (let method in methods) {
      registerCustomMethod(method, (methods as any)[method], {
        attachToBrowser: true,
        attachToElement: false,
      });
    }
  }
}
