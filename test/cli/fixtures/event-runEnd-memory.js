QUnit.on('runEnd', function (run) {
  console.log(`# early runEnd total=${run.testCounts.total} passed=${run.testCounts.passed} failed=${run.testCounts.failed}`);
  setTimeout(function () {
    QUnit.on('runEnd', function (run) {
      console.log(`# late runEnd total=${run.testCounts.total} passed=${run.testCounts.passed} failed=${run.testCounts.failed}`);
    });
  });
});

QUnit.module('First', function () {
  QUnit.test('A', function (assert) {
    assert.true(true);
  });
  QUnit.test('B', function (assert) {
    assert.true(false);
  });
});

QUnit.module('Second', function () {
  QUnit.test('C', function (assert) {
    assert.true(true);
  });
});
