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
   return await setupNewAndroidDriver(...args);
};

export async function androidPortForward(
   adb: ADB,
   systemPort: number,
   devicePort: number,
) {
   await adb.forwardPort(systemPort!, devicePort);
}

export async function androidRemovePortForward(adb: ADB, systemPort: number) {
   await adb.removePortForward(systemPort);
}
