QUnit.test('throw early', async function (_assert) {
  throw new Error('boo');
});

QUnit.test('throw late', async function (assert) {
  await Promise.resolve('');
  assert.true(true);
  throw new Error('boo');
});

// See "bad thenable" in /src/test.js#resolvePromise
QUnit.test('test with bad thenable', function (assert) {
  assert.true(true);
  return {
    then: function () {
      throw new Error('boo');
    }
  };
});
