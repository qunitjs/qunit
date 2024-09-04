/* eslint-env node */
'use strict';
module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.initConfig({
    qunit: {
      pass: ['pass-*.html'],
      'fail-assert': 'fail-assert.html',
      'fail-no-tests': 'fail-no-tests.html',
      'fail-uncaught': 'fail-uncaught.html'
    }
  });

  grunt.registerTask('default', ['qunit:pass']);
};
