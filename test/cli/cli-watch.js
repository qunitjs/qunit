'use strict';

const fs = require('fs');
const path = require('path');
const fixturify = require('fixturify');

const { executeIpc } = require('./helpers/execute.js');

const fixturePath = path.join(__dirname, 'fixtures', 'watching');
const isWindows = (process.platform === 'win32');

// TODO: Make watch tests pass on Windows. https://github.com/qunitjs/qunit/issues/1359
QUnit.module.if('CLI Watch', !isWindows, function (hooks) {
  hooks.before(function () {
    fs.rmSync(fixturePath, { recursive: true, force: true });
  });

  hooks.beforeEach(function () {
    fs.mkdirSync(path.dirname(fixturePath), { recursive: true });
    fixturify.writeSync(fixturePath, {
      'setup.js': "QUnit.on('runEnd', function() { process.send('runEnd'); });"
    });
  });

  hooks.afterEach(function () {
    fs.rmSync(fixturePath, { recursive: true, force: true });
  });

  QUnit.test.each('no change', [
    'SIGTERM',
    'SIGINT'
  ], async (assert, signal) => {
    fixturify.writeSync(fixturePath, {
      'foo.js': "QUnit.test('foo', function(assert) { assert.true(true); });"
    });

    const command = ['qunit', '--watch', 'watching'];
    const result = await executeIpc(
      command,
      execution => {
        execution.on('message', data => {
          assert.step(data);
          process.kill(execution.pid, signal);
        });
      }
    );

    assert.verifySteps(['runEnd']);
    assert.equal(result.code, 0);
    assert.equal(result.stderr, '');
    assert.equal(result.stdout, `TAP version 13
ok 1 foo
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Stopping QUnit...`);
  });

  QUnit.test('change file once', async assert => {
    fixturify.writeSync(fixturePath, {
      'foo.js': "QUnit.test('foo', function(assert) { assert.true(true); });"
    });

    const command = ['qunit', '--watch', 'watching'];
    const result = await executeIpc(
      command,
      execution => {
        execution.once('message', data => {
          assert.step(data);
          fixturify.writeSync(fixturePath, {
            'foo.js': "QUnit.test('bar', function(assert) { assert.true(true); });"
          });

          execution.once('message', data => {
            assert.step(data);
            process.kill(execution.pid);
          });
        });
      }
    );

    assert.verifySteps(['runEnd', 'runEnd']);
    assert.equal(result.code, 0);
    assert.equal(result.stderr, '');
    assert.equal(result.stdout, `TAP version 13
ok 1 foo
1..1
# pass 1
# skip 0
# todo 0
# fail 0
File update: watching/foo.js
Restarting...
TAP version 13
ok 1 bar
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Stopping QUnit...`);
  });

  QUnit.test('add file once [js]', async assert => {
    fixturify.writeSync(fixturePath, {
      'foo.js': "QUnit.test('foo', function(assert) { assert.true(true); });"
    });

    const command = ['qunit', '--watch', 'watching'];
    const result = await executeIpc(
      command,
      execution => {
        execution.once('message', data => {
          assert.step(data);
          fixturify.writeSync(fixturePath, {
            'bar.js': "QUnit.test('bar', function(assert) { assert.true(true); });"
          });

          execution.once('message', data => {
            assert.step(data);
            process.kill(execution.pid);
          });
        });
      }
    );

    assert.verifySteps(['runEnd', 'runEnd']);
    assert.equal(result.code, 0);
    assert.equal(result.stderr, '');
    assert.equal(result.stdout, `TAP version 13
ok 1 foo
1..1
# pass 1
# skip 0
# todo 0
# fail 0
File update: watching/bar.js
Restarting...
TAP version 13
ok 1 bar
ok 2 foo
1..2
# pass 2
# skip 0
# todo 0
# fail 0
Stopping QUnit...`);
  });

  // NOTE: This is known to fail on Linux with Node.js 20.12. Fixed in Node.js 20.13.
  // https://github.com/nodejs/node/issues/52018
  QUnit.test('remove file', async assert => {
    fixturify.writeSync(fixturePath, {
      'foo.js': "QUnit.test('foo', function(assert) { assert.true(true); });",
      'bar.js': "QUnit.test('bar', function(assert) { assert.true(true); });"
    });

    const command = ['qunit', '--watch', 'watching'];
    const result = await executeIpc(
      command,
      execution => {
        execution.once('message', data => {
          assert.step(data);
          fixturify.writeSync(fixturePath, {
            'bar.js': null
          });

          execution.once('message', data => {
            assert.step(data);
            process.kill(execution.pid);
          });
        });
      }
    );

    assert.verifySteps(['runEnd', 'runEnd']);
    assert.equal(result.code, 0);
    assert.equal(result.stderr, '');
    assert.equal(result.stdout, `TAP version 13
ok 1 bar
ok 2 foo
1..2
# pass 2
# skip 0
# todo 0
# fail 0
File remove: watching/bar.js
Restarting...
TAP version 13
ok 1 foo
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Stopping QUnit...`);
  });

  // Skip in coverage mode since NYC adds non-default extensions
  QUnit.test.if('add file once [other file extensions]', !process.env.NYC_PROCESS_ID, async assert => {
    fixturify.writeSync(fixturePath, {
      tests: {
        'setup.js': "QUnit.on('runEnd', function() { process.send('runEnd'); });",
        'foo.js': "QUnit.test('foo', function(assert) { assert.true(true); });"
      }
    });

    const command = ['qunit', '--watch', 'watching/tests'];
    const result = await executeIpc(
      command,
      execution => {
        execution.once('message', () => {
          fixturify.writeSync(fixturePath, {
            'x.cjs': '-',
            'x.js': '-',
            'x.json': '-',
            'x.mjs': '-',
            'x.ts': '-',
            'x.txt': '-',

            node_modules: {
              x: {
                'y.js': '-'
              }
            },

            tests: {
              'foo.js': "QUnit.test('foo2', function(assert) { assert.true(true); });",
              'setup.js': "QUnit.on('runEnd', function() { process.send('runEnd2'); });"
            }
          });

          execution.once('message', data => {
            // Ignore other re-runs
            if (data === 'runEnd2') {
              process.kill(execution.pid);
            }
          });
        });
      }
    );

    assert.equal(result.code, 0);
    assert.equal(result.stderr, '');
    assert.equal(result.stdout, `TAP version 13
ok 1 foo
1..1
# pass 1
# skip 0
# todo 0
# fail 0
File update: watching/x.cjs
File update: watching/x.js
File update: watching/x.json
File update: watching/x.mjs
File update: watching/tests/foo.js
File update: watching/tests/setup.js
Restarting...
TAP version 13
ok 1 foo2
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Stopping QUnit...`);
  });

  // Skip in coverage mode since NYC adds non-default extensions
  QUnit.test.if('add file once [TypeScript]', !process.env.NYC_PROCESS_ID, async assert => {
    fixturify.writeSync(fixturePath, {

      // Simulate what ts-node/register does
      'register.js': "require.extensions['.ts'] = function() {};",
      tests: {
        'setup.js': "QUnit.on('runEnd', function() { process.send('runEnd'); });",
        'foo.js': "QUnit.test('foo', function(assert) { assert.true(true); });"
      }
    });

    const command = ['qunit', '--watch', '--require', './watching/register', 'watching/tests'];
    const result = await executeIpc(
      command,
      execution => {
        execution.once('message', () => {
          fixturify.writeSync(fixturePath, {
            'x.js': '-',
            'x.ts': '-',
            tests: {
              'foo.js': "QUnit.test('foo2', function(assert) { assert.true(true); });",
              'setup.js': "QUnit.on('runEnd', function() { process.send('runEnd2'); });"
            }
          });

          execution.once('message', () => {
            process.kill(execution.pid);
          });
        });
      }
    );

    assert.equal(result.code, 0);
    assert.equal(result.stderr, '');
    assert.equal(result.stdout, `TAP version 13
ok 1 foo
1..1
# pass 1
# skip 0
# todo 0
# fail 0
File update: watching/x.js
File update: watching/x.ts
File update: watching/tests/foo.js
File update: watching/tests/setup.js
Restarting...
TAP version 13
ok 1 foo2
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Stopping QUnit...`);
  });

  QUnit.test('change file', async assert => {
    // An abort should finish the currently running test and any afterEach/after
    // hooks to ensure cleanup. It then ends in the middle of run, skipping any
    // other tests.

    fixturify.writeSync(fixturePath, {
      tests: {
        'setup.js': "QUnit.on('runEnd', function() { process.send('runEnd'); });",
        'foo.js': `
          process.send(require('../bar'));
          QUnit.module('Foo', {
            before() { process.send('before'); },
            beforeEach() { process.send('beforeEach'); },
            afterEach() { process.send('afterEach'); },
            after() { process.send('after'); }
          });
          QUnit.test('one', function(assert) {
            process.send('testRunning');
            var done = assert.async();
            setTimeout(function() {
              assert.true(true);
              done();
            }, 500);
          });
          QUnit.test('two', function(assert) { assert.true(true); });`
      },
      'bar.js': "module.exports = 'bar export first';"
    });

    const command = ['qunit', '--watch', 'watching/tests'];
    const result = await executeIpc(
      command,
      execution => {
        execution.on('message', function handle (data) {
          if (data === 'testRunning') {
            fixturify.writeSync(fixturePath, {
              'bar.js': "module.exports = 'bar export second';"
            });
          }

          assert.step(data);

          if (data === 'runEnd') {
            execution.off('message', handle);
            execution.on('message', data => {
              assert.step(data);

              if (data === 'runEnd') {
                process.kill(execution.pid);
              }
            });
          }
        });
      }
    );

    assert.verifySteps([
      'bar export first',
      'before',
      'beforeEach',
      'testRunning',
      'afterEach',
      'after',
      'runEnd',
      'bar export second',
      'before',
      'beforeEach',
      'testRunning',
      'afterEach',
      'beforeEach',
      'afterEach',
      'after',
      'runEnd'
    ]);
    assert.equal(result.code, 0);
    assert.equal(result.stderr, '');
    assert.equal(result.stdout, `TAP version 13
File update: watching/bar.js
Finishing current test and restarting...
ok 1 Foo > one
1..2
# pass 2
# skip 0
# todo 0
# fail 0
TAP version 13
ok 1 Foo > one
ok 2 Foo > two
1..2
# pass 2
# skip 0
# todo 0
# fail 0
Stopping QUnit...`);
  });

  QUnit.test('add file then change newly added file', async assert => {
    fixturify.writeSync(fixturePath, {
      tests: {
        'setup.js': "QUnit.on('runEnd', function() { process.send('runEnd'); });",
        'foo.js': `
          QUnit.module('Module');
          QUnit.test('Test', function(assert) {
            assert.true(true);
          });`
      }
    });

    let count = 0;
    const command = ['qunit', '--watch', 'watching/tests'];
    const result = await executeIpc(
      command,
      execution => {
        execution.on('message', data => {
          assert.step(data);

          if (data === 'runEnd') {
            count++;

            if (count === 1) {
              fixturify.writeSync(fixturePath, {
                tests: {
                  'foo.js': `
                    process.send(require('../bar.js'));
                    QUnit.module('Module');
                    QUnit.test('Test', function(assert) {
                      assert.true(true);
                    });`
                },
                'bar.js': "module.exports = 'bar export first';"
              });
            }

            if (count === 2) {
              fixturify.writeSync(fixturePath, {
                'bar.js': "module.exports = 'bar export second';"
              });
            }

            if (count === 3) {
              process.kill(execution.pid);
            }
          }
        });
      }
    );

    assert.verifySteps([
      'runEnd',
      'bar export first',
      'runEnd',
      'bar export second',
      'runEnd'
    ]);
    assert.equal(result.code, 0);
    assert.equal(result.stderr, '');
    assert.equal(result.stdout, `TAP version 13
ok 1 Module > Test
1..1
# pass 1
# skip 0
# todo 0
# fail 0
File update: watching/tests/foo.js
File update: watching/bar.js
Restarting...
TAP version 13
ok 1 Module > Test
1..1
# pass 1
# skip 0
# todo 0
# fail 0
File update: watching/bar.js
Restarting...
TAP version 13
ok 1 Module > Test
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Stopping QUnit...`);
  });
});
