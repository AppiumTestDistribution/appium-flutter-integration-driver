import AndroidUiautomator2Driver from 'appium-uiautomator2-driver';
import { log } from './logger';
import type { InitialOpts } from '@appium/types';
import { AppiumFlutterDriver } from './driver';
import ADB from 'appium-adb';

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
): Promise<AndroidUiautomator2Driver> => {
  log.info(`Starting an Android proxy session`);
  const androiddriver = await setupNewAndroidDriver(...args);
  return androiddriver;
};

export async function androidPortForward(
  udid: string,
  systemPort: number,
  devicePort: number,
) {
  let adb = new ADB();
  if (udid) adb.setDeviceId(udid);
  await adb.forwardPort(systemPort!, devicePort);
}

export async function androidRemovePortForward(
  udid: string,
  systemPort: number,
) {
  let adb = new ADB();
  if (udid) adb.setDeviceId(udid);
  await adb.removePortForward(systemPort);
}
