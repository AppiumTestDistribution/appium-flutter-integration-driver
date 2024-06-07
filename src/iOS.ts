import { AppiumFlutterDriver } from './driver';
// @ts-ignore
import XCUITestDriver from 'appium-xcuitest-driver';
import type { InitialOpts } from '@appium/types';
import { log } from './logger';
import { DEVICE_CONNECTIONS_FACTORY } from './iProxy';
import { sleep } from 'asyncbox';
import { fetchFlutterServerPort, getFreePort } from './utils';

const setupNewIOSDriver = async (...args: any[]): Promise<XCUITestDriver> => {
  const iosdriver = new XCUITestDriver({} as InitialOpts);
  await iosdriver.createSession(...args);
  return iosdriver;
};

const portForward = async (
  udid: string,
  systemPort: number,
  devicePort: any,
) => {
  if (!systemPort) {
    systemPort = await getFreePort();
  }
  log.info(
    `Forwarding port ${systemPort} to device port ${devicePort} ${udid}`,
  );
  await DEVICE_CONNECTIONS_FACTORY.requestConnection(udid, systemPort, {
    usePortForwarding: true,
    devicePort: devicePort,
  });
  return systemPort;
};

export const startIOSSession = async (
  flutterDriver: AppiumFlutterDriver,
  caps: Record<string, any>,
  ...args: any[]
): Promise<[XCUITestDriver, number]> => {
  log.info(`Starting an IOS proxy session`);
  const iOSDriver = await setupNewIOSDriver(...args);
  log.info('Looking for port Flutter server is listening too...');
  await sleep(2000);
  const flutterServerPort = fetchFlutterServerPort(iOSDriver.logs.syslog.logs);
  if (iOSDriver.isRealDevice()) {
    caps.flutterServerPort = await portForward(
      iOSDriver.udid,
      caps.flutterServerPort,
      flutterServerPort,
    );
  } else {
    //incase of emulator use the same port where the flutter server is running
    caps.flutterServerPort = flutterServerPort;
  }
  log.info('iOS session started', iOSDriver);
  return [iOSDriver, caps.flutterServerPort];
};
