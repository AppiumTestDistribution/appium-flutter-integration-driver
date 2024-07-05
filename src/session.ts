import type { AppiumFlutterDriver } from './driver';
import _ from 'lodash';
import { PLATFORM } from './platform';
import { startAndroidSession } from './android';
import { startIOSSession } from './iOS';
import type { DefaultCreateSessionResult } from '@appium/types';

export async function createSession(
   this: AppiumFlutterDriver,
   sessionId: string,
   caps: any,
   ...args: any[]
): Promise<DefaultCreateSessionResult<any>> {
   try {
      switch (_.toLower(caps.platformName)) {
         case PLATFORM.IOS:
            this.proxydriver = await startIOSSession.bind(this)(...args);
            this.proxydriver.relaxedSecurityEnabled =
               this.relaxedSecurityEnabled;
            this.proxydriver.denyInsecure = this.denyInsecure;
            this.proxydriver.allowInsecure = this.allowInsecure;

            break;
         case PLATFORM.ANDROID:
            this.proxydriver = await startAndroidSession.bind(this)(...args);
            this.proxydriver.relaxedSecurityEnabled =
               this.relaxedSecurityEnabled;
            this.proxydriver.denyInsecure = this.denyInsecure;
            this.proxydriver.allowInsecure = this.allowInsecure;
            break;
         default:
            this.log.errorWithException(
               `Unsupported platformName: ${caps.platformName}. ` +
                  `Only the following platforms are supported: ${_.keys(PLATFORM)}`,
            );
      }

      return [sessionId, this.opts];
   } catch (e) {
      await this.deleteSession();
      throw e;
   }
}
