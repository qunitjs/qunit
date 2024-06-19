/* eslint-env browser */

QUnit.module('AMD autostart', {
  after: function (assert) {
    assert.true(true, 'after hook ran');
  }
});

QUnit.test('Prove the test run started as expected', function (assert) {
  assert.expect(2);
  assert.strictEqual(window.beginData.totalTests, 1, 'Should have expected 1 test');
});
