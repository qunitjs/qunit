QUnit.module('module manually returning a thenable', function () {
  QUnit.test('has a test', function (assert) {
    assert.true(true);
  });
  return { then: function () {} };
});
