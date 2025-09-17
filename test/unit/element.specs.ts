// @ts-nocheck
import sinon from 'sinon';
import * as utils from '../../src/utils';
import { AndroidUiautomator2Driver } from 'appium-uiautomator2-driver';
// @ts-ignore
import { XCUITestDriver } from 'appium-xcuitest-driver';
// @ts-ignore
import { Mac2Driver } from 'appium-mac2-driver';
import { W3C_ELEMENT_KEY } from 'appium/driver';
import {
   ELEMENT_CACHE,
   clear,
   click,
   elementDisplayed,
   elementEnabled,
   findElOrEls,
   getAttribute,
   getElementRect,
   getText,
   setValue,
} from '../../src/commands/element';

describe('Element Interaction Functions', () => {
   let sandbox, chai, expect;
   let mockDriver;
   let mockAppiumFlutterDriver;

   before(async function () {
      chai = await import('chai');
      const chaiAsPromised = await import('chai-as-promised');

      chai.should();
      chai.use(chaiAsPromised.default);

      expect = chai.expect;
   });

   beforeEach(() => {
      sandbox = sinon.createSandbox();
      mockDriver = {
         command: sandbox.stub().resolves({}) as any,
      };
      mockAppiumFlutterDriver = {
         proxydriver: {},
      };
      sandbox.stub(utils, 'getProxyDriver').resolves(mockDriver);
   });

   afterEach(() => {
      sandbox.restore();
      ELEMENT_CACHE.clear();
   });

   describe('findElOrEls', () => {
      it('should find a single element correctly', async () => {
         const element = { ELEMENT: 'elem1' };
         mockDriver.command.resolves(element as any);
         mockDriver.constructor = { name: 'NotJWProxy' };
         mockAppiumFlutterDriver.proxydriver = {
            constructor: { name: 'NotAndroidUiautomator2Driver' },
         };

         const result = await findElOrEls.call(
            mockAppiumFlutterDriver,
            'strategy',
            'selector',
            false,
            'context',
         );

         expect(result).to.deep.equal(element);
         expect(ELEMENT_CACHE.get('elem1')).to.equal(mockDriver);
         expect(
            mockDriver.command.calledWith('/element', 'POST', {
               using: 'strategy',
               value: 'selector',
               context: 'context',
            }),
         ).to.be.true;
      });

      it('should find multiple elements correctly', async () => {
         const elements = [{ ELEMENT: 'elem1' }, { ELEMENT: 'elem2' }];
         mockDriver.command.resolves(elements);
         mockDriver.constructor = { name: 'NotJWProxy' };
         mockAppiumFlutterDriver.proxydriver = {
            constructor: { name: 'NotAndroidUiautomator2Driver' },
         };

         const result = await findElOrEls.call(
            mockAppiumFlutterDriver,
            'strategy',
            'selector',
            true,
            'context',
         );

         expect(result).to.deep.equal(elements);
         expect(ELEMENT_CACHE.get('elem1')).to.equal(mockDriver);
         expect(ELEMENT_CACHE.get('elem2')).to.equal(mockDriver);
         expect(
            mockDriver.command.calledWith('/elements', 'POST', {
               using: 'strategy',
               value: 'selector',
               context: 'context',
            }),
         ).to.be.true;
      });

      it('should handle W3C element key', async () => {
         const element = { [W3C_ELEMENT_KEY]: 'elem1' };
         mockDriver.command.resolves(element);

         await findElOrEls.call(
            mockAppiumFlutterDriver,
            'strategy',
            'selector',
            false,
            'context',
         );

         expect(ELEMENT_CACHE.get('elem1')).to.equal(mockDriver);
      });

      it('should use different element body for AndroidUiautomator2Driver', async () => {
         mockAppiumFlutterDriver.proxydriver = new AndroidUiautomator2Driver();

         await findElOrEls.call(
            mockAppiumFlutterDriver,
            'strategy',
            'selector',
            false,
            'context',
         );

         expect(
            mockDriver.command.calledWith('/element', 'POST', {
               strategy: 'strategy',
               selector: 'selector',
               context: 'context',
            }),
         ).to.be.true;
      });

      it('should use different element body for XCUITestDriver', async () => {
         mockAppiumFlutterDriver.proxydriver = new XCUITestDriver();

         await findElOrEls.call(
            mockAppiumFlutterDriver,
            'strategy',
            'selector',
            false,
            'context',
         );

         expect(
            mockDriver.command.calledWith('/element', 'POST', {
               strategy: 'strategy',
               selector: 'selector',
               context: 'context',
            }),
         ).to.be.true;
      });

      it('should use different element body for Mac2Driver', async () => {
         mockAppiumFlutterDriver.proxydriver = new Mac2Driver();

         await findElOrEls.call(
            mockAppiumFlutterDriver,
            'strategy',
            'selector',
            false,
            'context',
         );
         expect(
            mockDriver.command.calledWith('/element', 'POST', {
               using: 'strategy',
               value: 'selector',
               context: 'context',
            }),
         ).to.be.true;
      });
   });

   describe('click', () => {
      it('should find a single element correctly', async () => {
         const element = { ELEMENT: 'elem1' };
         mockDriver.command.resolves(element as any);
         mockDriver.constructor = { name: 'NotJWProxy' };
         mockAppiumFlutterDriver.proxydriver = {
            constructor: { name: 'NotAndroidUiautomator2Driver' },
         };

         const result = await findElOrEls.call(
            mockAppiumFlutterDriver,
            'strategy',
            'selector',
            false,
            'context',
         );

         expect(result).to.deep.equal(element);
         expect(ELEMENT_CACHE.get('elem1')).to.equal(mockDriver);
         expect(
            mockDriver.command.calledWith('/element', 'POST', {
               using: 'strategy',
               value: 'selector',
               context: 'context',
            }),
         ).to.be.true;
      });
   });

   describe('getText', () => {
      it('should get text from an element correctly', async () => {
         const elementId = 'elem1';
         ELEMENT_CACHE.set(elementId, mockDriver);
         mockDriver.command.resolves('Some text');

         const result = await getText.call(mockAppiumFlutterDriver, elementId);

         expect(result).to.equal('Some text');
         expect(
            mockDriver.command.calledWith(
               `/element/${elementId}/text`,
               'GET',
               {},
            ),
         ).to.be.true;
      });
   });

   describe('getRect', () => {
      it('should get rect from an element correctly', async () => {
         const elementId = 'elem1';
         ELEMENT_CACHE.set(elementId, mockDriver);
         mockDriver.command.resolves(
            '{"x": 10, "y": 20, "width": 100, "height": 50}',
         );

         const result = await getElementRect.call(
            mockAppiumFlutterDriver,
            elementId,
         );

         expect(result).to.equal(
            '{"x": 10, "y": 20, "width": 100, "height": 50}',
         );
         expect(
            mockDriver.command.calledWith(
               `/element/${elementId}/rect`,
               'GET',
               {},
            ),
         ).to.be.true;
      });
   });

   describe('getAttribute', () => {
      it('should get an attribute from an element correctly', async () => {
         const elementId = 'elem1';
         const attribute = 'someAttribute';
         ELEMENT_CACHE.set(elementId, mockDriver);
         mockDriver.command.resolves('attributeValue');

         const result = await getAttribute.call(
            mockAppiumFlutterDriver,
            attribute,
            elementId,
         );

         expect(result).to.equal('attributeValue');
         expect(
            mockDriver.command.calledWith(
               `/element/${elementId}/attribute/${attribute}`,
               'GET',
               {},
            ),
         ).to.be.true;
      });
   });

   describe('setValue', () => {
      it('should set a value for an element correctly', async () => {
         const elementId = 'elem1';
         const text = 'Some text';
         ELEMENT_CACHE.set(elementId, mockDriver);

         await setValue.call(mockAppiumFlutterDriver, text, elementId);

         expect(
            mockDriver.command.calledWith(
               `/element/${elementId}/value`,
               'POST',
               { text, value: [...text] },
            ),
         ).to.be.true;
      });
   });

   describe('clear', () => {
      it('should clear an element correctly', async () => {
         const elementId = 'elem1';
         ELEMENT_CACHE.set(elementId, mockDriver);

         await clear.call(mockAppiumFlutterDriver, elementId);

         expect(
            mockDriver.command.calledWith(
               `/element/${elementId}/clear`,
               'POST',
               { elementId },
            ),
         ).to.be.true;
      });
   });
});
