/* eslint-env browser */
QUnit.module('QUnit.config [preconfigured]');

QUnit.test('config', function (assert) {
  assert.strictEqual(QUnit.config.maxDepth, 5, 'maxDepth default');
  assert.false(QUnit.config.autostart, 'autostart override');
  assert.false(QUnit.config.reorder, 'reorder override');
});

window.addEventListener('load', function () {
  setTimeout(function () {
    QUnit.start();
  }, 1);
});
