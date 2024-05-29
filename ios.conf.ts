import { config as baseConfig } from './wdio.conf.ts';

export const config: WebdriverIO.Config = {
  ...baseConfig,
  capabilities: [
    {
      // capabilities for local Appium web tests on an Android Emulator
      platformName: 'iOS',
      'appium:automationName': 'FlutterIntegration',
      'appium:orientation': 'PORTRAIT',
      'appium:app':
        '/Users/saikrishna/Downloads/git/flutter-learnings/counter_app/build/ios/iphonesimulator/Runner.app',
      'appium:newCommandTimeout': 240,
    },
  ],
};
