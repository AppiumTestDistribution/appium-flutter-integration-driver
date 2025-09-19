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
   getElementRect,
} from './commands/element';
import {
   attachAppLaunchArguments,
   fetchFlutterServerPort,
   FLUTTER_LOCATORS,
   getFreePort,
   isFlutterDriverCommand,
   waitForFlutterServerToBeActive,
} from './utils';
import { logger, util } from 'appium/support';
import { androidPortForward, androidRemovePortForward } from './android';
import { iosPortForward, iosRemovePortForward } from './iOS';
import type { PortForwardCallback, PortReleaseCallback } from './types';
import _ from 'lodash';

import type { RouteMatcher } from '@appium/types';

const WEBVIEW_NO_PROXY = [
   [`GET`, new RegExp(`^/session/[^/]+/appium`)],
   [`GET`, new RegExp(`^/session/[^/]+/context`)],
   [`GET`, new RegExp(`^/session/[^/]+/element/[^/]+/rect`)],
   [`GET`, new RegExp(`^/session/[^/]+/log/types$`)],
   [`GET`, new RegExp(`^/session/[^/]+/orientation`)],
   [`POST`, new RegExp(`^/session/[^/]+/appium`)],
   [`POST`, new RegExp(`^/session/[^/]+/context`)],
   [`POST`, new RegExp(`^/session/[^/]+/log$`)],
   [`POST`, new RegExp(`^/session/[^/]+/orientation`)],
   [`POST`, new RegExp(`^/session/[^/]+/touch/multi/perform`)],
   [`POST`, new RegExp(`^/session/[^/]+/touch/perform`)],
] as import('@appium/types').RouteMatcher[];

export class AppiumFlutterDriver extends BaseDriver<FlutterDriverConstraints> {
   // @ts-ignore
   public proxydriver: XCUITestDriver | AndroidUiautomator2Driver;
   public flutterPort: number | null | undefined;
   private internalCaps: DriverCaps<FlutterDriverConstraints> | undefined;
   public proxy: JWProxy | undefined;
   private proxyWebViewActive: boolean = false;
   public readonly NATIVE_CONTEXT_NAME: string = `NATIVE_APP`;
   public currentContext: string = this.NATIVE_CONTEXT_NAME;
   click = click;
   findElOrEls = findElOrEls;
   getText = getText;
   getAttribute = getAttribute;
   getElementRect = getElementRect;
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
         '-flutter descendant',
         '-flutter ancestor',
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
      'flutter: renderTree': {
         command: 'renderTree',
         params: {
            required: [],
            optional: ['widgetType', 'text', 'key'],
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
      if (
         this.currentContext === this.NATIVE_CONTEXT_NAME &&
         isFlutterDriverCommand(command)
      ) {
         return await super.executeCommand(command, ...args);
      } else {
         this.log.info(
            `Executing the command: ${command} with args: ${args} and flutterCommand ${isFlutterDriverCommand(command)}`,
         );
      }

      this.handleContextSwitch(command, args);
      logger.default.info(
         `Executing the proxy command: ${command} with args: ${args}`,
      );
      return await this.proxydriver.executeCommand(command as string, ...args);
   }

   private handleContextSwitch(command: string, args: any[]): void {
      if (command === 'setContext') {
         const isWebviewContext =
            typeof args[0] === 'string' && args[0].includes('WEBVIEW');
         if (typeof args[0] === 'string' && args[0].length > 0) {
            this.currentContext = args[0];
         } else {
            logger.default.warn(
               `Attempted to set context to invalid value: ${args[0]}. Keeping current context: ${this.currentContext}`,
            );
         }

         if (isWebviewContext) {
            this.proxyWebViewActive = true;
         } else {
            this.proxyWebViewActive = false;
         }
      }
   }

   public getProxyAvoidList(): RouteMatcher[] {
      return WEBVIEW_NO_PROXY;
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

   public proxyActive(): boolean {
      // In WebView context, all request should go to each driver
      // so that they can handle http request properly.
      // On iOS, WebView context is handled by XCUITest driver while Android is by chromedriver.
      // It means XCUITest driver should keep the XCUITest driver as a proxy,
      // while UIAutomator2 driver should proxy to chromedriver instead of UIA2 proxy.
      return (
         this.proxyWebViewActive &&
         !(this.proxydriver instanceof XCUITestDriver)
      );
   }

   public canProxy(): boolean {
      return this.proxyWebViewActive;
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
      this.currentContext = this.NATIVE_CONTEXT_NAME;
      this.proxyWebViewActive = false;
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
         capabilities: Object.assign(
            {},
            this.proxydriver.originalCaps?.alwaysMatch,
            this.proxydriver.originalCaps?.firstMatch[0],
         ),
      });
      return activateAppResponse;
   }

   async renderTree(widgetType?: string, text?: string, key?: string) {
      const body: Record<string, string> = {};

      if (widgetType !== undefined) {
         body['widgetType'] = widgetType;
      }
      if (text !== undefined) {
         body['text'] = text;
      }
      if (key !== undefined) {
         body['key'] = key;
      }

      const url = `/session/${this.sessionId}/element/render_tree`;
      return this.proxy?.command(url, 'POST', body);
   }
}
