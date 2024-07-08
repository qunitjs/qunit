/* global loadRelativeToScript */

loadRelativeToScript('../qunit/qunit.js');

QUnit.reporters.tap.init(QUnit);
QUnit.on('runEnd', (suiteEnd) => {
  if (suiteEnd.status === 'failed') {
    // There is no built-in function for sending a non-zero exit code,
    // so throw an uncaught error to make this happen.
    throw new Error('Test run has failures.');
  }
});

// Sync with test/index.html
loadRelativeToScript('../test/main/assert.js');
loadRelativeToScript('../test/main/assert-step.js');
loadRelativeToScript('../test/main/assert-throws-es6.js');
// loadRelativeToScript( "../test/main/assert-timeout.js" ); // Requires setTimeout
// loadRelativeToScript( "../test/main/async.js" ); // Requires setTimeout
loadRelativeToScript('../test/main/deepEqual.js');
loadRelativeToScript('../test/main/diff.js');
loadRelativeToScript('../test/main/dump.js');
loadRelativeToScript('../test/main/each.js');
loadRelativeToScript('../test/main/HtmlReporter.js');
// loadRelativeToScript( "../test/main/modules.js" ); // Requires setTimeout
loadRelativeToScript('../test/main/onUncaughtException.js');
loadRelativeToScript('../test/main/promise.js');
loadRelativeToScript('../test/main/setTimeout.js');
loadRelativeToScript('../test/main/stacktrace.js');
loadRelativeToScript('../test/main/test.js');
loadRelativeToScript('../test/main/utilities.js');

QUnit.start();
