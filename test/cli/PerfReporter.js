const { EventEmitter } = require('events');

class MockPerf {
  constructor () {
    this.marks = new Map();
    this.measures = [];
    this.clock = 1;
  }

  mark (name) {
    this.clock++;
    this.marks.set(name, this.clock);
  }

  measure (name, startMark, endMark) {
    const startTime = this.marks.get(startMark);
    const endTime = this.marks.get(endMark);
    this.measures.push({ name, startTime, endTime });
    this.measures.sort((a, b) => a.startTime - b.startTime);
  }
}

QUnit.module('PerfReporter', hooks => {
  let emitter;
  let perf;

  hooks.beforeEach(function () {
    emitter = new EventEmitter();
    perf = new MockPerf();
    QUnit.reporters.perf.init(emitter, {
      perf
    });
  });

  QUnit.test('Flat suites', assert => {
    emitter.emit('runStart', {});
    emitter.emit('suiteStart', { fullName: ['Foo'] });
    emitter.emit('testStart', { fullName: ['Foo', 'example'] });
    emitter.emit('testEnd', { fullName: ['Foo', 'example'] });
    emitter.emit('suiteEnd', { fullName: ['Foo'] });
    emitter.emit('suiteStart', { fullName: ['Bar'] });
    emitter.emit('testStart', { fullName: ['Bar', 'example'] });
    emitter.emit('testEnd', { fullName: ['Bar', 'example'] });
    emitter.emit('suiteEnd', { fullName: ['Bar'] });
    emitter.emit('runEnd', {});

    assert.deepEqual(
      perf.measures,
      [{
        name: 'QUnit Test Run',
        startTime: 2,
        endTime: 11
      },
      {
        name: 'QUnit Test Suite: Foo',
        startTime: 3,
        endTime: 6
      },
      {
        name: 'QUnit Test: Foo – example',
        startTime: 4,
        endTime: 5
      },
      {
        name: 'QUnit Test Suite: Bar',
        startTime: 7,
        endTime: 10
      },
      {
        name: 'QUnit Test: Bar – example',
        startTime: 8,
        endTime: 9
      }]
    );
  });

  QUnit.test('Nested suites', assert => {
    emitter.emit('runStart', {});
    emitter.emit('suiteStart', { fullName: ['Foo'] });
    emitter.emit('testStart', { fullName: ['Foo', 'one'] });
    emitter.emit('testEnd', { fullName: ['Foo', 'one'] });
    emitter.emit('suiteStart', { fullName: ['Foo', 'Bar'] });
    emitter.emit('testStart', { fullName: ['Foo', 'Bar', 'two'] });
    emitter.emit('testEnd', { fullName: ['Foo', 'Bar', 'two'] });
    emitter.emit('suiteEnd', { fullName: ['Foo', 'Bar'] });
    emitter.emit('suiteEnd', { fullName: ['Fo'] });
    emitter.emit('runEnd', {});

    assert.deepEqual(
      perf.measures,
      [{
        name: 'QUnit Test Run',
        startTime: 2,
        endTime: 11
      },
      {
        name: 'QUnit Test Suite: Fo',
        startTime: 3,
        endTime: 10
      },
      {
        name: 'QUnit Test: Foo – one',
        startTime: 4,
        endTime: 5
      },
      {
        name: 'QUnit Test Suite: Foo – Bar',
        startTime: 6,
        endTime: 9
      },
      {
        name: 'QUnit Test: Foo – Bar – two',
        startTime: 7,
        endTime: 8
      }]
    );
  });
});
