/* eslint-env node */
module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.initConfig({
    qunit: {
      options: {
        puppeteer: {
          args: (process.env.CHROMIUM_FLAGS || (process.env.CI ? '--no-sandbox' : ''))
            .split(' ')
        }
      },
      pass: ['pass-*.html'],
      'fail-assert': 'fail-assert.html',
      'fail-no-tests': 'fail-no-tests.html'
    }
  });

  grunt.registerTask('default', ['qunit:pass']);
};
