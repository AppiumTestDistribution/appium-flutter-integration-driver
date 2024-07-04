import AndroidUiautomator2Driver from 'appium-uiautomator2-driver';
import XCUITestDriver from 'appium-xcuitest-driver/build/lib/driver';
import { log } from './logger';
import { findAPortNotInUse } from 'portscanner';
import { waitForCondition } from 'asyncbox';
import { JWProxy } from '@appium/base-driver';
import { desiredCapConstraints } from './desiredCaps';
import { DriverCaps } from '@appium/types';
import type { PortForwardCallback, PortReleaseCallback } from './types';
import { Simctl } from 'node-simctl';
import path from 'path';
import fs from 'fs';

const DEVICE_PORT_RANGE = [9000, 9020];
const SYSTEM_PORT_RANGE = [10000, 11000];
const SIMULATOR_SERVER_CONFIG_PATH = path.join(
  'Documents',
  'flutter_server_config.json',
);
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

async function waitForFlutterServer(
  port: number,
  packageName: string,
  flutterCaps: DriverCaps<FlutterDriverConstraints>,
) {
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
          log.info(
            `Flutter server version the application is build with ${response.serverVersion}`,
          );
          return true;
        } else {
          log.info(
            `Looking for flutter server with package ${packageName}. But found ${response.appInfo?.packageName}`,
          );
          return false;
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
  flutterCaps,
  isIosSimulator
}: {
  udid: string;
  systemPort?: number | null;
  portForwardCallback?: PortForwardCallback;
  portReleaseCallback?: PortReleaseCallback;
  packageName: string;
  flutterCaps: DriverCaps<FlutterDriverConstraints>;
  isIosSimulator: boolean
}): Promise<number | null> {

  const [startPort, endPort] = DEVICE_PORT_RANGE as [number, number];
  let devicePort = startPort;
  let forwardedPort = systemPort;
  
  if(isIosSimulator && systemPort) {
    try {
      log.info(`Checking if flutter server is running on port ${systemPort} for simulator with id ${udid}`);
      await waitForFlutterServer(systemPort!, packageName, flutterCaps);
      log.info(`Flutter server is successfully running on port ${systemPort}`);
      return systemPort!;
    } catch (e) {
      return null;
    }
  }

  while (devicePort <= endPort) {
    if(isIosSimulator) {
      forwardedPort = devicePort;
    }

    if (portForwardCallback) {
      await portForwardCallback(udid, forwardedPort!, devicePort);
    }
    try {
      log.info(`Checking if flutter server is running on port ${devicePort}`);
      await waitForFlutterServer(forwardedPort!, packageName, flutterCaps);
      log.info(`Flutter server is successfully running on port ${devicePort}`);
      return forwardedPort!;
    } catch (e) {
      if (portReleaseCallback) {
        await portReleaseCallback(udid, forwardedPort!);
      }
    }
    devicePort++;
  }
  return null;
}
