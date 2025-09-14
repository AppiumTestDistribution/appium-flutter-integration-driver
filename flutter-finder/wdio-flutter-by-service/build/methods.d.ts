export type WaitForOption = {
    element?: WebdriverIO.Element;
    locator?: Flutter.Locator;
    timeout?: number;
};
export declare function flutterWaitForVisible(this: WebdriverIO.Browser, options: WaitForOption): Promise<any>;
export declare function flutterWaitForAbsent(this: WebdriverIO.Browser, options: WaitForOption): Promise<any>;
export declare function flutterDoubleClick(this: WebdriverIO.Browser, options: {
    element?: WebdriverIO.Element;
    offset?: Flutter.Point;
}): Promise<any>;
export declare function flutterLongPress(this: WebdriverIO.Browser, options: {
    element: WebdriverIO.Element;
    offset?: Flutter.Point;
}): Promise<any>;
export declare function flutterScrollTillVisible(this: WebdriverIO.Browser, options: {
    finder: WebdriverIO.Element;
    scrollView?: WebdriverIO.Element;
    scrollDirection?: 'up' | 'right' | 'down' | 'left';
    delta?: number;
    maxScrolls?: number;
    settleBetweenScrollsTimeout?: number;
    dragDuration?: number;
}): Promise<WebdriverIO.Element | null>;
export declare function flutterDragAndDrop(this: WebdriverIO.Browser, options: {
    source: WebdriverIO.Element;
    target: WebdriverIO.Element;
}): Promise<any>;
export declare function flutterInjectImage(this: WebdriverIO.Browser, filePath: string): Promise<any>;
export declare function flutterActivateInjectedImage(this: WebdriverIO.Browser, options: {
    imageId: String;
}): Promise<any>;
//# sourceMappingURL=methods.d.ts.map