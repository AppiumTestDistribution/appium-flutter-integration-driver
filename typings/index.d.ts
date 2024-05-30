declare global {
  namespace WebdriverIO {
    interface Browser {
      flutterByValueKey$(value: string): Promise<any>;
      flutterByValueKey$$(value: string): Promise<any>;
      flutterWaitForAbsent(value: waitForAbsent): Promise<any>;
    }
  }
}

type waitForAbsent = {
  finderType: string,
  finderValue: string,
  timeout?: number,
}
