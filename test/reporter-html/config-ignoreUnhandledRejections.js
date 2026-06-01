/* eslint-env browser */
/* global Promise */

// Same as unhandled-rejection.js but with this enabled and no capture and no expected failure.
// This test run fails without this line.
QUnit.config.ignoreUnhandledRejections = true;

var HAS_UNHANDLED_REJECTION_HANDLER = ('onunhandledrejection' in window && typeof Promise === 'function');

QUnit.module.if('Unhandled Rejections', HAS_UNHANDLED_REJECTION_HANDLER, function () {
  QUnit.test('example', function (assert) {
    assert.true(true);

    var done = assert.async();

    // eslint-disable-next-line compat/compat -- Checked
    Promise.resolve().then(function () {
      throw new Error('Boo during test');
    });

    // wait until unhandled rejection fires
    setTimeout(function () {
      done();
    }, 10);
  });
});
