// @ts-nocheck
import { config as baseConfig } from './wdio.conf.ts';
import { join } from 'node:path';

export const config: WebdriverIO.Config = {
   ...baseConfig,
   capabilities: [
      {
         // capabilities for local Appium web tests on an Android Emulator
         platformName: 'Android',
         'appium:automationName': 'FlutterIntegration',
         'appium:orientation': 'PORTRAIT',
         'appium:app':
            process.env.APP_PATH || join(process.cwd(), 'app-debug.apk'),
         'appium:newCommandTimeout': 240,
         'appium:flutterServerLaunchTimeout': 10000,
         'appium:flutterEnableMockCamera': true
      },
   ],
};
