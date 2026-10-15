import type { AppiumFlutterDriver } from './driver.js';
// @ts-ignore
import { XCUITestDriver } from 'appium-xcuitest-driver';
import { DEVICE_CONNECTIONS_FACTORY } from './iProxy.js';

export async function startIOSSession(
   this: AppiumFlutterDriver,
   ...args: any[]
): Promise<XCUITestDriver> {
   this.log.info(`Starting an IOS proxy session`);
   const iosdriver = new XCUITestDriver(
      {} as ConstructorParameters<typeof XCUITestDriver>[0],
   );
   await iosdriver.createSession.apply(iosdriver, args);
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
