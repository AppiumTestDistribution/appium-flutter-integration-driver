import { FlutterIntergrationDriverService } from './service.js';
export default FlutterIntergrationDriverService;

declare global {
  namespace WebdriverIO {
    interface Browser {
      flutterByValueKey$(value: string): WebdriverIO.Element;
      flutterByValueKey$$(value: string): WebdriverIO.Element[];
      flutterWaitForAbsent(options: {
        element: WebdriverIO.Element;
        locator: Flutter.Locator;
      }): void;
      flutterBySemanticsLabel$(label: string): WebdriverIO.Element;
      flutterBySemanticsLabel$$(label: string): WebdriverIO.Element[];
      flutterByText$(text: string): WebdriverIO.Element;
      flutterDoubleClick(element: WebdriverIO.Element): WebdriverIO.Element;
      flutterGestureDoubleClick(
        origin: WebdriverIO.Element | Flutter.Point,
        offset?: Flutter.Point,
      ): WebdriverIO.Element;
    }
    interface Element {
      flutterByValueKey$(value: string): WebdriverIO.Element;
      flutterByValueKey$$(value: string): WebdriverIO.Element[];
      flutterBySemanticsLabel$(label: string): WebdriverIO.Element;
      flutterBySemanticsLabel$$(label: string): WebdriverIO.Element[];
      flutterByText$(text: string): WebdriverIO.Element;
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
