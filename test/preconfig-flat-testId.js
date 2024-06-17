QUnit.test('test 1', function (assert) {
  assert.true(false);
});

QUnit.test('test 2', function (assert) {
  assert.true(true, 'run test 2');
  assert.deepEqual(
    QUnit.config.testId,
    ['94e5e740'],
    'QUnit.config.testId'
  );
});

QUnit.test('test 3', function (assert) {
  assert.true(false);
});
