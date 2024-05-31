/* eslint-env browser */

QUnit.config.autostart = false;

// Real
QUnit.start();

// Bad 1
QUnit.config.autostart = true;
try {
  QUnit.start();
} catch (thrownError) {
  window.autostartStartError = thrownError;
}

// Bad 2
QUnit.config.autostart = false;
try {
  QUnit.start();
} catch (thrownError) {
  window.tooManyStartsError = thrownError;
}

QUnit.module('startError');

QUnit.test('start() with autostart enabled [Bad 1]', function (assert) {
  assert.propContains(window.autostartStartError,
    { message: 'QUnit.start() called too many times. Did you call QUnit.start() in browser context when autostart is also enabled? https://qunitjs.com/api/QUnit/start/' });
});

QUnit.test('start() again [Bad 2]', function (assert) {
  assert.propContains(window.tooManyStartsError,
    { message: 'QUnit.start() called too many times.' });
});

QUnit.test('start() inside a test', function (assert) {
  assert.throws(function () {
    // eslint-disable-next-line qunit/no-qunit-start-in-tests
    QUnit.start();
  },
  new Error('QUnit.start cannot be called inside a test.'));
});
