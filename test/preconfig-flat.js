/* eslint-env browser */
QUnit.module('QUnit.config [preconfigured]');

QUnit.test('config', function (assert) {
  assert.strictEqual(QUnit.config.maxDepth, 5, 'maxDepth default');
  assert.false(QUnit.config.autostart, 'autostart');
  assert.strictEqual(QUnit.config.seed, 'd84af39036', 'seed');

  // readFlatPreconfigBoolean
  assert.strictEqual(QUnit.config.altertitle, true, 'altertitle "true"');
  assert.strictEqual(QUnit.config.noglobals, true, 'noglobals "1"');
  assert.strictEqual(QUnit.config.notrycatch, false, 'notrycatch "false"');
});

window.addEventListener('load', function () {
  setTimeout(function () {
    QUnit.start();
  }, 1);
});
