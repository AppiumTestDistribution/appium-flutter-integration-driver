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
): Promise<[AndroidUiautomator2Driver, null]> => {
  log.info(`Starting an Android proxy session`);
  const androiddriver = await setupNewAndroidDriver(...args);

  // the session starts without any apps
  caps.flutterPort = caps.flutterPort || 8600;
  log.info('Android session started', androiddriver);
  await portForward(caps.flutterPort, caps.udid);
  return [androiddriver, caps.flutterPort];
};

const portForward = async (port: number, udid: string) => {
  let adb = new ADB();
  if (udid) adb.setDeviceId(udid);
  await adb.forwardPort(port, 8888);
  const adbForwardList = await adb.getForwardList();
  log.info(`Port forwarding: ${JSON.stringify(adbForwardList)}`);
};
