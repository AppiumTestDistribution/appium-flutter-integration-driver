import { desiredCapConstraints } from './desiredCaps';
import { JWProxy, BaseDriver } from '@appium/base-driver';
import type {
   DefaultCreateSessionResult,
   DriverData,
   W3CDriverCaps,
   DriverCaps,
} from '@appium/types';
type FlutterDriverConstraints = typeof desiredCapConstraints;
// @ts-ignore
import { XCUITestDriver } from 'appium-xcuitest-driver';
import { AndroidUiautomator2Driver } from 'appium-uiautomator2-driver';
import { createSession as createSessionMixin } from './session';
import {
   findElOrEls,
   click,
   getText,
   elementDisplayed,
   getAttribute,
   elementEnabled,
   setValue,
   clear,
   ELEMENT_CACHE,
} from './commands/element';
import {
   attachAppLaunchArguments,
   fetchFlutterServerPort,
   FLUTTER_LOCATORS,
   getFreePort,
   isFlutterDriverCommand,
   waitForFlutterServerToBeActive,
} from './utils';
import { util } from 'appium/support';
import { androidPortForward, androidRemovePortForward } from './android';
import { iosPortForward, iosRemovePortForward } from './iOS';
import type { PortForwardCallback, PortReleaseCallback } from './types';
import _ from 'lodash';

export class AppiumFlutterDriver extends BaseDriver<FlutterDriverConstraints> {
   // @ts-ignore
   public proxydriver: XCUITestDriver | AndroidUiautomator2Driver;
   public flutterPort: number | null | undefined;
   private internalCaps: DriverCaps<FlutterDriverConstraints> | undefined;
   public proxy: JWProxy | undefined;
   click = click;
   findElOrEls = findElOrEls;
   getText = getText;
   getAttribute = getAttribute;
   elementDisplayed = elementDisplayed;
   elementEnabled = elementEnabled;
   setValue = setValue;
   clear = clear;
   constructor(args: any, shouldValidateCaps: boolean) {
      super(args, shouldValidateCaps);
      this.desiredCapConstraints = desiredCapConstraints;
      this.locatorStrategies = [
         'xpath',
         'css selector',
         'id',
         'name',
         'class name',
         '-android uiautomator',
         'accessibility id',
         '-ios predicate string',
         '-ios class chain',
         ...FLUTTER_LOCATORS, //to support backward compatibility
         ...FLUTTER_LOCATORS.map((locator) => `-flutter ${locator}`),
      ];
   }

   static executeMethodMap = {
      'flutter: doubleClick': {
         command: 'doubleClick',
         params: {
            required: [],
            optional: ['origin', 'offset', 'locator'],
         },
      },
      'flutter: waitForVisible': {
         command: 'waitForElementToBeVisible',
         params: {
            required: [],
            optional: ['element', 'locator', 'timeout'],
         },
      },
      'flutter: waitForAbsent': {
         command: 'waitForElementToBeGone',
         params: {
            required: [],
            optional: ['element', 'locator', 'timeout'],
         },
      },
      'flutter: scrollTillVisible': {
         command: 'scrollTillVisible',
         params: {
            required: [],
            optional: [
               'finder',
               'scrollView',
               'delta',
               'maxScrolls',
               'settleBetweenScrollsTimeout',
               'dragDuration',
               'scrollDirection',
            ],
         },
      },
      'flutter: longPress': {
         command: 'longPress',
         params: {
            required: [],
            optional: ['origin', 'offset', 'locator'],
         },
      },
      'flutter: dragAndDrop': {
         command: 'dragAndDrop',
         params: {
            required: ['source', 'target'],
         },
      },
      'flutter: launchApp': {
         command: 'mobilelaunchApp',
         params: {
            required: ['appId'],
            optional: ['arguments', 'environment'],
         },
      },
      'flutter: injectImage': {
         command: 'injectImage',
         params: {
            required: ['base64Image'],
         },
      },
      'flutter: activateInjectedImage': {
         command: 'activateInjectedImage',
         params: {
            required: ['imageId'],
         },
      },
   };

