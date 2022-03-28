/* global loadRelativeToScript, print */

loadRelativeToScript('../qunit/qunit.js');

QUnit.on('runStart', () => {
  print('Running tests...');
});
QUnit.on('testEnd', (testEnd) => {
  if (testEnd.status === 'todo') {
    return;
  }
  testEnd.errors.forEach((assertion) => {
    print(`\ntest: ${testEnd.name}\n` +
      `module: ${testEnd.suiteName}\n` +
      `message: ${assertion.message}\n${assertion.stack || ''}`);
  });
});
QUnit.on('runEnd', (suiteEnd) => {
  const stats = suiteEnd.testCounts;
  if (suiteEnd.status === 'failed') {
    print(`${stats.total} tests in ${suiteEnd.runtime}ms` +
      `, ${stats.passed} passed` +
      `, ${stats.failed} failed` +
      `, ${stats.skipped} skipped` +
      `, ${stats.todo} todo` +
      '.'
    );

    // There is no built-in function for sending a non-zero exit code,
    // so throw an uncaught error to make this happen.
    throw new Error('Test run has failures.');
  } else {
    print(`${stats.total} tests in ${suiteEnd.runtime}ms, all passed.`);
  }
});

// Sync with test/index.html
loadRelativeToScript('../test/main/assert.js');
loadRelativeToScript('../test/main/assert-step.js');
// loadRelativeToScript( "../test/main/assert-timeout.js" ); // Requires setTimeout
// loadRelativeToScript( "../test/main/async.js" ); // Requires setTimeout
loadRelativeToScript('../test/main/deepEqual.js');
loadRelativeToScript('../test/main/dump.js');
loadRelativeToScript('../test/main/each.js');
// loadRelativeToScript( "../test/main/modules.js" ); // Requires setTimeout
loadRelativeToScript('../test/main/onError.js');
loadRelativeToScript('../test/main/onUncaughtException.js');
loadRelativeToScript('../test/main/promise.js');
loadRelativeToScript('../test/main/setTimeout.js');
loadRelativeToScript('../test/main/stack.js');
loadRelativeToScript('../test/main/test.js');
loadRelativeToScript('../test/main/utilities.js');

QUnit.start();
