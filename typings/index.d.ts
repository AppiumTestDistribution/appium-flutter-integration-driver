declare global {
  namespace WebdriverIO {
    interface Browser {
      flutterFinderByKey(using: string, value: string): Promise<any>;
    }
  }
}
