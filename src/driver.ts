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
import axios from 'axios';
import { log } from './logger';

export class AppiumFlutterDriver extends BaseDriver<FluttertDriverConstraints> {
  public proxydriver: XCUITestDriver | AndroidUiautomator2Driver;
  public flutterPort: number | null;
  public internalCaps: DriverCaps<FluttertDriverConstraints>;
  public proxy: JWProxy;
  constructor(args: any, shouldValidateCaps: boolean) {
    super(args, shouldValidateCaps);
    this.desiredCapConstraints = desiredCapConstraints;
    this.locatorStrategies = ['xpath', 'css selector', 'id', '-android uiautomator', 'accessibility id', '-ios predicate string', '-ios class chain', 'name', 'class name'];
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
    await this.proxydriver.deleteSession();
  }

  async findElOrEls(
    strategy: string,
    selector: string,
    mult: boolean,
    context: string,
  ): Promise<any> {
    log.info('Finding element or elements', strategy, selector, mult, context);
    if (mult) {
      return await this.proxy.command('/elements', 'POST', {
        strategy: 'key',
        selector: 'increment',
      });
    } else {
      return await this.proxy.command('/element', 'POST', {
        strategy: 'key',
        selector: 'increment',
      });
    }
  }

  async click(elId: string) {
    log.info('Clicking element', elId);
    return (
      await axios({
        url: `http://127.0.0.1:${this.flutterPort}/session/123/element/${elId}/click`,
        method: 'POST',
      })
    ).data.value;
  }
}
