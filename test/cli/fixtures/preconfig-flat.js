QUnit.test('config', function (assert) {
  assert.strictEqual(QUnit.config.maxDepth, 5, 'maxDepth default');
  assert.strictEqual(QUnit.config.filter, '!foobar', 'filter override');
  assert.strictEqual(QUnit.config.seed, 'dummyfirstyes', 'seed override');
  assert.strictEqual(QUnit.config.testTimeout, 7, 'testTimeout override');
});

QUnit.test('dummy', function (assert) {
  // have at least two tests so that output demonstrates
  // the effect of the seed on test order,
  assert.true(true);
});

QUnit.test('slow', function (assert) {
  assert.true(true);
  return new Promise(resolve => setTimeout(resolve, 1000));
});

QUnit.test('foobar', function (assert) {
  assert.false(true, 'foobar test skipped by filter');
});
