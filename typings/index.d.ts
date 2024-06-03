import { FlutterIntergrationDriverService } from './service';

declare global {
  namespace WebdriverIO {
    interface Browser {
      flutterByValueKey(value: string): Flutter.Locator;
      flutterByValueKey$(value: string): WebdriverIO.Element;
      flutterByValueKey$$(value: string): WebdriverIO.Element[];
      flutterBySemanticsLabel(label: string): Flutter.Locator;
      flutterBySemanticsLabel$(label: string): WebdriverIO.Element;
      flutterBySemanticsLabel$$(label: string): WebdriverIO.Element[];
      flutterByText(text: string): Flutter.Locator;
      flutterByText$(text: string): WebdriverIO.Element;
      flutterByText$$(text: string): WebdriverIO.Element[];

      flutterDoubleClick(element: WebdriverIO.Element): WebdriverIO.Element;
      flutterWaitForAbsent(options: {
        element: WebdriverIO.Element;
        locator: Flutter.Locator;
      }): void;

      flutterScrollTillVisible(options: {
        finder: WebdriverIO.Element;
        scrollView?: WebdriverIO.Element;
        scrollDirection?: 'up' | 'right' | 'down' | 'left';
        delta?: number;
        maxScrolls?: number;
        settleBetweenScrollsTimeout?: number;
        dragDuration?: number;
      }): Promise<WebdriverIO.Element | null>;
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
