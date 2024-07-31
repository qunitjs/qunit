'use strict';

module.exports = function (grunt) {
  grunt.registerMultiTask('test-on-node', async function () {
    let done = this.async();

    const totals = { files: 0, failed: 0 };
    for (const file of this.data) {
      totals.failed += await runQUnit(file);
      totals.files++;
    }

    if (totals.failed) {
      grunt.log.error(`Ran ${totals.files} files, ${totals.failed} failed tests`);
    } else {
      grunt.log.ok(`Ran ${totals.files} files`);
    }

    done(!totals.failed);
  });

  function requireFreshQUnit () {
    // Resolve current QUnit path and remove it from the require cache
    // to avoid stacking the QUnit logs.
    const path = '../../qunit/qunit.js';
    const resolvedPath = require.resolve(path);
    delete require.cache[resolvedPath];

    // Clear any QUnit global from a previous test
    delete globalThis.QUnit;

    return require(path);
  }

  async function runQUnit (file) {
    const QUnit = requireFreshQUnit();

    QUnit.config.autostart = false;
    await import('../../' + file);
    const runEnd = new Promise(resolve => registerEvents(QUnit, file, resolve));
    QUnit.start();
    await runEnd;
  }

  function registerEvents (QUnit, fileName, callback) {
    // Silence deprecation warnings
    const warn = process.stderr.write;
    process.stderr.write = function () {};
    function restore () {
      process.stderr.write = warn;
    }

    // These tests are relatively short. Buffer the output so that we
    // only have to restore once, and can craft more condensed output.
    let out = '';

    QUnit.on('runStart', () => {
      out += 'Testing ' + fileName;
    });

    QUnit.on('testEnd', (testEnd) => {
      if (testEnd.status === 'todo') {
        return;
      }
      testEnd.errors.forEach((assertion) => {
        out += `\n\ntest: ${testEnd.fullName.join(' > ')}\n`
          + `actual  : ${QUnit.dump.parse(assertion.actual)}\n`
          + `expected: ${QUnit.dump.parse(assertion.expected)}\n`
          + `message: ${assertion.message}\n${assertion.stack || ''}`;
      });
    });

    QUnit.on('runEnd', (suiteEnd) => {
      restore();
      const stats = suiteEnd.testCounts;

      if (suiteEnd.status === 'failed') {
        out += '\n' + `${stats.total} tests in ${suiteEnd.runtime}ms`;
        out += `, ${stats.passed} passed`;
        if (stats.failed) {
          out += `, ${stats.failed} failed`;
        }
        if (stats.skipped) {
          out += `, ${stats.skipped} skipped`;
        }
        if (stats.todo) {
          out += `, ${stats.todo} todo`;
        }
        out += '.';
        grunt.log.error(out);
      } else {
        out += ` (${stats.total} tests in ${suiteEnd.runtime}ms)`;
        grunt.log.writeln(out);
      }

      callback(stats.failed);
    });
  }
};
