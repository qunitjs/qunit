QUnit.module('callbacks', function () {
  QUnit.test('QUnit.testDone [failure]', function (assert) {
    assert.throws(function () {
      QUnit.testDone(undefined);
    }, TypeError, 'undefined callback');

    assert.throws(function () {
      QUnit.testDone(null);
    }, TypeError, 'null callback');

    assert.throws(function () {
      QUnit.testDone('banana');
    }, TypeError, 'string callback');
  });
});
