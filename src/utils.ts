import { AndroidUiautomator2Driver } from 'appium-uiautomator2-driver';
// @ts-ignore
import { XCUITestDriver } from 'appium-xcuitest-driver';
// @ts-ignore
import { Mac2Driver } from 'appium-mac2-driver';
import { findAPortNotInUse } from 'portscanner';
import { waitForCondition } from 'asyncbox';
import { JWProxy } from '@appium/base-driver';
import type { PortForwardCallback, PortReleaseCallback } from './types';
import { type AppiumFlutterDriver } from './driver';
import _ from 'lodash';
import type { StringRecord } from '@appium/types';
import { node } from 'appium/support';
import path from 'node:path';
import fs from 'node:fs';
import semver from 'semver';

const DEVICE_PORT_RANGE = [9000, 9020];
const SYSTEM_PORT_RANGE = [10000, 11000];
const {
   appium: { flutterServerVersion: FLUTTER_SERVER_VERSION_REQ },
   version: PACKAGE_VERSION,
} = readManifest();
export const FLUTTER_LOCATORS = [
   'key',
   'semantics label',
   'text',
   'type',
   'text containing',
   'descendant',
   'ancestor',
];
export async function getProxyDriver(
   this: AppiumFlutterDriver,
   strategy: string,
): Promise<JWProxy | undefined> {
   if (strategy.startsWith('-flutter') || FLUTTER_LOCATORS.includes(strategy)) {
      this.log.debug(
         `getProxyDriver: using flutter driver, strategy: ${strategy}`,
      );
      return this.proxy;
   } else if (this.proxydriver instanceof AndroidUiautomator2Driver) {
      this.log.debug(
         'getProxyDriver: using AndroidUiautomator2Driver driver for Android',
      );
      // @ts-ignore Proxy instance is OK
      return this.proxydriver.uiautomator2.jwproxy;
   } else if (this.proxydriver instanceof XCUITestDriver) {
      this.log.debug('getProxyDriver: using XCUITestDriver driver for iOS');
      // @ts-ignore Proxy instance is OK
      return this.proxydriver.wda.jwproxy;
   } else if (this.proxydriver instanceof Mac2Driver) {
      this.log.debug('getProxyDriver: using Mac2Driver driver for mac');
      // @ts-ignore Proxy instance is OK
      return this.proxydriver.wda.proxy;
   } else {
      throw new Error(
         `proxydriver is unknown type (${typeof this.proxydriver})`,
      );
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
         'getElementRect',
         'getSize',
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
         let response: unknown;
         try {
            response = await proxy.command('/status', 'GET');
         } catch (err: any) {
            this.log.info(
               `FlutterServer not reachable on port ${flutterPort}, Retrying..`,
            );
            return false;
         }
         return validateServerStatus.bind(this)(response, packageName);
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
      base: '',
      reqBasePath: '',
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

   if (isIosSimulator && (systemPort || devicePort)) {
      try {
         this.log.info(
            `Checking if flutter server is running on port ${systemPort || devicePort} for simulator with id ${udid}`,
         );
         await waitForFlutterServer.bind(this)(
            (systemPort || devicePort),
            packageName,
         );
         this.log.info(
            `Flutter server is successfully running on port ${systemPort || devicePort}`,
         );
         return (systemPort || devicePort);
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

function validateServerStatus(
   this: AppiumFlutterDriver,
   status: unknown,
   packageName: string,
): boolean {
   const compatibilityMessage =
      `Please check the driver readme to ensure the compatibility ` +
      `between the server module integrated into the application under test ` +
      `and the current driver version ${PACKAGE_VERSION}.`;
   const formattedStatus = _.truncate(JSON.stringify(status), { length: 200 });
   const logAndThrow = (errMsg: string) => {
      this.log.info(errMsg);
      throw new Error(errMsg);
   };
   if (!_.isPlainObject(status)) {
      logAndThrow(
         `The server response ${formattedStatus} ` +
            `is not a valid object. ${compatibilityMessage}`,
      );
   }
   const statusMap = status as StringRecord;
   if (!statusMap.appInfo || !statusMap.appInfo?.packageName) {
      logAndThrow(
         `The server response ${formattedStatus} ` +
            `does not contain a package name. ${compatibilityMessage}`,
      );
   }
   if (statusMap.appInfo.packageName !== packageName) {
      logAndThrow(
         `The server response ` +
            `contains an unexpected package name (${statusMap.appInfo.packageName} != ${packageName}). ` +
            `Does this server belong to another app?`,
      );
   }
   if (!statusMap.serverVersion) {
      logAndThrow(
         `The server response ${formattedStatus} ` +
            `does not contain a valid server version. ${compatibilityMessage}`,
      );
   }
   if (!semver.satisfies(statusMap.serverVersion, FLUTTER_SERVER_VERSION_REQ)) {
      logAndThrow(
         `The server version ${statusMap.serverVersion} does not satisfy the driver ` +
            `version requirement '${FLUTTER_SERVER_VERSION_REQ}'. ` +
            compatibilityMessage,
      );
   }
   return true;
}

function readManifest(): StringRecord {
   return JSON.parse(
      fs.readFileSync(
         path.join(
            node.getModuleRootSync(
               'appium-flutter-integration-driver',
               __filename,
            )!,
            'package.json',
         ),
         { encoding: 'utf8' },
      ),
   );
}
