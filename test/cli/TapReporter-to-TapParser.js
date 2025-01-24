const { EventEmitter } = require('events');
const Parser = require('tap-parser');

QUnit.module('TapReporter-to-TapParser', hooks => {
  let emitter;
  let buffer = '';

  function log (str) {
    buffer += str + '\n';
  }

  async function getParseResult () {
    const p = new Parser({ passes: true });
    const onComplete = new Promise((resolve) => p.on('complete', resolve));
    // console.log(buffer); // Debugging
    p.write(buffer);
    p.end();
    return await onComplete;
  }

  hooks.beforeEach(function () {
    buffer = '';
    emitter = new EventEmitter();
    QUnit.reporters.tap.init(emitter, {
      log: log
    });
  });

  QUnit.test('Basic summary', async (assert) => {
    emitter.emit('runStart');
    ['example', 'hello', 'world'].forEach((name) => {
      emitter.emit('testEnd', {
        fullName: [name],
        status: 'passed',
        runtime: 0,
        errors: [],
        assertions: []
      });
    });
    emitter.emit('runEnd', {
      testCounts: {
        total: 3,
        passed: 3,
        failed: 0,
        skipped: 0,
        todo: 0
      }
    });

    assert.propContains(await getParseResult(), {
      ok: true,
      count: 3,
      pass: 3,
      fail: 0,
      todo: 0,
      skip: 0,
      plan: {
        start: 1,
        end: 3
      }
    });
  });

  QUnit.test('Basic test failure', async (assert) => {
    emitter.emit('runStart');
    emitter.emit('testEnd', {
      fullName: ['example'],
      status: 'failed',
      runtime: 0,
      errors: [{
        message: 'equal',
        passed: false,
        actual: 'the moon',
        expected: 'the only light we\'ll see',
        stack: '  at /bla.js:3'
      }]
    });
    emitter.emit('runEnd', {
      testCounts: {
        total: 1,
        passed: 0,
        failed: 1,
        skipped: 0,
        todo: 0
      }
    });

    assert.propContains(await getParseResult(), {
      ok: false,
      count: 1,
      pass: 0,
      fail: 1,
      todo: 0,
      skip: 0,
      plan: {
        start: 1,
        end: 1
      },
      failures: [
        {
          ok: false,
          name: '\u001b[31mexample\u001b[39m',
          diag: {
            message: 'equal',
            severity: 'failed',
            actual: 'the moon',
            expected: 'the only light we\'ll see',
            stack: 'at /bla.js:3\n'
          }
        }
      ]
    });
  });

  QUnit.test('Deep equal failure', async (assert) => {
    emitter.emit('runStart');
    emitter.emit('testEnd', {
      fullName: ['example'],
      status: 'failed',
      runtime: 0,
      errors: [{
        message: 'deepEqual',
        passed: false,
        actual: { the: 'moon' },
        expected: { the: 'only light we\'ll see' },
        stack: '  at /bla.js:3'
      }]
    });
    emitter.emit('runEnd', {
      testCounts: {
        total: 1,
        passed: 0,
        failed: 1,
        skipped: 0,
        todo: 0
      }
    });

    assert.propContains(await getParseResult(), {
      ok: false,
      count: 1,
      pass: 0,
      fail: 1,
      todo: 0,
      skip: 0,
      plan: {
        start: 1,
        end: 1
      },
      failures: [
        {
          ok: false,
          name: '\u001b[31mexample\u001b[39m',
          diag: {
            message: 'deepEqual',
            severity: 'failed',
            actual: { the: 'moon' },
            expected: { the: 'only light we\'ll see' },
            stack: 'at /bla.js:3\n'
          }
        }
      ]
    });
  });

  QUnit.test('Directives', async (assert) => {
    emitter.emit('runStart');
    const tests = {
      example: 'passed',
      hello: 'skipped',
      world: 'todo'
    };
    for (const name in tests) {
      emitter.emit('testEnd', {
        fullName: [name],
        status: tests[name],
        runtime: 0,
        errors: [],
        assertions: []
      });
    }
    emitter.emit('runEnd', {
      testCounts: {
        total: 3,
        passed: 1,
        failed: 0,
        skipped: 1,
        todo: 1
      }
    });

    assert.propContains(await getParseResult(), {
      ok: true,
      count: 3,
      pass: 2, // tap-parser counts SKIP as both 'skip' and 'pass'
      fail: 1, // tap-parser counts TODO as both 'todo' and 'fail'
      todo: 1,
      skip: 1,
      plan: {
        start: 1,
        end: 3
      },
      passes: [{
        ok: true,
        name: 'example'
      }, {
        ok: true,
        name: '\u001b[33mhello\u001b[39m'
      }]
    });
  });
});
