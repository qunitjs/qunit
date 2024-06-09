var errorFromAsyncModule;
try {
  // eslint-disable-next-line qunit/no-async-module-callbacks
  QUnit.module('module with async callback', async function () {
    await Promise.resolve(1);

    QUnit.test('has a test', function (assert) {
      assert.true(true);
    });
  });
} catch (e) {
  errorFromAsyncModule = e;
}

QUnit.test(
  'Correct error thrown from async module function',
  function (assert) {
    assert.true(errorFromAsyncModule instanceof Error);
    assert.strictEqual(
      errorFromAsyncModule.message,
      'Async module callbacks are not supported. ' +
        'Instead, use hooks for async behavior.',
      'Error has correct message'
    );
  }
);
