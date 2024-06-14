export const desiredCapConstraints = {
  avd: {
    isString: true,
  },
  automationName: {
    isString: true,
    presence: true,
  },
  platformName: {
    inclusionCaseInsensitive: ['iOS', 'Android'],
    isString: true,
    presence: true,
  },
  udid: {
    isString: true,
  },
  launchTimeout: {
    isNumber: true,
  },
  flutterServerLaunchTimeout: {
    isNumber: true,
  },
  flutterServerRetryInterval: {
    isNumber: true,
  },
} as const;