   async doubleClick(origin: any, offset: any, locator: any) {
      return this.proxy?.command(
         `/session/:sessionId/appium/gestures/double_click`,
         'POST',
         {
            origin,
            offset,
            locator,
         },
      );
      //console.log('DoubleTap', value, JSON.parse(JSON.stringify(value)).elementId);
   }

   async injectImage(base64Image: string) {
      async function grantPermissions(permission: string) {
         await this.proxydriver.execute('mobile: changePermissions', {
            permissions: [permission],
            action: 'allow',
            target: 'appops',
         });
      }

      if (this.proxydriver instanceof AndroidUiautomator2Driver) {
         // @ts-ignore
         if (this.proxydriver.uiautomator2.adb._apiLevel < 33) {
            await grantPermissions.call(this, 'WRITE_EXTERNAL_STORAGE');
            await grantPermissions.call(this, 'READ_EXTERNAL_STORAGE');
         } else {
            await grantPermissions.call(this, 'MANAGE_EXTERNAL_STORAGE');
         }
      }
      return this.proxy?.command(`/session/:sessionId/inject_image`, 'POST', {
         base64Image,
      });
   }

   async activateInjectedImage(imageId: string) {
      return this.proxy?.command(
         `/session/:sessionId/activate_inject_image`,
         'POST',
         {
            imageId,
         },
      );
   }

   async executeCommand(command: any, ...args: any) {
      if (isFlutterDriverCommand(command)) {
         return await super.executeCommand(command, ...args);
      }
      return await this.proxydriver.executeCommand(command as string, ...args);
   }

   public async createSession(
      ...args: any[]
   ): Promise<DefaultCreateSessionResult<FlutterDriverConstraints>> {
      const [sessionId, caps] = await super.createSession(
         ...(JSON.parse(JSON.stringify(args)) as [
            W3CDriverCaps,
            W3CDriverCaps,
            W3CDriverCaps,
            DriverData[],
         ]),
      );

      this.internalCaps = caps;
      /**
       * To support parallel execution in iOS simulators
       * flutterServerPort need to be passed as lauch argument using appium:processArguments
       * Refer: https://appium.github.io/appium-xcuitest-driver/latest/reference/capabilities/
       */
      attachAppLaunchArguments.bind(this)(caps, ...args);

      let sessionCreated = await createSessionMixin.bind(this)(
         sessionId,
         caps,
         ...JSON.parse(JSON.stringify(args)),
      );
      const packageName =
         this.proxydriver instanceof AndroidUiautomator2Driver
            ? this.proxydriver.opts.appPackage!
            : this.proxydriver.opts.bundleId!;

      const isIosSimulator =
         this.proxydriver instanceof XCUITestDriver &&
         !this.proxydriver.isRealDevice();

      const portcallbacks: {
         portForwardCallback?: PortForwardCallback;
         portReleaseCallback?: PortReleaseCallback;
      } = {};
      if (this.proxydriver instanceof AndroidUiautomator2Driver) {
         portcallbacks.portForwardCallback = async (
            _: string,
            systemPort: number,
            devicePort: number,
         ) =>
            await androidPortForward(
               // @ts-ignore ADB instance is ok
               (this.proxydriver as AndroidUiautomator2Driver).adb,
               systemPort,
               devicePort,
            );
         portcallbacks.portReleaseCallback = async (
            _: string,
            systemPort: number,
         ) =>
            await androidRemovePortForward(
               // @ts-ignore ADB instance is ok
               (this.proxydriver as AndroidUiautomator2Driver).adb,
               systemPort,
            );
      } else if (!isIosSimulator) {
         portcallbacks.portForwardCallback = iosPortForward;
         portcallbacks.portReleaseCallback = iosRemovePortForward;
      }

      const systemPort =
         this.internalCaps.flutterSystemPort ||
         (isIosSimulator ? null : await getFreePort());
      const udid = this.proxydriver.opts.udid!;

      this.flutterPort = await fetchFlutterServerPort.bind(this)({
         udid,
         packageName,
         ...portcallbacks,
         systemPort,
         isIosSimulator,
      });

      if (!this.flutterPort) {
         throw new Error(
            `Flutter server is not started. ` +
               `Please make sure the application under test is configured properly.Please refer ` +
               `https://github.com/AppiumTestDistribution/appium-flutter-integration-driver?tab=readme-ov-file#how-to-use-appium-flutter-integration-driver.`,
         );
      }
      // @ts-ignore
      this.proxy = new JWProxy({
         server: this.internalCaps.address || '127.0.0.1',
         port: this.flutterPort,
      });

      await this.proxy.command('/session', 'POST', { capabilities: caps });
      return sessionCreated;
   }
   async waitForElementToBeGone(element: any, locator: any, timeout: number) {
      return this.proxy?.command(
         `/session/:sessionId/element/wait/absent`,
         'POST',
         {
            element,
            locator,
            timeout,
         },
      );
   }

