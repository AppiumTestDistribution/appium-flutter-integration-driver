import { AppiumFlutterDriver } from './driver';
// @ts-ignore
import XCUITestDriver from 'appium-xcuitest-driver';
import type { InitialOpts } from '@appium/types';
import { DEVICE_CONNECTIONS_FACTORY } from './iProxy';

export async function startIOSSession(
   this: AppiumFlutterDriver,
   ...args: any[]
): Promise<XCUITestDriver> {
   this.log.info(`Starting an IOS proxy session`);
   const iosdriver = new XCUITestDriver({} as InitialOpts);
   await iosdriver.createSession(...args.slice(1));
   return iosdriver;
}

export async function iosPortForward(
   udid: string,
   systemPort: number,
   devicePort: number,
) {
   await DEVICE_CONNECTIONS_FACTORY.requestConnection(udid, systemPort, {
      usePortForwarding: true,
      devicePort: devicePort,
   });
}

export function iosRemovePortForward(udid: string, systemPort: number) {
   DEVICE_CONNECTIONS_FACTORY.releaseConnection(udid, systemPort);
}
