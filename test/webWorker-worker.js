// This worker script gets run via test/webWorker.html

/* eslint-env worker */

importScripts(
  '../qunit/qunit.js',

  // Sync with test/index.html
  'main/assert.js',
  'main/assert-es6.js',
  'main/assert-step.js',
  'main/assert-timeout.js',
  'main/async.js',
  'main/deepEqual.js',
  'main/diff.js',
  'main/dump.js',
  'main/each.js',
  'main/HtmlReporter.js',
  'main/modules.js',
  'main/legacy.js',
  'main/onUncaughtException.js',
  'main/promise.js',
  'main/setTimeout.js',
  'main/stacktrace.js',
  'main/test.js',
  'main/utilities.js'
);

QUnit.on('runEnd', function (data) {
  postMessage(data);
});

QUnit.start();
