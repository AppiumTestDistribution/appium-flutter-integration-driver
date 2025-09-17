import type { AppiumFlutterDriver } from './driver';
// @ts-ignore
import { XCUITestDriver } from 'appium-xcuitest-driver';
import { DEVICE_CONNECTIONS_FACTORY } from './iProxy';
import { XCUITestDriverOpts } from 'appium-xcuitest-driver/build/lib/driver';

export async function startIOSSession(
   this: AppiumFlutterDriver,
   ...args: any[]
): Promise<XCUITestDriver> {
   this.log.info(`Starting an IOS proxy session`);
   const iosdriver = new XCUITestDriver({} as XCUITestDriverOpts);
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
