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
      'appium:app':
        '/Users/saikrishna/Downloads/git/flutter-learnings/counter_app/build/app/outputs/apk/debug/app-debug.apk',
      'appium:newCommandTimeout': 240,
    },
  ],
};
