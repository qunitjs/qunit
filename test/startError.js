/* eslint-env browser */

try {
  QUnit.config.autostart = true;
  QUnit.start();
} catch (thrownError) {
  window.autostartStartError = thrownError;
}

try {
  QUnit.start();
} catch (thrownError) {
  window.tooManyStartsError = thrownError;
}

QUnit.module('global start unrecoverable errors');

QUnit.test('start() throws when QUnit.config.autostart === true', function (assert) {
  assert.equal(window.autostartStartError.message,
    'Called start() outside of a test context when QUnit.config.autostart was true');
});

QUnit.test('Throws after calling start() too many times outside of a test context', function (assert) {
  assert.equal(window.tooManyStartsError.message,
    'Called start() outside of a test context too many times');
});

QUnit.test('QUnit.start cannot be called inside a test context.', function (assert) {
  assert.throws(function () {
    // eslint-disable-next-line qunit/no-qunit-start-in-tests
    QUnit.start();
  },
  /QUnit\.start cannot be called inside a test context\./);
});
