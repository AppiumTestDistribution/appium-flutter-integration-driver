import { config as baseConfig } from './wdio.conf.ts';

export const config: WebdriverIO.Config = {
  ...baseConfig,
  capabilities: [
    {
      // capabilities for local Appium web tests on an Android Emulator
      platformName: 'iOS',
      'appium:automationName': 'FlutterIntegration',
      'appium:orientation': 'PORTRAIT',
      'appium:app': process.env.APP_PATH || join(process.cwd(), 'ios.zip'),
      'appium:newCommandTimeout': 240,
    },
  ],
};
