'use strict';

process.on('unhandledRejection', (reason) => {
  console.log('FOUND Unhandled Rejection:', reason);
});

QUnit.config.testTimeout = 1000;
QUnit.config.notrycatch = true;

QUnit.module('example', function () {
  QUnit.test('returns a rejected promise', function () {
    return Promise.reject('bad things happen');
  });
});
