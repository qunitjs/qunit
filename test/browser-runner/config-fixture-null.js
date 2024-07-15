/* eslint-env browser */
QUnit.module('QUnit.config [fixture=null]');

QUnit.config.reorder = false;
QUnit.config.fixture = null;

QUnit.test('make dirty', function (assert) {
  assert.strictEqual(QUnit.config.fixture, null);

  var fixture = document.querySelector('#qunit-fixture');
  fixture.textContent = 'dirty';
});

QUnit.test('find dirty', function (assert) {
  assert.strictEqual(QUnit.config.fixture, null);

  var fixture = document.querySelector('#qunit-fixture');
  assert.strictEqual(fixture.textContent, 'dirty');
});
