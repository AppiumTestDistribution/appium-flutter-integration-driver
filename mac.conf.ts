//@ts-nocheck
import { config as baseConfig } from './wdio.conf.ts';

export const config: WebdriverIO.Config = {
   ...baseConfig,
   capabilities: [
      {
         // capabilities for local Appium web tests on an Android Emulator
         platformName: 'mac',
         'appium:automationName': 'FlutterIntegration',
         'appium:orientation': 'PORTRAIT',
         'appium:app': "/Users/saikrishna/Documents/git/appium-flutter-server/demo-app/build/macos/Build/Products/Debug/appium_testing_app.app",
         'appium:bundleId': "com.example.appiumTestingApp",
         'appium:newCommandTimeout': 240,
         'appium:flutterServerLaunchTimeout': 25000,
         'appium:flutterEnableMockCamera': true
      },
   ],
};
