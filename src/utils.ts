import AndroidUiautomator2Driver from 'appium-uiautomator2-driver';
import { findAPortNotInUse } from 'portscanner';
import { waitForCondition } from 'asyncbox';
import { JWProxy } from '@appium/base-driver';
import type { PortForwardCallback, PortReleaseCallback } from './types';
import type { AppiumFlutterDriver } from './driver';
import _ from 'lodash';

const DEVICE_PORT_RANGE = [9000, 9020];
const SYSTEM_PORT_RANGE = [10000, 11000];

export async function getProxyDriver(
   this: AppiumFlutterDriver,
   strategy: string,
): Promise<JWProxy | undefined> {
   if (['key', 'semantics label', 'text', 'type'].includes(strategy)) {
      return this.proxy;
   } else if (this.proxydriver instanceof AndroidUiautomator2Driver) {
      return this.proxydriver.uiautomator2.jwproxy;
   } else {
      return this.proxydriver.wda.jwproxy;
   }
}

export function isFlutterDriverCommand(command: string) {
   return (
      [
         'createSession',
         'deleteSession',
         'getSession',
         'getSessions',
         'findElement',
         'findElements',
         'findElementFromElement',
         'findElementsFromElement',
         'click',
         'getText',
         'setValue',
         'keys',
         'getName',
         'clear',
         'elementSelected',
         'elementEnabled',
         'getAttribute',
         'elementDisplayed',
         'execute',
      ].indexOf(command) >= 0
   );
}

export async function getFreePort(): Promise<number> {
   const [start, end] = SYSTEM_PORT_RANGE;
   return await findAPortNotInUse(start, end);
}

export async function waitForFlutterServerToBeActive(
   this: AppiumFlutterDriver,
   proxy: JWProxy,
   packageName: string,
   flutterPort: number,
): Promise<void> {
   await waitForCondition(
      async () => {
         try {
            const response: any = await proxy.command('/status', 'GET');
            if (!response) {
               return false;
            }
            if (response?.appInfo?.packageName === packageName) {
               this.log.info(
                  `Flutter server version the application is build with ${response.serverVersion}`,
               );
               return true;
            } else {
               this.log.error(
                  `Looking for flutter server with package ${packageName}. But found ${response.appInfo?.packageName}`,
               );
            }
         } catch (err: any) {
            this.log.info(
               `FlutterServer not reachable on port ${flutterPort}, Retrying..`,
            );
            return false;
         }
      },
      {
         waitMs: this.opts.flutterServerLaunchTimeout ?? 5000,
         intervalMs: 150,
      },
   );
}

export async function waitForFlutterServer(
   this: AppiumFlutterDriver,
   port: number,
   packageName: string,
) {
   const proxy = new JWProxy({
      server: '127.0.0.1',
      port: port,
   });
   await waitForFlutterServerToBeActive.bind(this)(proxy, packageName, port);
}

export async function fetchFlutterServerPort(
   this: AppiumFlutterDriver,
   {
      udid,
      systemPort,
      portForwardCallback,
      portReleaseCallback,
      packageName,
      isIosSimulator,
   }: {
      udid: string;
      systemPort?: number | null;
      portForwardCallback?: PortForwardCallback;
      portReleaseCallback?: PortReleaseCallback;
      packageName: string;
      isIosSimulator: boolean;
   },
): Promise<number | null> {
   const [startPort, endPort] = DEVICE_PORT_RANGE as [number, number];
   let devicePort = startPort;
   let forwardedPort = systemPort;

   if (isIosSimulator && systemPort) {
      try {
         this.log.info(
            `Checking if flutter server is running on port ${systemPort} for simulator with id ${udid}`,
         );
         await waitForFlutterServer.bind(this)(systemPort!, packageName);
         this.log.info(
            `Flutter server is successfully running on port ${systemPort}`,
         );
         return systemPort!;
      } catch (e) {
         return null;
      }
   }

   while (devicePort <= endPort) {
      /**
       * For ios simulators, we dont need a dedicated system port and no port forwarding is required
       * We need to use the same port range used by flutter server to check if the server is running
       */
      if (isIosSimulator) {
         forwardedPort = devicePort;
      }

      if (portForwardCallback) {
         await portForwardCallback(udid, forwardedPort!, devicePort);
      }
      try {
         this.log.info(
            `Checking if flutter server is running on port ${devicePort}`,
         );
         await waitForFlutterServer.bind(this)(forwardedPort!, packageName);
         this.log.info(
            `Flutter server is successfully running on port ${devicePort}`,
         );
         return forwardedPort!;
      } catch (e) {
         if (portReleaseCallback) {
            await portReleaseCallback(udid, forwardedPort!);
         }
         if (portForwardCallback) {
            await portForwardCallback(udid, systemPort!, devicePort);
         }
         try {
            this.log.info(
               `Checking if flutter server is running on port ${devicePort}`,
            );
            await waitForFlutterServer.bind(this)(forwardedPort!, packageName);
            this.log.info(
               `Flutter server is successfully running on port ${devicePort}`,
            );
            return forwardedPort!;
         } catch (e) {
            if (portReleaseCallback) {
               await portReleaseCallback(udid, systemPort!);
            }
         }
         devicePort++;
      }
   }
   return null;
}

export function isW3cCaps(caps: any) {
   if (!_.isPlainObject(caps)) {
      return false;
   }

   const isFirstMatchValid = () =>
      _.isArray(caps.firstMatch) &&
      !_.isEmpty(caps.firstMatch) &&
      _.every(caps.firstMatch, _.isPlainObject);
   const isAlwaysMatchValid = () => _.isPlainObject(caps.alwaysMatch);
   if (_.has(caps, 'firstMatch') && _.has(caps, 'alwaysMatch')) {
      return isFirstMatchValid() && isAlwaysMatchValid();
   }
   if (_.has(caps, 'firstMatch')) {
      return isFirstMatchValid();
   }
   if (_.has(caps, 'alwaysMatch')) {
      return isAlwaysMatchValid();
   }
   return false;
}

export function attachAppLaunchArguments(
   this: AppiumFlutterDriver,
   parsedCaps: any,
   ...caps: any
) {
   const w3cCaps = [...caps].find(isW3cCaps);
   // If no W3C caps are passed, session creation will eventually fail. So its not required to update the caps
   if (!w3cCaps) {
      return;
   }
   const platformName: string | undefined = parsedCaps['platformName'];
   const systemPort: string | undefined = parsedCaps['flutterSystemPort'];

   if (platformName && systemPort && platformName.toLowerCase() == 'ios') {
      w3cCaps.firstMatch ??= [];
      w3cCaps.alwaysMatch ??= {};
      const firstMatch = w3cCaps.firstMatch.find(
         (caps: Record<string, any>) => caps['appium:processArguments'],
      );
      const capsToUpdate = firstMatch ?? w3cCaps.alwaysMatch;
      capsToUpdate['appium:processArguments'] = _.assign(
         { args: [] },
         capsToUpdate['appium:processArguments'],
      );

      capsToUpdate['appium:processArguments'].args = _.flatten([
         capsToUpdate['appium:processArguments'].args,
         `--flutter-server-port=${systemPort}`,
      ]);

      this.log.info(
         `iOS platform detected and flutterSystemPort capability is present. 
         So attaching processArguments: ${JSON.stringify(capsToUpdate['appium:processArguments'])}`,
      );
   }
}
