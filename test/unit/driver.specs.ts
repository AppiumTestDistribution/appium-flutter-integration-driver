import { createSandbox, stub, spy } from 'sinon';
import { AppiumFlutterDriver } from '../../src/driver';
import * as utils from '../../src/utils';
import * as session from '../../src/session';
import AndroidUiautomator2Driver from 'appium-uiautomator2-driver';
import { JWProxy } from '@appium/base-driver';

const caps = {
  fistMatch: [{}],
  alwaysMatch: {
    platformName: 'iOS',
    'appium:deviceName': 'iPhone 6',
    'appium:app': '/foo.app',
    'appium:platformVersion': '10.0',
  },
};

describe('AppiumFlutterDriver', () => {
  let sandbox;
  let driver;
  let chai;
  let expect;

  before(async function () {
    chai = await import('chai');
    const chaiAsPromised = await import('chai-as-promised');

    chai.should();
    chai.use(chaiAsPromised.default);

    expect = chai.expect;
  });

  beforeEach(() => {
    sandbox = createSandbox();
    driver = new AppiumFlutterDriver({}, false);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createSession', () => {
    it('should call super.createSession with the correct arguments', async () => {
      const fakeSessionId = 'fake-session-id';
      const fakeCaps = {
        platformName: 'Android',
        flutterServerLaunchTimeout: 5000,
      };

      const superCreateSessionStub = sandbox
        .stub(AppiumFlutterDriver.prototype, 'createSession')
        .resolves([fakeSessionId, fakeCaps]);

      sandbox
        .stub(session, 'createSession')
        .resolves({ sessionId: fakeSessionId, caps: fakeCaps });
      sandbox.stub(utils, 'getFreePort').resolves(12345);
      sandbox.stub(utils, 'fetchFlutterServerPort').resolves(54321);

      const proxyDriverStub = sandbox.createStubInstance(
        AndroidUiautomator2Driver,
      );
      proxyDriverStub.opts = { appPackage: 'com.example.app' };

      const jwProxyStub = {
        command: sandbox.stub().resolves(),
      };
      sandbox.stub(JWProxy.prototype, 'command').callsFake(jwProxyStub.command);

      const args = [{} as any, {} as any, {} as any, [] as any[]];
      const result = await driver.createSession(...args);

      console.log(driver, result);

      expect(superCreateSessionStub.calledOnce).to.be.true;
      expect(superCreateSessionStub.calledWith(...args)).to.be.true;
      expect(result[0]).to.equal(fakeSessionId);
      expect(result[1]).to.deep.equal(fakeCaps);
      expect(
        jwProxyStub.command.calledWith('/session', 'POST', {
          capabilities: fakeCaps,
        }),
      ).to.be.true;
    });
  });

  describe('doubleClick', () => {
    it('should call the proxy command with the correct parameters', async () => {
      const origin = { x: 100, y: 200 };
      const offset = { x: 10, y: 20 };

      const result = await driver.doubleClick(origin, offset);

      expect(result).to.deep.equal({
        command: '/session/:sessionId/appium/gestures/double_click',
        method: 'POST',
        params: {
          origin,
          offset,
        },
      });
    });
  });
});
