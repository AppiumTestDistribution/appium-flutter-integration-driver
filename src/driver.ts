import { BaseDriver } from '@appium/base-driver';
import { desiredCapConstraints } from './desiredCaps';
import { JWProxy } from '@appium/base-driver';
import type {
  DefaultCreateSessionResult,
  DriverData,
  W3CDriverCaps,
  DriverCaps,
} from '@appium/types';
type FluttertDriverConstraints = typeof desiredCapConstraints;
import XCUITestDriver from 'appium-xcuitest-driver';
import AndroidUiautomator2Driver from 'appium-uiautomator2-driver';
import { createSession } from './session';
import {
  findElOrEls,
  click,
  getText,
  elementDisplayed,
  getAttribute,
  elementEnabled,
} from './commands/element';
import { getProxyDriver } from './utils';

export class AppiumFlutterDriver extends BaseDriver<FluttertDriverConstraints> {
  public proxydriver: XCUITestDriver | AndroidUiautomator2Driver;
  public flutterPort: number | null;
  public internalCaps: DriverCaps<FluttertDriverConstraints>;
  public proxy: JWProxy;
  click = click;
  findElOrEls = findElOrEls;
  getText = getText;
  getAttribute = getAttribute;
  elementDisplayed = elementDisplayed;
  elementEnabled = elementEnabled;
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
    ];
  }

  public async createSession(
    ...args
  ): Promise<DefaultCreateSessionResult<FluttertDriverConstraints>> {
    const [sessionId, caps] = await super.createSession(
      ...(JSON.parse(JSON.stringify(args)) as [
        W3CDriverCaps,
        W3CDriverCaps,
        W3CDriverCaps,
        DriverData[],
      ]),
    );
    this.internalCaps = caps;
    let sessionCreated = await createSession.bind(this)(
      sessionId,
      caps,
      ...JSON.parse(JSON.stringify(args)),
    );
    this.proxy = new JWProxy({
      server: '127.0.0.1',
      port: this.flutterPort,
    });
    await this.proxy.command('/session', 'POST', { capabilities: caps });
    return sessionCreated;
  }

  canProxy() {
    return true;
  }

  async deleteSession() {
    // do your own cleanup here
    // don't forget to call super!
    await this.proxydriver.adb.removePortForward(this.flutterPort);
    await this.proxydriver.deleteSession();
    super.deleteSession();
  }
}
