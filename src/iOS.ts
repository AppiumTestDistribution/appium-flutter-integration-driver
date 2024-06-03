import { AppiumFlutterDriver } from './driver';
// @ts-ignore
import XCUITestDriver from 'appium-xcuitest-driver';
import type { InitialOpts } from '@appium/types';
import { log } from './logger';
import { DEVICE_CONNECTIONS_FACTORY } from './iProxy';

const setupNewIOSDriver = async (...args: any[]): Promise<XCUITestDriver> => {
  const iosdriver = new XCUITestDriver({} as InitialOpts);
  await iosdriver.createSession(...args);
  return iosdriver;
};

export async function portForward() {
  // Need to do this for real device
  if (
    this.proxydriver instanceof XCUITestDriver &&
    this.proxydriver.isRealDevice()
  ) {
    log.info(`Forwarding port ${this.flutterPort} to device ${this.proxydriver.opts.udid}`);
    await DEVICE_CONNECTIONS_FACTORY.requestConnection(this.proxydriver.opts.udid, this.flutterPort, {
      usePortForwarding: true,
      devicePort: this.flutterPort,
    });
  }
}

export const startIOSSession = async (
  flutterDriver: AppiumFlutterDriver,
  caps: Record<string, any>,
  ...args: any[]
): Promise<[XCUITestDriver, number]> => {
  log.info(`Starting an IOS proxy session`);
  const iOSDriver = await setupNewIOSDriver(...args);

  // the session starts without any apps
  caps.flutterPort = caps.flutterPort || 8600;
  log.info('iOS session started', iOSDriver);
  return [iOSDriver, caps.flutterPort];
};
