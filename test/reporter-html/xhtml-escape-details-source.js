QUnit.module('outer module', function () {
  QUnit.module('inner module', function () {
    QUnit.test('test name with a special char > after char', function (assert) {
      assert.expect(1);
      assert.true(true, 'dummy test');
    });
  });
});
