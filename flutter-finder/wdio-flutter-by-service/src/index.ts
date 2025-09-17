import { FlutterIntegrationDriverService } from './service.js';
import type { ChainablePromiseElement } from 'webdriverio';
export default FlutterIntegrationDriverService;

declare global {
  namespace WebdriverIO {
    interface Browser {
      flutterByDescendant(options: {
        of: WebdriverIO.Element;
        matching: WebdriverIO.Element;
      }): Promise<Flutter.Locator>;
      flutterByDescendant$(options: {
        of: WebdriverIO.Element;
        matching: WebdriverIO.Element;
      }): ChainablePromiseElement;
      flutterByDescendant$$(options: {
        of: WebdriverIO.Element;
        matching: WebdriverIO.Element;
      }): ChainablePromiseElement[];
      flutterByAncestor(options: {
        of: WebdriverIO.Element;
        matching: WebdriverIO.Element;
      }): Promise<Flutter.Locator>;
      flutterByAncestor$(options: {
        of: WebdriverIO.Element;
        matching: WebdriverIO.Element;
      }): ChainablePromiseElement;
      flutterByAncestor$$(options: {
        of: WebdriverIO.Element;
        matching: WebdriverIO.Element;
      }): ChainablePromiseElement[];
      flutterByValueKey(value: string): Promise<Flutter.Locator>;
      flutterByValueKey$(
        value: string,
      ): ChainablePromiseElement;
      flutterByValueKey$$(
        value: string,
      ): ChainablePromiseElement[];
      flutterBySemanticsLabel(label: string): Promise<Flutter.Locator>;
      flutterBySemanticsLabel$(
        label: string,
      ): ChainablePromiseElement;
      flutterBySemanticsLabel$$(
        label: string,
      ): ChainablePromiseElement[];
      flutterByText(text: string): Promise<Flutter.Locator>;
      flutterByText$(
        text: string,
      ): ChainablePromiseElement;
      flutterByType(text: string): Promise<Flutter.Locator>;
      flutterByType$(
        text: string,
      ): ChainablePromiseElement;
      flutterByType$$(
        text: string,
      ): ChainablePromiseElement[];
      flutterByText$$(
        text: string,
      ): ChainablePromiseElement[];
      flutterWaitForVisible(options: {
        element: WebdriverIO.Element;
        timeout?: number;
      }): Promise<void>;
      flutterDoubleClick(options: {
        element: WebdriverIO.Element;
        offset?: { x: number; y: number };
      }): Promise<void>;
      flutterLongPress(options: {
        element: WebdriverIO.Element;
        offset?: { x: number; y: number };
      }): Promise<void>;
      flutterWaitForAbsent(options: {
        element: WebdriverIO.Element;
        timeout?: number;
      }): Promise<void>;

      flutterScrollTillVisible(options: {
        finder: WebdriverIO.Element;
        scrollView?: WebdriverIO.Element;
        scrollDirection?: 'up' | 'right' | 'down' | 'left';
        delta?: number;
        maxScrolls?: number;
        settleBetweenScrollsTimeout?: number;
        dragDuration?: number;
      }): ChainablePromiseElement | null;

      flutterDragAndDrop(options: {
        source: WebdriverIO.Element;
        target: WebdriverIO.Element;
      }): Promise<void>;
      flutterInjectImage(filePath: string): Promise<String>;
      flutterActivateInjectedImage(options: {
        imageId: string;
      }): Promise<string>;
    }
    interface Element {
      flutterByValueKey(value: string): Promise<Flutter.Locator>;
      flutterByValueKey$(value: string): WebdriverIO.Element;
      flutterByValueKey$$(value: string): WebdriverIO.Element[];
      flutterBySemanticsLabel(label: string): Promise<Flutter.Locator>;
      flutterBySemanticsLabel$(label: string): WebdriverIO.Element;
      flutterBySemanticsLabel$$(label: string): WebdriverIO.Element[];
      flutterByText(text: string): Promise<Flutter.Locator>;
      flutterByText$(text: string): WebdriverIO.Element;
      flutterByText$$(text: string): WebdriverIO.Element[];
      flutterByType(text: string): Promise<Flutter.Locator>;
      flutterByType$(
        text: string,
      ): ChainablePromiseElement;
      flutterByType$$(
        text: string,
      ): ChainablePromiseElement[];
      flutterByDescendant(options: {
       of: WebdriverIO.Element;
       matching: WebdriverIO.Element;
     }): Promise<Flutter.Locator>;
     flutterByDescendant$(options: {
       of: WebdriverIO.Element;
       matching: WebdriverIO.Element;
     }): ChainablePromiseElement;
     flutterByDescendant$$(options: {
       of: WebdriverIO.Element;
       matching: WebdriverIO.Element;
     }): ChainablePromiseElement[];
      flutterByAncestor(options: {
        of: WebdriverIO.Element;
        matching: WebdriverIO.Element;
      }): Promise<Flutter.Locator>;
      flutterByAncestor$(options: {
        of: WebdriverIO.Element;
        matching: WebdriverIO.Element;
      }): ChainablePromiseElement;
      flutterByAncestor$$(options: {
        of: WebdriverIO.Element;
        matching: WebdriverIO.Element;
      }): ChainablePromiseElement[];
    }
  }

  namespace Flutter {
    // @ts-ignore
    type Locator = {
      using: string;
      value?: string;
      selector?: any;
    };

    // @ts-ignore
    type Point = {
      x: number;
      y: number;
    };
  }
}

export { FlutterIntegrationDriverService };
