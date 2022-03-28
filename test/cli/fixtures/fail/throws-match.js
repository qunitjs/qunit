QUnit.module('Throws match', function () {
  QUnit.test('bad', function (assert) {
    assert.throws(function () {
      throw new Error('Match me with a pattern');
    }, /incorrect pattern/, 'match error');
  });
});
