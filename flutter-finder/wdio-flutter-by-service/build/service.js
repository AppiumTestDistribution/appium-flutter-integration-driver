import { registerCustomMethod, registerLocators } from './utils.js';
import * as methods from './methods.js';
export class FlutterIntegrationDriverService {
    locatorConfig = [
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
    async before(config, capabilities, browser) {
        registerLocators(this.locatorConfig);
        for (let method in methods) {
            registerCustomMethod(method, methods[method], {
                attachToBrowser: true,
                attachToElement: false,
            });
        }
    }
}
