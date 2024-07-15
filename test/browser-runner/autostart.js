/* eslint-env browser */
QUnit.start();

QUnit.module('autostart');

QUnit.test('Prove the test run started as expected', function (assert) {
  var delay = window.times.runStarted - window.times.autostartOff;
  assert.pushResult({
    result: delay >= 1000,
    actual: delay,
    message: 'delay'
  });
  assert.strictEqual(window.beginData.totalTests, 1, 'Should have expected 1 test');
});
