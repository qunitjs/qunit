'use strict';

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
