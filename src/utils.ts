import AndroidUiautomator2Driver from 'appium-uiautomator2-driver';
import XCUITestDriver from 'appium-xcuitest-driver/build/lib/driver';
import { log } from './logger';
import { findAPortNotInUse } from 'portscanner';
import { waitForCondition } from 'asyncbox';
import { JWProxy } from '@appium/base-driver';
import { desiredCapConstraints } from './desiredCaps';
import { DriverCaps } from '@appium/types';

const DEVICE_PORT_RANGE = [9000, 9020];
const SYSTEM_PORT_RANGE = [10000, 11000];
type FlutterDriverConstraints = typeof desiredCapConstraints;
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

export async function getFreePort() {
  const [start, end] = SYSTEM_PORT_RANGE;
  return await findAPortNotInUse(start, end);
}

async function waitForFlutterServer(port: number, packageName: string, flutterCaps: DriverCaps<FlutterDriverConstraints>) {
  const proxy = new JWProxy({
    server: '127.0.0.1',
    port: port,
  });
  await waitForCondition(
    async () => {
      try {
        const response: any = await proxy.command('/status', 'GET');
        if (!response) {
          return false;
        }
        if (response?.appInfo?.packageName === packageName) {
          return true;
        } else {
          throw new Error(
            `Looking for flutter server with package ${packageName}. But found ${response.appInfo?.packageName}`,
          );
        }
      } catch (err: any) {
        log.info(`FlutterServer not reachable on port ${port}, Retrying..`);
        return false;
      }
    },
    {
      waitMs: flutterCaps.flutterServerLaunchTimeout,
      intervalMs: 150,
    },
  );
}

export async function fetchFlutterServerPort({
  udid,
  systemPort,
  portForwardCallback,
  portReleaseCallback,
  packageName,
  flutterCaps
}: {
  udid: string;
  systemPort?: number | null;
  portForwardCallback?: (
    udid: string,
    systemPort: number,
    devicePort: number,
  ) => any;
  portReleaseCallback?: (udid: string, systemPort: number) => any;
  packageName: string;
  flutterCaps: DriverCaps<FlutterDriverConstraints>;
}): Promise<number | null> {
  const [startPort, endPort] = DEVICE_PORT_RANGE as [number, number];
  const isSimulator = !systemPort;
  let devicePort = startPort;
  let forwardedPort = systemPort;

  while (devicePort <= endPort) {
    /**
     * For ios simulators, we dont need a dedicated system port and no port forwarding is required
     * We need to use the same port range used by flutter server to check if the server is running
     */
    if (isSimulator) {
      forwardedPort = devicePort;
    }
    if (portForwardCallback) {
      await portForwardCallback(udid, systemPort!, devicePort);
    }
    try {
      log.info(`Checking if flutter server is running on port ${devicePort}`);
      await waitForFlutterServer(forwardedPort!, packageName, flutterCaps);
      log.info(`Flutter server is successfully running on port ${devicePort}`);
      return forwardedPort!;
    } catch (e) {
      if (portReleaseCallback) {
        await portReleaseCallback(udid, systemPort!);
      }
    }
    devicePort++;
  }
  return null;
}
