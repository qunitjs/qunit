function mockStack (error) {
  error.stack = ''
    + '    at Object.<anonymous> (/dev/null/test/unit/data.js:6:5)\n'
    + '    at require (internal/helpers.js:22:18)\n'
    + '    at /dev/null/src/example/foo.js:220:27';
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

QUnit.module('TapReporter', function (hooks) {
  var emitter;
  var last;
  var buffer;
  var kleur = {
    red: function (txt) {
      return '\x1B[31m' + txt + '\x1B[39m';
    },
    yellow: function (txt) {
      return '\x1B[33m' + txt + '\x1B[39m';
    },
    cyan: function (txt) {
      return '\x1B[36m' + txt + '\x1B[39m';
    }
  };

  function log (str) {
    buffer += str + '\n';
    last = str;
  }

  hooks.beforeEach(function () {
    emitter = {
      on: function (event, fn) {
        this.on[event] = fn;
      },
      emit: function (event, data) {
        this.on[event](data);
      },
      clear: function () {
        buffer = '';
      }
    };
    last = undefined;
    buffer = '';
    QUnit.reporters.tap.init(emitter, {
      log: log
    });
  });

  QUnit.test('output the TAP header', function (assert) {
    emitter.emit('runStart', {});

    assert.strictEqual(last, 'TAP version 13');
  });

  QUnit.test('output ok for a passing test', function (assert) {
    var expected = 'ok 1 name';

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

  QUnit.test('output ok for a skipped test', function (assert) {
    var expected = kleur.yellow('ok 1 # SKIP name');

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

  QUnit.test('output not ok for a todo test', function (assert) {
    var expected = kleur.cyan('not ok 1 # TODO name');

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

  QUnit.test('output not ok for a failing test', function (assert) {
    var expected = kleur.red('not ok 1 name');

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

  QUnit.test('output all errors for a failing test', function (assert) {
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

    assert.strictEqual(buffer, kleur.red('not ok 1 name') + '\n'
+ '  ---\n'
+ '  message: first error\n'
+ '  severity: failed\n'
+ '  stack: |\n'
+ '        at Object.<anonymous> (/dev/null/test/unit/data.js:6:5)\n'
+ '        at require (internal/helpers.js:22:18)\n'
+ '        at /dev/null/src/example/foo.js:220:27\n'
+ '  ...\n'
+ '  ---\n'
+ '  message: second error\n'
+ '  severity: failed\n'
+ '  stack: |\n'
+ '        at Object.<anonymous> (/dev/null/test/unit/data.js:6:5)\n'
+ '        at require (internal/helpers.js:22:18)\n'
+ '        at /dev/null/src/example/foo.js:220:27\n'
+ '  ...\n'
    );
  });

  QUnit.test('output global failure (string)', function (assert) {
    emitter.emit('runStart');
    emitter.clear();
    emitter.emit('error', 'Boo');

    assert.strictEqual(buffer, kleur.red('not ok 1 global failure') + '\n'
+ '  ---\n'
+ '  message: Boo\n'
+ '  severity: failed\n'
+ '  ...\n'
+ 'Bail out! Boo\n'
    );
  });

  QUnit.test('output global failure (Error)', function (assert) {
    var err = new ReferenceError('Boo is not defined');
    mockStack(err);
    emitter.emit('runStart');
    emitter.clear();
    emitter.emit('error', err);

    assert.strictEqual(buffer, kleur.red('not ok 1 global failure') + '\n'
+ '  ---\n'
+ '  message: ReferenceError: Boo is not defined\n'
+ '  severity: failed\n'
+ '  stack: |\n'
+ '        at Object.<anonymous> (/dev/null/test/unit/data.js:6:5)\n'
+ '        at require (internal/helpers.js:22:18)\n'
+ '        at /dev/null/src/example/foo.js:220:27\n'
+ '  ...\n'
+ 'Bail out! ReferenceError: Boo is not defined\n'
    );
  });

  QUnit.test('output expected value of Infinity', function (assert) {
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
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : actual\n'
+ '  expected: Infinity\n'
+ '  ...'
    );
  });

  QUnit.test('output actual value of undefined', function (assert) {
    emitter.emit('testEnd', makeFailingTestEnd(undefined));
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : undefined\n'
+ '  expected: expected\n'
+ '  ...'
    );
  });

  QUnit.test('output actual value of Infinity', function (assert) {
    emitter.emit('testEnd', makeFailingTestEnd(Infinity));
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : Infinity\n'
+ '  expected: expected\n'
+ '  ...'
    );
  });

  QUnit.test('output actual value of a string', function (assert) {
    emitter.emit('testEnd', makeFailingTestEnd('abc'));

    // No redundant quotes
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : abc\n'
+ '  expected: expected\n'
+ '  ...'
    );
  });

  QUnit.test('output actual value with one trailing line break', function (assert) {
    emitter.emit('testEnd', makeFailingTestEnd('abc\n'));
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : |\n'
+ '    abc\n'
+ '  expected: expected\n'
+ '  ...'
    );
  });

  QUnit.test('output actual value with two trailing line breaks', function (assert) {
    emitter.emit('testEnd', makeFailingTestEnd('abc\n\n'));
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : |+\n'
+ '    abc\n'
+ '    \n'
+ '    \n'
+ '  expected: expected\n'
+ '  ...'
    );
  });

  QUnit.test('output actual value of a number string', function (assert) {
    emitter.emit('testEnd', makeFailingTestEnd('2'));

    // Quotes required to disambiguate YAML value
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : "2"\n'
+ '  expected: expected\n'
+ '  ...'
    );
  });

  QUnit.test('output actual value of boolean string', function (assert) {
    emitter.emit('testEnd', makeFailingTestEnd('true'));

    // Quotes required to disambiguate YAML value
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : "true"\n'
+ '  expected: expected\n'
+ '  ...'
    );
  });

  QUnit.test('output actual value of 0', function (assert) {
    emitter.emit('testEnd', makeFailingTestEnd(0));
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : 0\n'
+ '  expected: expected\n'
+ '  ...'
    );
  });

  QUnit.test('output actual assertion value of empty array', function (assert) {
    emitter.emit('testEnd', makeFailingTestEnd([]));
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : []\n'
+ '  expected: expected\n'
+ '  ...'
    );
  });

  QUnit.test('output actual value with a cyclical structure', function (assert) {
    /// Creates an object that has a cyclical reference.
    function createCyclical () {
      var cyclical = { a: 'example' };
      cyclical.cycle = cyclical;
      return cyclical;
    }
    emitter.emit('testEnd', makeFailingTestEnd(createCyclical()));
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : {\n'
+ '  "a": "example",\n'
+ '  "cycle": "[Circular]"\n'
+ '}\n'
+ '  expected: expected\n'
+ '  ...'
    );
  });

  QUnit.test('output actual value with a subobject cyclical structure', function (assert) {
    // Creates an object that has a cyclical reference in a subobject.
    function createSubobjectCyclical () {
      var cyclical = { a: 'example', sub: {} };
      cyclical.sub.cycle = cyclical;
      return cyclical;
    }
    emitter.emit('testEnd', makeFailingTestEnd(createSubobjectCyclical()));
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : {\n'
+ '  "a": "example",\n'
+ '  "sub": {\n'
+ '    "cycle": "[Circular]"\n'
+ '  }\n'
+ '}\n'
+ '  expected: expected\n'
+ '  ...'
    );
  });

  QUnit.test('output actual value with a cyclical array', function (assert) {
    function createCyclicalArray () {
      var cyclical = { sub: ['example'] };
      cyclical.sub.push(cyclical.sub);
      cyclical.sub.push(cyclical);
      return cyclical;
    }
    emitter.emit('testEnd', makeFailingTestEnd(createCyclicalArray()));
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : {\n'
+ '  "sub": [\n'
+ '    "example",\n'
+ '    "[Circular]",\n'
+ '    "[Circular]"\n'
+ '  ]\n'
+ '}\n'
+ '  expected: expected\n'
+ '  ...'
    );
  });

  QUnit.test('output actual assertion value of an acyclical structure', function (assert) {
    // Creates an object that references another object more
    // than once in an acyclical way.
    function createDuplicateAcyclical () {
      var duplicate = {
        example: 'value'
      };
      return {
        a: duplicate,
        b: duplicate,
        c: 'unique'
      };
    }
    emitter.emit('testEnd', makeFailingTestEnd(createDuplicateAcyclical()));
    assert.strictEqual(last, '  ---\n'
+ '  message: failed\n'
+ '  severity: failed\n'
+ '  actual  : {\n'
+ '  "a": {\n'
+ '    "example": "value"\n'
+ '  },\n'
+ '  "b": {\n'
+ '    "example": "value"\n'
+ '  },\n'
+ '  "c": "unique"\n'
+ '}\n'
+ '  expected: expected\n'
+ '  ...'
    );
  });

  QUnit.test('output the total number of tests', function (assert) {
    emitter.emit('runEnd', {
      testCounts: {
        total: 6,
        passed: 3,
        failed: 2,
        skipped: 1,
        todo: 0
      }
    });

    assert.strictEqual(buffer, '1..6\n'
+ '# pass 3\n' + kleur.yellow('# skip 1') + '\n' + kleur.cyan('# todo 0') + '\n' + kleur.red('# fail 2') + '\n'
    );
  });
});
