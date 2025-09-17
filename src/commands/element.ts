import _ from 'lodash';
import { getProxyDriver, FLUTTER_LOCATORS } from '../utils';
import { JWProxy } from 'appium/driver';
import { AndroidUiautomator2Driver } from 'appium-uiautomator2-driver';
// @ts-ignore
import { XCUITestDriver } from 'appium-xcuitest-driver';
// @ts-ignore
import { Mac2Driver } from 'appium-mac2-driver';
import { W3C_ELEMENT_KEY } from 'appium/driver';
import type { AppiumFlutterDriver } from '../driver';

export const ELEMENT_CACHE = new Map();
export async function findElOrEls(
   this: AppiumFlutterDriver,
   strategy: string,
   selector: string,
   mult: boolean,
   context: string,
): Promise<any> {
   const driver = await getProxyDriver.bind(this)(strategy);
   let elementBody;
   function constructFindElementPayload(
      strategy: string,
      selector: string,
      proxyDriver: XCUITestDriver | AndroidUiautomator2Driver | Mac2Driver,
   ) {
      const isFlutterLocator =
         strategy.startsWith('-flutter') || FLUTTER_LOCATORS.includes(strategy);

      const parsedSelector =
         ['-flutter descendant', '-flutter ancestor'].includes(strategy) &&
         _.isString(selector)
            ? JSON.parse(selector)
            : selector; // Special case

       // If user is looking for Native IOS/Mac locator
      if (!isFlutterLocator && (proxyDriver instanceof XCUITestDriver || proxyDriver instanceof Mac2Driver)) {
         return { using: strategy, value: parsedSelector, context };
      } else {
         return { strategy, selector: parsedSelector, context };
      }
   }

   elementBody = constructFindElementPayload(
      strategy,
      selector,
      this.proxydriver,
   );
   if (mult) {
      const response = await driver.command('/elements', 'POST', elementBody);
      response.forEach((element: any) => {
         ELEMENT_CACHE.set(element.ELEMENT || element[W3C_ELEMENT_KEY], driver);
      });
      return response;
   } else {
      const element = await driver.command('/element', 'POST', elementBody);
      ELEMENT_CACHE.set(element.ELEMENT || element[W3C_ELEMENT_KEY], driver);
      return element;
   }
}

export async function click(this: AppiumFlutterDriver, element: string) {
   const driver = ELEMENT_CACHE.get(element);
   return await driver.command(`/element/${element}/click`, 'POST', {
      element,
   });
}

export async function getText(this: AppiumFlutterDriver, elementId: string) {
   const driver = ELEMENT_CACHE.get(elementId);
   return String(await driver.command(`/element/${elementId}/text`, 'GET', {}));
}

export async function getElementRect(
   this: AppiumFlutterDriver,
   elementId: string,
) {
   const driver = ELEMENT_CACHE.get(elementId);
   return await driver.command(`/element/${elementId}/rect`, 'GET', {});
}

export async function elementEnabled(
   this: AppiumFlutterDriver,
   elementId: string,
) {
   return toBool(await this.getAttribute('enabled', elementId));
}

export async function getAttribute(
   this: AppiumFlutterDriver,
   attribute: string,
   elementId: string,
) {
   const driver = ELEMENT_CACHE.get(elementId);
   return await driver.command(
      `/element/${elementId}/attribute/${attribute}`,
      'GET',
      {},
   );
}

export async function setValue(
   this: AppiumFlutterDriver,
   text: string,
   elementId: string,
) {
   const driver = ELEMENT_CACHE.get(elementId);
   return await driver.command(`/element/${elementId}/value`, 'POST', {
      text: text && _.isArray(text) ? text.join('') : text, // text should always be a string
      value: text && _.isString(text) ? [...text] : text, // value should always be a array of char
   });
}

export async function clear(this: AppiumFlutterDriver, elementId: string) {
   const driver = ELEMENT_CACHE.get(elementId);
   return await driver.command(`/element/${elementId}/clear`, 'POST', {
      elementId,
   });
}

export async function elementDisplayed(
   this: AppiumFlutterDriver,
   elementId: string,
) {
   return await this.getAttribute('displayed', elementId);
}

function toBool(s: string | boolean) {
   return _.isString(s) ? s.toLowerCase() === 'true' : !!s;
}
