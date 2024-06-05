import AndroidUiautomator2Driver from 'appium-uiautomator2-driver';
import XCUITestDriver from 'appium-xcuitest-driver/build/lib/driver';

export async function getProxyDriver(
  strategy: string,
  proxy: any,
  proxyDriver: any,
) {
  if (['key', 'semantics label', 'text'].includes(strategy)) {
    return proxy;
  } else if (proxyDriver instanceof AndroidUiautomator2Driver) {
    return proxyDriver.uiautomator2.jwproxy;
  } else if (proxyDriver instanceof XCUITestDriver) {
    return proxyDriver.wda.jwproxy;
  } else {
    return 'NA';
  }
}


export function isFlutterDriverCommand(command: string) {
  return [
          "createSession", "deleteSession", "getSession",
          "getSessions", "findElement", "findElements",
          "findElementFromElement", "findElementsFromElement", "click",
          "getText", "setValue", "keys", "getName", "clear",
          "elementSelected", "elementEnabled",
          "getAttribute", "elementDisplayed", "execute"
      ]
      .indexOf(command) >= 0;
}