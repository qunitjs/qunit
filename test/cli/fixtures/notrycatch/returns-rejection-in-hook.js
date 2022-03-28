'use strict';

process.on('unhandledRejection', (reason) => {
  console.log('Unhandled Rejection:', reason);
});

QUnit.config.notrycatch = true;

QUnit.module('notrycatch', function (hooks) {
  hooks.beforeEach(() => {
    return Promise.reject('bad things happen sometimes');
  });

  QUnit.test('passing test', assert => {
    assert.true(true);
  });
});
