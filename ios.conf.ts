import { config as baseConfig } from './wdio.conf.ts';
import { join } from 'node:path';

export const config: WebdriverIO.Config = {
  ...baseConfig,
  capabilities: [
    {
      // capabilities for local Appium web tests on an Android Emulator
      platformName: 'iOS',
      'appium:automationName': 'FlutterIntegration',
      'appium:orientation': 'PORTRAIT',
      'appium:app': join(process.cwd(), 'iOS-build.app'),
      'appium:newCommandTimeout': 240,
    },
  ],
};
