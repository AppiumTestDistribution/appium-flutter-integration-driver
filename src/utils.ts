import AndroidUiautomator2Driver from 'appium-uiautomator2-driver';
import XCUITestDriver from 'appium-xcuitest-driver/build/lib/driver';
import { log } from './logger';
import { findAPortNotInUse } from 'portscanner';

const FLUTTER_SERVER_START_MESSAGE = new RegExp(
  /Appium flutter server is listening on port (\d+)/,
);
const DEVICE_PORT_RANGE = [9000, 9299];

export async function getProxyDriver(
  strategy: string,
  proxy: any,
  proxyDriver: any,
) {
  if (['key', 'semantics label', 'text', 'type'].includes(strategy)) {
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
  return (
    [
      'createSession',
      'deleteSession',
      'getSession',
      'getSessions',
      'findElement',
      'findElements',
      'findElementFromElement',
      'findElementsFromElement',
      'click',
      'getText',
      'setValue',
      'keys',
      'getName',
      'clear',
      'elementSelected',
      'elementEnabled',
      'getAttribute',
      'elementDisplayed',
      'execute',
    ].indexOf(command) >= 0
  );
}

export function fetchFlutterServerPort(
  deviceLogs: [{ message: string }],
): number {
  let port: number | undefined;
  for (const line of deviceLogs.map((e) => e.message).reverse()) {
    const match = line.match(FLUTTER_SERVER_START_MESSAGE);
    if (match) {
      log.info(`Found the server started log from device: ${line}`);
      port = Number(match[1]);
      break;
    }
  }
  if (!port) {
    throw new Error(
      `Flutter server started message '${FLUTTER_SERVER_START_MESSAGE}' was not found in the device log. ` +
        `Please make sure the application under test is configured properly according to ` +
        `https://github.com/AppiumTestDistribution/appium-flutter-server and that it does not crash on startup.
        Also make sure "appium:skipLogcatCapture" is not set to true in the desired capabilities. `,
    );
  }
  log.info(`Extracted the port from the device logs: ${port}`);
  return port;
}

export async function getFreePort() {
  const [start, end] = DEVICE_PORT_RANGE;
  return await findAPortNotInUse(start, end);
}
