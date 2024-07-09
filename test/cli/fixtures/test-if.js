QUnit.test.if('skip me', false, function (assert) {
  assert.true(false);
});

QUnit.test.if('keep me', true, function (assert) {
  assert.true(true);
});

QUnit.test('regular', function (assert) {
  assert.true(true);
});

QUnit.test.if.each('skip dataset', false, ['a', 'b'], function (assert, _data) {
  assert.true(false);
});

QUnit.test.if.each('keep dataset', true, ['a', 'b'], function (assert, data) {
  assert.true(true);
  assert.equal(typeof data, 'string');
});

QUnit.module.if('skip group', false, function () {
  QUnit.test('skipper', function (assert) {
    assert.true(false);
  });
});

QUnit.module.if('keep group', true, function (hooks) {
  let list = [];
  hooks.beforeEach(function () {
    list.push('x');
  });
  QUnit.test('keeper', function (assert) {
    assert.true(true);
    assert.deepEqual(list, ['x']);
  });
});
