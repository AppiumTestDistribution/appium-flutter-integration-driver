import { LocatorConfig } from './types.js';
export declare function w3cElementToWdioElement(context: any, response: any): Promise<any>;
export declare function registerLocators(locatorConfig: Array<LocatorConfig>): void;
export declare function registerCustomMethod(methodName: string, handler: any, attach: {
    attachToBrowser: boolean;
    attachToElement: boolean;
}): void;
//# sourceMappingURL=utils.d.ts.map