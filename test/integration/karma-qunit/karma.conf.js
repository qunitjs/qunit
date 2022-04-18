/* eslint-env node */

module.exports = function (config) {
  config.set({
    browsers: [
      'FirefoxHeadless'
    ],
    frameworks: ['qunit'],
    files: [
      process.env.KARMA_FILES || 'pass-*.js'
    ],
    autoWatch: false,
    singleRun: true,
    reporters: ['dots']
  });
};
