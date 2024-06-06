import { BaseDriver } from '@appium/base-driver';
import { desiredCapConstraints } from './desiredCaps';
import { JWProxy } from '@appium/base-driver';
import type {
  DefaultCreateSessionResult,
  DriverData,
  W3CDriverCaps,
  DriverCaps,
} from '@appium/types';
type FlutterDriverConstraints = typeof desiredCapConstraints;
import XCUITestDriver from 'appium-xcuitest-driver/build/lib/driver';
import AndroidUiautomator2Driver from 'appium-uiautomator2-driver';
import { createSession } from './session';
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

import {  isFlutterDriverCommand } from './utils';
import { W3C_WEB_ELEMENT_IDENTIFIER } from '@appium/support/build/lib/util';
import { waitForCondition } from 'asyncbox';

const DEFAULT_FLUTTER_SERVER_PORT = 8888;

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
      '-android uiautomator',
      'accessibility id',
      '-ios predicate string',
      '-ios class chain',
      'name',
      'key',
      'class name',
      'semantics label',
      'text',
    ];
  }

  static executeMethodMap = {
    'flutter: doubleClick': {
      command: 'doubleClick',
      params: {
        required: [],
        optional: ['origin', 'offset'],
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
  };

  async doubleClick(origin: any, offset: any) {
    return this.proxy?.command(
      `/session/:sessionId/appium/gestures/double_click`,
      'POST',
      {
        origin,
        offset,
      },
    );
    //console.log('DoubleTap', value, JSON.parse(JSON.stringify(value)).elementId);
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

  async waitForElementToBeVisible(element: any, locator: any, timeout: number) {
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
    if (element.ELEMENT || element[W3C_WEB_ELEMENT_IDENTIFIER]) {
      ELEMENT_CACHE.set(
        element.ELEMENT || element[W3C_WEB_ELEMENT_IDENTIFIER],
        this.proxy,
      );
    }
    return element;
  }
  async execute(script: any, args: any) {
    if (script.startsWith('mobile:')) {
      // @ts-ignore
      return await this.proxydriver.execute(script, args);
    }
    return await this.executeMethod(script, args);
  }

  async executeCommand(command: any, ...args: any) {
    if(isFlutterDriverCommand(command)) {
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
    let sessionCreated = await createSession.call(
      this,
      sessionId,
      caps,
      ...JSON.parse(JSON.stringify(args)),
    );

    if (
      this.proxydriver instanceof XCUITestDriver &&
      !this.proxydriver.isRealDevice()
    ) {
      // @ts-ignore
      this.flutterPort = DEFAULT_FLUTTER_SERVER_PORT;
    }

    // HACK for eliminatin socket hang up by waiting 1 sec
    await new Promise((r) => setTimeout(r, 1000));

    this.proxy = new JWProxy({
      server: '127.0.0.1',
      port: this.flutterPort,
    });
    await waitForCondition(async () => {
      // @ts-ignore
      let health = await this.proxy.command('/status', 'GET');
      console.log('Inside wait for condition', health, health === 'Flutter driver is ready to accept new connections');
      return health === 'Flutter driver is ready to accept new connections';
    })

    await this.proxy.command('/session', 'POST', { capabilities: caps });
    return sessionCreated;
  }

  canProxy() {
    return false;
  }

  async deleteSession() {
    if (this.proxydriver instanceof AndroidUiautomator2Driver) {
      // @ts-ignore
      await this.proxydriver.adb.removePortForward(this.flutterPort);
    }
    await this.proxydriver?.deleteSession();
    await super.deleteSession();
  }
}
