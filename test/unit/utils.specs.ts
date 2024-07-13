// @ts-nocheck
import * as utils from '../../src/utils';
import { AppiumFlutterDriver } from '../../src/driver';
import { JWProxy } from 'appium/driver';
import sinon from 'sinon';


describe('attachAppLaunchArguments', function() {
   let driver;
   let chai, expect;
   let sandbox;

   beforeEach(async function() {
      chai = await import('chai');
      const chaiAsPromised = await import('chai-as-promised');

      chai.should();
      chai.use(chaiAsPromised.default);

      expect = chai.expect;
      sandbox = sinon.createSandbox();
      driver = new AppiumFlutterDriver();
      driver.log;
      const debugStrub = sandbox.stub(driver._log, 'info');
      sandbox.stub(Object.getPrototypeOf(driver), 'log').get(() => {
         return { info: sandbox.spy() };
      });
   });

   afterEach(function() {
      sandbox.restore();
   });

   it('should attach flutter server port to processArguments for iOS platform', function() {
      const parsedCaps = { platformName: 'iOS', flutterSystemPort: '12345' };
      const caps = [{}, { alwaysMatch: {}, firstMatch: [{}] }];

      utils.attachAppLaunchArguments.call(driver, parsedCaps, ...caps);

      const expectedArgs = ['--flutter-server-port=12345'];
      expect(caps[1].alwaysMatch['appium:processArguments'].args).to.deep.equal(expectedArgs);

   });

   it('should not modify caps if no W3C caps are passed', function() {
      const parsedCaps = { platformName: 'iOS', flutterSystemPort: '12345' };
      const caps = [{}]; // No W3C caps

      utils.attachAppLaunchArguments.call(driver, parsedCaps, ...caps);

      expect(caps[0]).to.deep.equal({});
   });

   it('should not modify caps if platform is not iOS', function() {
      const parsedCaps = { platformName: 'Android', flutterSystemPort: '12345' };
      const caps = [{}, { alwaysMatch: {}, firstMatch: [{}] }];

      utils.attachAppLaunchArguments.call(driver, parsedCaps, ...caps);

      expect(caps[1].firstMatch[0]).to.not.have.property('appium:processArguments');
   });
});

describe('Utils Test', function() {
   let chai, expect;
   let sandbox: sinon.SinonSandbox;
   let driver: AppiumFlutterDriver;
   let proxy: JWProxy;
   before(async function () {
      chai = await import('chai');
      const chaiAsPromised = await import('chai-as-promised');

      chai.should();
      chai.use(chaiAsPromised.default);

      expect = chai.expect;
      sandbox = sinon.createSandbox();
      driver = new AppiumFlutterDriver();
      proxy = new JWProxy({ server: '127.0.0.1', port: 4723 });
      driver.proxy = function() {};
      // Mocking proxydriver and its wda property
      driver.proxydriver = {
         wda: {
            jwproxy: {
               // Mock any methods of jwproxy that you need for your tests
            }
         }
      };
   });
   afterEach(function() {
      sandbox.restore();
   });
   it('should return the proxy for valid strategies', async function() {
      sandbox.stub(driver, 'proxy').value(proxy);
      const result = await utils.getProxyDriver.call(driver, 'key');
      expect(result).to.equal(proxy);
   });

   it('should return true for valid W3C capabilities', function() {
      const caps = {
         alwaysMatch: { browserName: 'chrome' },
         firstMatch: [{}],
      };
      expect(utils.isW3cCaps(caps)).to.be.true;
   });

   it('should return false for non-object values', function() {
      expect(utils.isW3cCaps(null)).to.be.false;
      expect(utils.isW3cCaps(undefined)).to.be.false;
      expect(utils.isW3cCaps(42)).to.be.false;
      expect(utils.isW3cCaps('string')).to.be.false;
   });

   it('should return false for empty objects', function() {
      expect(utils.isW3cCaps({})).to.be.false;
   });

   it('should return false for objects missing both alwaysMatch and firstMatch', function() {
      const caps = { browserName: 'chrome' };
      expect(utils.isW3cCaps(caps)).to.be.false;
   });

   it('should return true for objects with valid alwaysMatch and empty firstMatch', function() {
      const caps = {
         alwaysMatch: { platformName: 'iOS' },
         firstMatch: [{}],
      };
      expect(utils.isW3cCaps(caps)).to.be.true;
   });

   it('should return true for objects with valid firstMatch and no alwaysMatch', function() {
      const caps = {
         firstMatch: [{ platformName: 'Android' }],
      };
      expect(utils.isW3cCaps(caps)).to.be.true;
   });

   it('should return false for objects with invalid firstMatch structure', function() {
      const caps = {
         firstMatch: 'invalid',
      };
      expect(utils.isW3cCaps(caps)).to.be.false;
   });

   it('should return false for objects with invalid alwaysMatch structure', function() {
      const caps = {
         alwaysMatch: 'invalid',
      };
      expect(utils.isW3cCaps(caps)).to.be.false;
   });
});
