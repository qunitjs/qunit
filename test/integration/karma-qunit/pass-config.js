QUnit.test('set config', function (assert) {
  assert.strictEqual(QUnit.config.testTimeout, 1991, 'testTimeout');
  assert.strictEqual(QUnit.config.fooBar, 'xyz', 'fooBar');
});
