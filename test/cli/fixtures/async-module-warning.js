// eslint-disable-next-line qunit/no-async-module-callbacks
QUnit.module('module with async callback', async function () {
  await Promise.resolve(1);

  QUnit.test('has a test', function (assert) {
    assert.true(true);
  });
});

QUnit.module('resulting parent module');
