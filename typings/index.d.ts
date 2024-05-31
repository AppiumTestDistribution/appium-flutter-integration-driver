declare global {
  namespace WebdriverIO {
    interface Browser {
      flutterByValueKey$(value: string): WebdriverIO.Element;
      flutterByValueKey$$(value: string): WebdriverIO.Element[];
      flutterWaitForAbsent(value: waitForAbsent): WebdriverIO.Element;
      flutterBySemanticsLabel$(label: string): WebdriverIO.Element;
      flutterBySemanticsLabel$$(label: string): WebdriverIO.Element[];
      flutterByText$(text: string): WebdriverIO.Element;
      flutterDoubleClick(value: {finder: WebdriverIO.Element}): WebdriverIO.Element;
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
}

type waitForAbsent = {
  finderType: string;
  finderValue: string;
  timeout?: number;
};
