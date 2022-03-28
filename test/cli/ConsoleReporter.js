const { EventEmitter } = require('events');

QUnit.module('ConsoleReporter', hooks => {
  let emitter;
  let callCount;

  hooks.beforeEach(function () {
    emitter = new EventEmitter();
    callCount = 0;
    const con = {
      log: () => {
        callCount++;
      }
    };
    QUnit.reporters.console.init(emitter, con);
  });

  QUnit.test('Event "runStart"', assert => {
    emitter.emit('runStart', {});
    assert.equal(callCount, 1);
  });

  QUnit.test('Event "runEnd"', assert => {
    emitter.emit('runEnd', {});
    assert.equal(callCount, 1);
  });

  QUnit.test('Event "testStart"', assert => {
    emitter.emit('testStart', {});
    assert.equal(callCount, 1);
  });

  QUnit.test('Event "testEnd"', assert => {
    emitter.emit('testEnd', {});
    assert.equal(callCount, 1);
  });

  QUnit.test('Event "error"', assert => {
    emitter.emit('error', {});
    assert.equal(callCount, 1);
  });
});
