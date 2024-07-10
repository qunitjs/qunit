import '../qunit/qunit.js';

// Sync with test/index.html
import '../test/main/assert.js';
import '../test/main/assert-es6.js';
import '../test/main/assert-step.js';
// import  "../test/main/assert-timeout.js"; // Requires setTimeout
// import  "../test/main/async.js"; // Requires setTimeout
import '../test/main/deepEqual.js';
import '../test/main/diff.js';
import '../test/main/dump.js';
import '../test/main/each.js';
import '../test/main/HtmlReporter.js';
// import  "../test/main/modules.js"; // Requires setTimeout
import '../test/main/modules-es2018.js';
import '../test/main/modules-esm.mjs';
import '../test/main/legacy.js';
import '../test/main/onUncaughtException.js';
import '../test/main/promise.js';
import '../test/main/setTimeout.js';
import '../test/main/stacktrace.js';
import '../test/main/TapReporter.js';
import '../test/main/test.js';
import '../test/main/utilities.js';

QUnit.reporters.tap.init(QUnit);
QUnit.on('runEnd', (suiteEnd) => {
  if (suiteEnd.status === 'failed') {
    // There is no built-in function for sending a non-zero exit code,
    // so throw an uncaught error to make this happen.
    throw new Error('Test run has failures.');
  }
});

QUnit.start();
