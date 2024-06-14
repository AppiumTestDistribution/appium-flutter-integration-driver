import { FlutterIntergrationDriverService } from './service.js';
import { ChainablePromiseElement } from 'webdriverio';
export default FlutterIntergrationDriverService;

declare global {
  namespace WebdriverIO {
    interface Browser {
      flutterByValueKey(value: string): Flutter.Locator;
      flutterByValueKey$(
        value: string,
      ): ChainablePromiseElement<WebdriverIO.Element>;
      flutterByValueKey$$(
        value: string,
      ): ChainablePromiseElement<WebdriverIO.Element[]>;
      flutterBySemanticsLabel(label: string): Flutter.Locator;
      flutterBySemanticsLabel$(
        label: string,
      ): ChainablePromiseElement<WebdriverIO.Element>;
      flutterBySemanticsLabel$$(
        label: string,
      ): ChainablePromiseElement<WebdriverIO.Element[]>;
      flutterByText(text: string): Flutter.Locator;
      flutterByType(text: string): Flutter.Locator;
      flutterByText$(
        text: string,
      ): ChainablePromiseElement<WebdriverIO.Element>;
      flutterByType$(
        text: string,
      ): ChainablePromiseElement<WebdriverIO.Element>;
      flutterByType$$(
        text: string,
      ): ChainablePromiseElement<WebdriverIO.Element>;
      flutterByText$$(
        text: string,
      ): ChainablePromiseElement<WebdriverIO.Element[]>;
      flutterWaitForVisible(options: {
        element: WebdriverIO.Element;
        timeout?: number;
      }): Promise<void>;
      flutterDoubleClick(options: {
        element: WebdriverIO.Element;
        offset?: { x: number; y: number };
      }): WebdriverIO.Element;
      flutterLongPress(options: {
        element: WebdriverIO.Element;
        offset?: { x: number; y: number };
      }): WebdriverIO.Element;
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
      }): ChainablePromiseElement<WebdriverIO.Element | null>;
    }
    interface Element {
      flutterByValueKey(value: string): Flutter.Locator;
      flutterByValueKey$(value: string): WebdriverIO.Element;
      flutterByValueKey$$(value: string): WebdriverIO.Element[];
      flutterBySemanticsLabel(label: string): Flutter.Locator;
      flutterBySemanticsLabel$(label: string): WebdriverIO.Element;
      flutterBySemanticsLabel$$(label: string): WebdriverIO.Element[];
      flutterByText(text: string): Flutter.Locator;
      flutterByText$(text: string): WebdriverIO.Element;
      flutterByText$$(text: string): WebdriverIO.Element[];
    }
  }

  namespace Flutter {
    type Locator = {
      strategy: string;
      selector: string;
    };

    type Point = {
      x: number;
      y: number;
    };
  }
}

export { FlutterIntergrationDriverService };
