/* eslint-env browser */

window.parent.postMessage('hello', '*');

QUnit.on('testEnd', function (testEnd) {
  window.parent.postMessage(
    'testEnd: ' + testEnd.name,
    '*'
  );
});

QUnit.on('runEnd', function (runEnd) {
  window.parent.postMessage(
    'runEnd: status=' + runEnd.status + ', total=' + runEnd.testCounts.total,
    '*'
  );
});

QUnit.module('sandboxed', function () {
  QUnit.test('foo', function (assert) {
    assert.true(false);
  });

  QUnit.test.only('bar', function (assert) {
    assert.true(true);
  });

  QUnit.test.skip('quux', function (assert) {
    assert.true(false);
  });
});
