import type { AppiumFlutterDriver } from './driver';
// @ts-ignore
import { Mac2Driver } from 'appium-mac2-driver';
import type { InitialOpts } from '@appium/types';
import { DEVICE_CONNECTIONS_FACTORY } from './iProxy';

export async function startMacOsSession(
   this: AppiumFlutterDriver,
   ...args: any[]
): Promise<Mac2Driver> {
   this.log.info(`Starting an MacOs proxy session`);
   const macOsDriver = new Mac2Driver({} as InitialOpts);
   await macOsDriver.createSession(...args);
   return macOsDriver;
}

export async function macOsPortForward(
   udid: string,
   systemPort: number,
   devicePort: number,
) {
   await DEVICE_CONNECTIONS_FACTORY.requestConnection(udid, systemPort, {
      usePortForwarding: true,
      devicePort: devicePort,
   });
}

export function macOsRemovePortForward(udid: string, systemPort: number) {
   DEVICE_CONNECTIONS_FACTORY.releaseConnection(udid, systemPort);
}
