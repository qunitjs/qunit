QUnit.test('invalid [undefined]', function (assert) {
  QUnit.config.testTimeout = undefined;
  setTimeout(assert.async(), 7);
  assert.true(true);
});

QUnit.test('invalid [null]', function (assert) {
  QUnit.config.testTimeout = null;
  setTimeout(assert.async(), 7);
  assert.true(true);
});

QUnit.test('invalid [string]', function (assert) {
  QUnit.config.testTimeout = '9412';
  setTimeout(assert.async(), 7);
  assert.true(true);
});
