/* eslint-env node */

module.exports = function (config) {
  config.set({
    browsers: [
      'FirefoxHeadless'
    ],
    client: process.env.KARMA_QUNIT_CONFIG
      ? {
          qunit: {
            testTimeout: 1991,
            fooBar: 'xyz'
          }
        }
      : {},
    frameworks: ['qunit'],
    files: [
      process.env.KARMA_FILES || 'pass-basic.js'
    ],
    autoWatch: false,
    singleRun: true,
    reporters: ['dots']
  });
};
