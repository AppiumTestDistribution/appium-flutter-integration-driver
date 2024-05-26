export const desiredCapConstraints = {
  app: {
    isString: true,
    presence: true,
  },
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
} as const;
