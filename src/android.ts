import AndroidUiautomator2Driver from 'appium-uiautomator2-driver';
import { log } from './logger';
import type { InitialOpts } from '@appium/types';
import { AppiumFlutterDriver } from './driver';
import ADB from 'appium-adb';
import { sleep } from 'asyncbox';
import { fetchFlutterServerPort, getFreePort } from './utils';

const setupNewAndroidDriver = async (
  ...args: any[]
): Promise<AndroidUiautomator2Driver> => {
  const androiddriver = new AndroidUiautomator2Driver({} as InitialOpts);
  //@ts-ignore Args are ok
  await androiddriver.createSession(...args);
  return androiddriver;
};

export const startAndroidSession = async (
  flutterDriver: AppiumFlutterDriver,
  caps: Record<string, any>,
  ...args: any[]
): Promise<[AndroidUiautomator2Driver, null]> => {
  log.info(`Starting an Android proxy session`);
  const androiddriver = await setupNewAndroidDriver(...args);
  log.info('Looking for the port in where Flutter server is listening too...');
  await sleep(2000);
  const flutterServerPort = fetchFlutterServerPort(
    (androiddriver.adb.logcat?.logs as [{ message: string }]) || [],
  );
  caps.flutterServerPort = await portForward(
    caps.udid,
    flutterServerPort,
    caps.flutterServerPort,
  );
  return [androiddriver, caps.flutterServerPort];
};

const portForward = async (
  udid: string,
  devicePort: number,
  systemPort?: number,
) => {
  if (!systemPort) {
    systemPort = await getFreePort();
  }
  let adb = new ADB();
  if (udid) adb.setDeviceId(udid);
  await adb.forwardPort(systemPort!, devicePort);
  const adbForwardList = await adb.getForwardList();
  log.info(`Port forwarding: ${JSON.stringify(adbForwardList)}`);
  return systemPort;
};
