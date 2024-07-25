/* eslint-env node */
module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.initConfig({
    connect: {
      all: {
        options: {
          useAvailablePort: true,
          base: '.'
        }
      }
    },
    qunit: {
      options: {
      },
      all: ['tmp/test-*.html']
    }
  });

  grunt.event.once('connect.all.listening', function (_host, port) {
    grunt.config('qunit.options.httpBase', `http://localhost:${port}`);
    // console.log(grunt.config()); // DEBUG
  });

  let results = [];
  grunt.event.on('qunit.on.testEnd', function (test) {
    results.push(
      `>> ${test.status} test "${test.fullName.join(' > ')}"`
    );
  });
  grunt.event.on('qunit.on.runEnd', function () {
    grunt.log.writeln(results.join('\n'));
    results = [];
  });

  grunt.registerTask('test', ['connect', 'qunit']);
};
