declare global {
  namespace WebdriverIO {
    interface Browser {
      flutterFinderByKey$(value: string): Promise<any>;
      flutterFinderByKey$$(value: string): Promise<any>;
    }
  }
}
