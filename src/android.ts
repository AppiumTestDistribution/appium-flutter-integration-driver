import { AndroidUiautomator2Driver } from 'appium-uiautomator2-driver';
import type { InitialOpts } from '@appium/types';
import type { AppiumFlutterDriver } from './driver';
import type ADB from 'appium-adb';

export async function startAndroidSession(
   this: AppiumFlutterDriver,
   ...args: any[]
): Promise<AndroidUiautomator2Driver> {
   this.log.info(`Starting an Android proxy session`);
   const androiddriver = new AndroidUiautomator2Driver();
   //@ts-ignore Args are ok
   await androiddriver.createSession(...args);
   return androiddriver;
}

export async function androidPortForward(
   adb: ADB,
   systemPort: number,
   devicePort: number,
) {
   await adb.forwardPort(systemPort, devicePort);
}

export async function androidRemovePortForward(adb: ADB, systemPort: number) {
   await adb.removePortForward(systemPort);
}
