QUnit.test('implicitly skipped test', function (assert) {
  assert.true(false, 'test should be skipped');
});

QUnit.only('run this test', function (assert) {
  assert.true(true, 'only this test should run');
});

QUnit.test('another implicitly skipped test', function (assert) {
  assert.true(false, 'test should be skipped');
});

QUnit.only('all tests with only run', function (assert) {
  assert.true(true, 'this test should run as well');
});
