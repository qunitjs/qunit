QUnit.module('events', function () {
  QUnit.test('QUnit.on [failure]', function (assert) {
    assert.throws(function () {
      QUnit.on(null, function () {
        assert.step('null called');
      });
    }, /must be a string/, 'null event name');

    assert.throws(function () {
      QUnit.on('banana', function () {
        assert.step('banana called');
      });
    }, /not a valid event/, 'unknown event name');

    assert.throws(function () {
      QUnit.on('runStart');
    }, /must be a function/, 'missing callback');

    assert.throws(function () {
      QUnit.on('runStart', null);
    }, /must be a function/, 'null callback');

    assert.verifySteps([]);
  });
});
