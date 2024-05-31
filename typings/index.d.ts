declare global {
  namespace WebdriverIO {
    interface Browser {
      flutterByValueKey$(value: string): WebdriverIO.Element;
      flutterByValueKey$$(value: string): WebdriverIO.Element[];
      flutterWaitForAbsent(value: waitForAbsent): WebdriverIO.Element;
      flutterBySemanticsLabel$(label: string): WebdriverIO.Element;
      flutterBySemanticsLabel$$(label: string): WebdriverIO.Element[];
      flutterByText$(text: string): WebdriverIO.Element;
      flutterDoubleClick(element: WebdriverIO.Element): WebdriverIO.Element;
      flutterGestureDoubleClick(
        origin: WebdriverIO.Element | Point,
        offset?: Point,
      ): WebdriverIO.Element;
    }
    interface Element {
      flutterByValueKey$(value: string): WebdriverIO.Element;
      flutterByValueKey$$(value: string): WebdriverIO.Element[];
      flutterWaitForAbsent(value: waitForAbsent): WebdriverIO.Element;
      flutterBySemanticsLabel$(label: string): WebdriverIO.Element;
      flutterBySemanticsLabel$$(label: string): WebdriverIO.Element[];
      flutterByText$(text: string): WebdriverIO.Element;
    }
  }

  namespace Flutter {
    type waitForAbsent = {
      finderType: string;
      finderValue: string;
      timeout?: number;
    };

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
