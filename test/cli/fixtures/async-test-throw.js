QUnit.test('throw early', async function (_assert) {
  throw new Error('boo');
});

QUnit.test('throw late', async function (assert) {
  await Promise.resolve('');
  assert.true(true);
  throw new Error('boo');
});

// NOTE: This is not about testing a rejected Promise or throwing async function.
// In those cases, `ret.then(, cb)` will not throw, but inform you via cb(err).
// Instead, this is testing a bad Thenable implementation, where then() itself
// throws an error. This is not possible with native Promise, but is possible with
// custom Promise-compatible libraries and
QUnit.test('test with bad thenable', function (assert) {
  assert.true(true);
  return {
    then: function () {
      throw new Error('boo');
    }
  };
});

QUnit.hooks.beforeEach(function (assert) {
  if (assert.test.testName !== 'example') { return; }
  return {
    then: function () {
      throw new Error('global brocoli');
    }
  };
});
QUnit.hooks.afterEach(function (assert) {
  if (assert.test.testName !== 'example') { return; }
  return {
    then: function () {
      throw new Error('global artichoke');
    }
  };
});

QUnit.module('hooks with bad thenable', function (hooks) {
  hooks.beforeEach(function () {
    return {
      then: function () {
        throw new Error('banana');
      }
    };
  });
  hooks.afterEach(function () {
    return {
      then: function () {
        throw new Error('apple');
      }
    };
  });

  QUnit.test('example', function (assert) {
    assert.true(true);
  });
});