   async waitForElementToBeVisible(
      element: any,
      locator: any,
      timeout: number,
   ) {
      return this.proxy?.command(
         `/session/:sessionId/element/wait/visible`,
         'POST',
         {
            element,
            locator,
            timeout,
         },
      );
   }

   async longPress(origin: any, offset: any, locator: any) {
      return this.proxy?.command(
         `/session/:sessionId/appium/gestures/long_press`,
         'POST',
         {
            origin,
            offset,
            locator,
         },
      );
   }

   async dragAndDrop(source: any, target: any) {
      return this.proxy?.command(
         `/session/:sessionId/appium/gestures/drag_drop`,
         'POST',
         {
            source,
            target,
         },
      );
   }

   async scrollTillVisible(
      finder: any,
      scrollView: any,
      delta: any,
      maxScrolls: any,
      settleBetweenScrollsTimeout: any,
      dragDuration: any,
      scrollDirection: string,
   ) {
      const element: any = await this.proxy?.command(
         `/session/:sessionId/appium/gestures/scroll_till_visible`,
         'POST',
         {
            finder,
            scrollView,
            delta,
            maxScrolls,
            settleBetweenScrollsTimeout,
            dragDuration,
            scrollDirection,
         },
      );
      if (element.ELEMENT || element[util.W3C_WEB_ELEMENT_IDENTIFIER]) {
         ELEMENT_CACHE.set(
            element.ELEMENT || element[util.W3C_WEB_ELEMENT_IDENTIFIER],
            this.proxy,
         );
      }
      return element;
   }

   async execute(script: any, args: any) {
      if (script.startsWith('flutter:')) {
         return await this.executeMethod(script, args);
      }
      // @ts-ignore
      return await this.proxydriver.execute(script, args);
   }

   canProxy() {
      return false;
   }

   async deleteSession() {
      if (
         this.proxydriver instanceof AndroidUiautomator2Driver &&
         this.flutterPort
      ) {
         // @ts-ignore
         await this.proxydriver.adb.removePortForward(this.flutterPort);
      }
      await this.proxydriver?.deleteSession();
      await super.deleteSession();
   }

   async mobilelaunchApp(appId: string, args: string[], environment: any) {
      let activateAppResponse;
      const launchArgs = _.assign(
         { arguments: [] as string[] },
         { arguments: args, environment },
      );

      // Add port parameter to launch argument and only supported for iOS
      if (this.proxydriver instanceof XCUITestDriver) {
         launchArgs.arguments = _.flatten([
            launchArgs.arguments,
            `--flutter-server-port=${this.internalCaps?.flutterSystemPort || this.flutterPort}`,
         ]);
         this.log.info(
            'Attaching launch arguments to XCUITestDriver ' +
               JSON.stringify(launchArgs),
         );
         activateAppResponse = await this.proxydriver.execute(
            'mobile: launchApp',
            [{ bundleId: appId, ...launchArgs }],
         );
      } else {
         //@ts-ignore this.proxydriver will be an instance of AndroidUiautomator2Driver
         activateAppResponse = await this.proxydriver.execute(
            'mobile: activateApp',
            [{ appId }],
         );
      }

      await waitForFlutterServerToBeActive.bind(this)(
         this.proxy,
         appId,
         this.flutterPort,
      );
      await this.proxy?.command('/session', 'POST', {
         capabilities: this.proxydriver.originalCaps,
      });
      return activateAppResponse;
   }
}
