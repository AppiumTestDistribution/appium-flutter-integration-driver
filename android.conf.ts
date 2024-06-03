import { join } from 'node:path';
import { config as baseConfig } from './wdio.conf.ts';

export const config: WebdriverIO.Config = {
  ...baseConfig,
  capabilities: [
    {
      // capabilities for local Appium web tests on an Android Emulator
      platformName: 'Android',
      'appium:automationName': 'FlutterIntegration',
      'appium:orientation': 'PORTRAIT',
      'appium:app': join(process.cwd(), 'app-debug.apk'),
      'appium:newCommandTimeout': 240,
      'appium:skipLogcatCapture': true,
    },
  ],
};
