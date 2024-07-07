//@ts-nocheck
import { config as baseConfig } from './wdio.conf.ts';

export const config: WebdriverIO.Config = {
  ...baseConfig,
  capabilities: [
    {
      // capabilities for local Appium web tests on an Android Emulator
      platformName: 'iOS',
      'appium:automationName': 'FlutterIntegration',
      'appium:orientation': 'PORTRAIT',
      'appium:udid': process.env.UDID,
      'appium:app': process.env.APP_PATH,
      'appium:newCommandTimeout': 240,
      "appium:usePreinstalledWDA": true,
      "appium:showIOSLog": false,
      "appium:flutterSystemPort": 31321,
      "appium:wdaLocalPort": 8456,
      'appium:flutterServerLaunchTimeout': 10000,
    },
  ],
};
