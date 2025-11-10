const quarantineList = ['flaky test', 'broken test'];

QUnit.config.testFilter = function (testInfo) {
  return !quarantineList.some(function (pattern) {
    return testInfo.testName.indexOf(pattern) !== -1;
  });
};

QUnit.module('testFilter demo');

QUnit.test('stable test', function (assert) {
  assert.ok(true, 'this test should run');
});

QUnit.test('flaky test', function (assert) {
  assert.ok(false, 'this test should be filtered out');
});

QUnit.test('broken test', function (assert) {
  assert.ok(false, 'this test should also be filtered out');
});

QUnit.test('another stable test', function (assert) {
  assert.ok(true, 'this test should also run');
});
