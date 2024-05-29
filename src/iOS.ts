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

async function portForward(flutterPort: any, udid: any) {
    // Need to do this for real device
  if (this.proxydriver instanceof XCUITestDriver && this.proxydriver.isRealDevice()) {
    log.info(`Forwarding port ${flutterPort} to device ${udid}`);
    await DEVICE_CONNECTIONS_FACTORY.requestConnection(udid, flutterPort, {
      usePortForwarding: true,
      devicePort: flutterPort,
    });
  }
}

export const startIOSSession = async (
  flutterDriver: AppiumFlutterDriver,
  caps: Record<string, any>, ...args: any[]
): Promise<[XCUITestDriver, number]> => {
  log.info(`Starting an IOS proxy session`);
  const iOSDriver = await setupNewIOSDriver(...args);

  // the session starts without any apps
  caps.flutterPort = caps.flutterPort || 8600;
  log.info('iOS session started', iOSDriver);
  await portForward(caps.flutterPort, caps.udid);
  return [iOSDriver, caps.flutterPort];
};
