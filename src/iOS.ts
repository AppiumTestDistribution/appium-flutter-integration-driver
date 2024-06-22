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

export const startIOSSession = async (
  flutterDriver: AppiumFlutterDriver,
  caps: Record<string, any>,
  ...args: any[]
): Promise<XCUITestDriver> => {
  log.info(`Starting an IOS proxy session`);
  return await setupNewIOSDriver(...args);
};

export async function iosPortForward(
  udid: string,
  systemPort: number,
  devicePort: number,
) {
  log.info(
    `Forwarding port ${systemPort} to device port ${devicePort} ${udid}`,
  );
  await DEVICE_CONNECTIONS_FACTORY.requestConnection(udid, systemPort, {
    usePortForwarding: true,
    devicePort: devicePort,
  });
}

export function iosRemovePortForward(udid: string, systemPort: number) {
  DEVICE_CONNECTIONS_FACTORY.releaseConnection(udid, systemPort);
}
