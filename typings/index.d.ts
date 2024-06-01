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
      flutterGestureDoubleClick(
        origin: WebdriverIO.Element | Flutter.Point,
        offset?: Flutter.Point,
      ): WebdriverIO.Element;
      flutterWaitForAbsent(options: {
        element: WebdriverIO.Element;
        locator: Flutter.Locator;
      }): void;

      flutterScrollTillVisible(
        finder: Flutter.Locator,
        scrollView?: Flutter.Locator,
        delta?: number,
        maxScrolls?: number,
        settleBetweenScrollsTimeout?: number,
        dragDuration?: number,
      ): Promise<WebdriverIO.Element | null>;
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
