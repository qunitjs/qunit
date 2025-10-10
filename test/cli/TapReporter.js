const { EventEmitter } = require('events');

function mockStack (error) {
  error.stack = `    at Object.<anonymous> (/dev/null/test/unit/data.js:6:5)
    at require (internal/helpers.js:22:18)
    at /dev/null/src/example/foo.js:220:27`;
  return error;
}

function makeFailingTestEnd (actualValue) {
  return {
    name: 'Failing',
    suiteName: null,
    fullName: ['Failing'],
    status: 'failed',
    runtime: 0,
    errors: [{
      passed: false,
      actual: actualValue,
      expected: 'expected'
    }],
    assertions: null
  };
}

QUnit.module('TapReporter', hooks => {
  let emitter;
  let last;
  let buffer;

  function stripAsciEscapes (text) {
    // eslint-disable-next-line no-control-regex
    return text.replace(/\x1b\[[0-9]+m/g, '');
  }

  function log (str) {
    // Test independently of stdout.isTTY or env.FORCE_COLOR
    str = stripAsciEscapes(str);
    buffer += str + '\n';
    last = str;
  }

  hooks.beforeEach(function () {
    emitter = new EventEmitter();
    emitter.clear = function () {
      buffer = '';
    };
    last = undefined;
    buffer = '';
    QUnit.reporters.tap.init(emitter, {
      log: log
    });
  });

  QUnit.test('output the TAP header', assert => {
    emitter.emit('runStart', {});

    assert.strictEqual(last, 'TAP version 13');
  });

  QUnit.test('output ok for a passing test', assert => {
    const expected = 'ok 1 name';

    emitter.emit('testEnd', {
      name: 'name',
      suiteName: null,
      fullName: ['name'],
      status: 'passed',
      runtime: 0,
      errors: [],
      assertions: []
    });

    assert.strictEqual(last, expected);
  });

  QUnit.test('output ok for a skipped test', assert => {
    const expected = 'ok 1 name # SKIP';

    emitter.emit('testEnd', {
      name: 'name',
      suiteName: null,
      fullName: ['name'],
      status: 'skipped',
      runtime: 0,
      errors: [],
      assertions: []
    });
    assert.strictEqual(last, expected);
  });

  QUnit.test('output not ok for a todo test', assert => {
    const expected = 'not ok 1 name # TODO';

    emitter.emit('testEnd', {
      name: 'name',
      suiteName: null,
      fullName: ['name'],
      status: 'todo',
      runtime: 0,
      errors: [],
      assertions: []
    });
    assert.strictEqual(last, expected);
  });

  QUnit.test('output not ok for a failing test', assert => {
    const expected = 'not ok 1 name';

    emitter.emit('testEnd', {
      name: 'name',
      suiteName: null,
      fullName: ['name'],
      status: 'failed',
      runtime: 0,
      errors: [],
      assertions: []
    });
    assert.strictEqual(last, expected);
  });

  QUnit.test('output all errors for a failing test', assert => {
    emitter.emit('testEnd', {
      name: 'name',
      suiteName: null,
      fullName: ['name'],
      status: 'failed',
      runtime: 0,
      errors: [
        mockStack(new Error('first error')),
        mockStack(new Error('second error'))
      ],
      assertions: []
    });

    assert.strictEqual(buffer, `not ok 1 name
  ---
  message: first error
  severity: failed
  stack: |
        at Object.<anonymous> (/dev/null/test/unit/data.js:6:5)
        at require (internal/helpers.js:22:18)
        at /dev/null/src/example/foo.js:220:27
  ...
  ---
  message: second error
  severity: failed
  stack: |
        at Object.<anonymous> (/dev/null/test/unit/data.js:6:5)
        at require (internal/helpers.js:22:18)
        at /dev/null/src/example/foo.js:220:27
  ...
`
    );
  });

  QUnit.test('output global failure (string)', assert => {
    emitter.emit('runStart');
    emitter.clear();

    emitter.emit('error', 'Boo');

    assert.strictEqual(buffer, `not ok 1 global failure
  ---
  message: Boo
  severity: failed
  ...
Bail out! Boo
`
    );
  });

  QUnit.test('output global failure (Error)', assert => {
    emitter.emit('runStart');
    emitter.clear();

    const err = new ReferenceError('Boo is not defined');
    mockStack(err);
    emitter.emit('error', err);

    assert.strictEqual(buffer, `not ok 1 global failure
  ---
  message: ReferenceError: Boo is not defined
  severity: failed
  stack: |
        at Object.<anonymous> (/dev/null/test/unit/data.js:6:5)
        at require (internal/helpers.js:22:18)
        at /dev/null/src/example/foo.js:220:27
  ...
Bail out! ReferenceError: Boo is not defined
`
    );
  });

  QUnit.test('output expected value of Infinity', assert => {
    emitter.emit('testEnd', {
      name: 'Failing',
      suiteName: null,
      fullName: ['Failing'],
      status: 'failed',
      runtime: 0,
      errors: [{
        passed: false,
        actual: 'actual',
        expected: Infinity
      }],
      assertions: null
    });
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : actual
  expected: Infinity
  ...`
    );
  });

  QUnit.test('output actual value of undefined', assert => {
    emitter.emit('testEnd', makeFailingTestEnd(undefined));
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : undefined
  expected: expected
  ...`
    );
  });

  QUnit.test('output actual value of Infinity', assert => {
    emitter.emit('testEnd', makeFailingTestEnd(Infinity));
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : Infinity
  expected: expected
  ...`
    );
  });

  QUnit.test('output actual value of a string', assert => {
    emitter.emit('testEnd', makeFailingTestEnd('abc'));

    // No redundant quotes
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : abc
  expected: expected
  ...`
    );
  });

  QUnit.test('output actual value with one trailing line break', assert => {
    emitter.emit('testEnd', makeFailingTestEnd('abc\n'));
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : |
    abc
  expected: expected
  ...`
    );
  });

  QUnit.test('output actual value with two trailing line breaks', assert => {
    emitter.emit('testEnd', makeFailingTestEnd('abc\n\n'));
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : |+
    abc
    
    
  expected: expected
  ...`
    );
  });

  QUnit.test('output actual value of a number string', assert => {
    emitter.emit('testEnd', makeFailingTestEnd('2'));

    // Quotes required to disambiguate YAML value
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : "2"
  expected: expected
  ...`
    );
  });

  QUnit.test('output actual value of boolean string', assert => {
    emitter.emit('testEnd', makeFailingTestEnd('true'));

    // Quotes required to disambiguate YAML value
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : "true"
  expected: expected
  ...`
    );
  });

  QUnit.test('output actual value of 0', assert => {
    emitter.emit('testEnd', makeFailingTestEnd(0));
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : 0
  expected: expected
  ...`
    );
  });

  QUnit.test('output actual assertion value of empty array', assert => {
    emitter.emit('testEnd', makeFailingTestEnd([]));
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : []
  expected: expected
  ...`
    );
  });

  QUnit.test('output actual value with a cyclical structure', assert => {
    /// Creates an object that has a cyclical reference.
    function createCyclical () {
      const cyclical = { a: 'example' };
      cyclical.cycle = cyclical;
      return cyclical;
    }
    emitter.emit('testEnd', makeFailingTestEnd(createCyclical()));
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : {
    "a": "example",
    "cycle": "[Circular]"
  }
  expected: expected
  ...`
    );
  });

  QUnit.test('output actual value with a subobject cyclical structure', assert => {
    // Creates an object that has a cyclical reference in a subobject.
    function createSubobjectCyclical () {
      const cyclical = { a: 'example', sub: {} };
      cyclical.sub.cycle = cyclical;
      return cyclical;
    }
    emitter.emit('testEnd', makeFailingTestEnd(createSubobjectCyclical()));
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : {
    "a": "example",
    "sub": {
      "cycle": "[Circular]"
    }
  }
  expected: expected
  ...`
    );
  });

  QUnit.test('output actual value with a cyclical array', assert => {
    function createCyclicalArray () {
      const cyclical = { sub: ['example'] };
      cyclical.sub.push(cyclical.sub);
      cyclical.sub.push(cyclical);
      return cyclical;
    }
    emitter.emit('testEnd', makeFailingTestEnd(createCyclicalArray()));
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : {
    "sub": [
      "example",
      "[Circular]",
      "[Circular]"
    ]
  }
  expected: expected
  ...`
    );
  });

  QUnit.test('output actual assertion value of an acyclical structure', assert => {
    // Creates an object that references another object more
    // than once in an acyclical way.
    function createDuplicateAcyclical () {
      const duplicate = {
        example: 'value'
      };
      return {
        a: duplicate,
        b: duplicate,
        c: 'unique'
      };
    }
    emitter.emit('testEnd', makeFailingTestEnd(createDuplicateAcyclical()));
    assert.strictEqual(last, `  ---
  message: failed
  severity: failed
  actual  : {
    "a": {
      "example": "value"
    },
    "b": {
      "example": "value"
    },
    "c": "unique"
  }
  expected: expected
  ...`
    );
  });

  QUnit.test('output the total number of tests', assert => {
    emitter.emit('runEnd', {
      testCounts: {
        total: 6,
        passed: 3,
        failed: 2,
        skipped: 1,
        todo: 0
      }
    });

    assert.strictEqual(buffer, `1..6
# pass 3
# skip 1
# todo 0
# fail 2
`
    );
  });
});
