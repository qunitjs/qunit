QUnit.on('error', function (error) {
  console.log(`# early error ${error}`);

  Promise.resolve().then(function () {
    QUnit.on('error', function (error) {
      console.log(`# late error ${error}`);
    });
  });
});

setTimeout(function () {
  boom(); // eslint-disable-line
});

QUnit.module('First', function () {
  QUnit.test('A', function (assert) {
    assert.true(true);
  });
  QUnit.test('B', function (assert) {
    const done = assert.async();
    setTimeout(function () {
      assert.true(true);
      done();
    });
  });
});
