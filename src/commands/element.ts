import _ from 'lodash';
import { getProxyDriver } from '../utils';
import { JWProxy } from '@appium/base-driver';
import AndroidUiautomator2Driver from 'appium-uiautomator2-driver';
import { W3C_ELEMENT_KEY } from '@appium/base-driver/build/lib/constants';
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
   if (
      !(driver instanceof JWProxy) &&
      !(this.proxydriver instanceof AndroidUiautomator2Driver)
   ) {
      elementBody = {
         using: strategy,
         value: selector,
         context, //this needs be validated
      };
   } else {
      elementBody = {
         strategy,
         selector,
         context,
      };
   }
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

export async function elementEnabled(this: AppiumFlutterDriver, elementId: string) {
   return toBool(await this.getAttribute('enabled', elementId));
}

export async function getAttribute(this: AppiumFlutterDriver, attribute: string, elementId: string) {
   const driver = ELEMENT_CACHE.get(elementId);
   return await driver.command(
      `/element/${elementId}/attribute/${attribute}`,
      'GET',
      {},
   );
}

export async function setValue(this: AppiumFlutterDriver, text: string, elementId: string) {
   const driver = ELEMENT_CACHE.get(elementId);
   return await driver.command(`/element/${elementId}/value`, 'POST', {
      text,
   });
}

export async function clear(this: AppiumFlutterDriver, elementId: string) {
   const driver = ELEMENT_CACHE.get(elementId);
   return await driver.command(`/element/${elementId}/clear`, 'POST', {
      elementId,
   });
}

export async function elementDisplayed(this: AppiumFlutterDriver, elementId: string) {
   return await this.getAttribute('displayed', elementId);
}

function toBool(s: string | boolean) {
   return _.isString(s) ? s.toLowerCase() === 'true' : !!s;
}
