import { LocatorConfig } from './types.js';
import { registerCustomMethod, registerLocators } from './utils.js';
import * as methods from './methods.js';

export class FlutterIntergrationDriverService {
  private locatorConfig: LocatorConfig[] = [
    {
      name: 'flutterByValueKey',
      stategy: 'key',
    },
    {
      name: 'flutterBySemanticsLabel',
      stategy: 'semantics label',
    },
    {
      name: 'flutterByToolTip',
      stategy: 'tooltip',
    },
    {
      name: 'flutterByText',
      stategy: 'text',
    },
    {
      name: 'flutterByTextContaining',
      stategy: 'text containting',
    },
    {
      name: 'flutterByType',
      stategy: 'type',
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
