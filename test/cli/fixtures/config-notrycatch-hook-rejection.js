'use strict';

process.on('unhandledRejection', (reason) => {
  console.log('FOUND Unhandled Rejection:', reason);
});

QUnit.config.testTimeout = 1000;
QUnit.config.notrycatch = true;

QUnit.module('example', function (hooks) {
  hooks.beforeEach(() => {
    return Promise.reject('bad things happen');
  });

  QUnit.test('passing test', assert => {
    assert.true(true);
  });
});
