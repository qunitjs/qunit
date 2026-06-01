'use strict';

// Same as unhandled-rejection.js but with this enabled
//
// NOTE: You might expect that for Node.js a setting in one of the JS files
// (instead of via preconfig), can only ignore unhandled rejections after
// QUnit.start (i.e. after /src/cli/run.js has loaded these files, attached
// the onUnhandledRejection listener, and then call QUnit.start).
//
// However, Node.js must buffer rejections until the next tick to know if they
// were unhandled, so this succesfully ignores the intial "outside of test context"
// error as well (rejected synchronously while loading this file).
QUnit.config.ignoreUnhandledRejections = true;

QUnit.module('Unhandled Rejections', function () {
  QUnit.test('example', function (assert) {
    assert.true(true);

    const done = assert.async();

    Promise.resolve().then(function () {
      throw new Error('Boo during test');
    });

    // delay test until unhandled rejection fires
    setTimeout(done, 10);
  });
});

Promise.reject(new Error('Boo before first test'));
