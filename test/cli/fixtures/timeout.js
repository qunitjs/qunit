QUnit.module('timeout', function () {
  // This should fail
  QUnit.test('first', function (assert) {
    assert.timeout(10);

    return new Promise(resolve => setTimeout(resolve, 20));
  });

  // Runner should recover and still run and pass this test
  QUnit.test('second', function (assert) {
    return new Promise(resolve => setTimeout(resolve, 20))
      .then(() => {
        assert.true(true);
      });
  });
});
