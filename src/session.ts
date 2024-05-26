import type { AppiumFlutterDriver } from './driver';
import _ from 'lodash';
import { PLATFORM } from './platform';
import { startAndroidSession } from './android';
export const createSession: any = async function (
  this: AppiumFlutterDriver,
  sessionId: string,
  caps,
  ...args
) {
  try {
    // setup proxies - if platformName is not empty, make it less case sensitive
    switch (_.toLower(caps.platformName)) {
      case PLATFORM.IOS:
        // [this.proxydriver, this.socket] = await startIOSSession(this, caps, ...args);
        // this.proxydriver.relaxedSecurityEnabled = this.relaxedSecurityEnabled;
        // this.proxydriver.denyInsecure = this.denyInsecure;
        // this.proxydriver.allowInsecure = this.allowInsecure;

        break;
      case PLATFORM.ANDROID:
        [this.proxydriver, this.flutterPort] = await startAndroidSession(
          this,
          caps,
          ...args,
        );
        this.proxydriver.relaxedSecurityEnabled = this.relaxedSecurityEnabled;
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
};
