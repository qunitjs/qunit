'use strict';

const expectedOutput = require('./fixtures/expected/tap-outputs');
const { execute, prettyPrintCommand } = require('./helpers/execute');
const semver = require('semver');

const skipOnWinTest = (process.platform === 'win32' ? 'skip' : 'test');

function getExpected (command) {
  return expectedOutput[prettyPrintCommand(command)];
}

QUnit.module('CLI Main', () => {
  QUnit.test("defaults to running tests in 'test' directory", async assert => {
    const command = ['qunit'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('errors if no test files are found to run', async assert => {
    try {
      await execute(['qunit', 'does-not-exist.js']);
    } catch (e) {
      assert.true(e.stderr.includes('No files were found matching'));
    }
  });

  QUnit.test('accepts globs for test files to run', async assert => {
    const command = ['qunit', 'glob/**/*-test.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('runs a single JS file', async assert => {
    const command = ['qunit', 'single.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('runs multiple JS files', async assert => {
    const command = ['qunit', 'single.js', 'double.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('runs all JS files in a directory matching an arg', async assert => {
    const command = ['qunit', 'test'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('runs multiple types of file paths', async assert => {
    const command = ['qunit', 'test', 'single.js', 'glob/**/*-test.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('logs test files that fail to load properly', async assert => {
    try {
      await execute(['qunit', 'syntax-error/test.js']);
    } catch (e) {
      assert.true(e.stdout.includes('not ok 1 global failure'));
      assert.true(e.stdout.includes('Failed to load file syntax-error/test.js'));
      assert.true(e.stdout.includes('ReferenceError: varIsNotDefined is not defined'));
      assert.equal(e.code, 1);
    }
  });

  // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
  QUnit[skipOnWinTest]('report assert.throws() failures properly', async assert => {
    const command = ['qunit', 'fail/throws-match.js'];
    try {
      await execute(command);
    } catch (e) {
      assert.equal(e.code, 1);
      assert.equal(e.stderr, '');
      assert.equal(e.stdout, getExpected(command));
    }
  });

  QUnit.test('exit code is 1 when failing tests are present', async assert => {
    try {
      await execute(['qunit', 'fail/failure.js']);
    } catch (e) {
      assert.equal(e.code, 1);
    }
  });

  QUnit.test('exit code is 1 when no tests are run', async assert => {
    const command = ['qunit', 'no-tests'];
    try {
      await execute(command);
    } catch (e) {
      assert.equal(e.code, 1);
      assert.equal(e.stderr, '');
      assert.equal(e.stdout, getExpected(command));
    }
  });

  QUnit.test('exit code is 0 when no tests are run and failOnZeroTests is `false`', async assert => {
    const command = ['qunit', 'assert-expect/no-tests.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('exit code is 1 when no tests exit before done', async assert => {
    const command = ['qunit', 'hanging-test'];
    try {
      await execute(command);
    } catch (e) {
      assert.equal(e.code, 1);
      assert.equal(e.stderr, getExpected(command));
    }
  });

  QUnit.test('unhandled rejections fail tests', async assert => {
    const command = ['qunit', 'unhandled-rejection.js'];

    try {
      const result = await execute(command);
      assert.pushResult({
        result: false,
        actual: result.stdout
      });
    } catch (e) {
      assert.equal(e.code, 1);
      assert.equal(e.stderr, '');
      assert.equal(e.stdout, getExpected(command));
    }
  });

  QUnit.test('hard errors in test using `assert.async` are caught and reported', async assert => {
    const command = ['qunit', 'hard-error-in-test-with-no-async-handler.js'];

    try {
      const result = await execute(command);
      assert.pushResult({
        result: false,
        actual: result.stdout
      });
    } catch (e) {
      assert.equal(e.code, 1);
      assert.equal(e.stderr, '');
      assert.true(e.stdout.includes('Died on test #2     at '));
      assert.true(e.stdout.includes('Error: expected error thrown in test'));
    }
  });

  QUnit.test('hard errors in hook are caught and reported', async assert => {
    const command = ['qunit', 'hard-error-in-hook.js'];

    try {
      const result = await execute(command);
      assert.pushResult({
        result: false,
        actual: result.stdout
      });
    } catch (e) {
      assert.equal(e.code, 1);
      assert.equal(e.stderr, '');
      assert.true(e.stdout.includes('message: before failed on contains a hard error: expected error thrown in hook'));
      assert.true(e.stdout.includes('Error: expected error thrown in hook'));
    }
  });

  // Regression test against "details of begin error swallowed"
  // https://github.com/qunitjs/qunit/issues/1446
  QUnit.test('report failure in begin callback', async assert => {
    const command = ['qunit', 'bad-callbacks/begin-throw.js'];

    try {
      const result = await execute(command);
      assert.pushResult({
        result: false,
        actual: result.stdout
      });
    } catch (e) {
      assert.equal(e.code, 1);
      assert.equal(e.stdout, getExpected(command));
    }
  });

  QUnit.test('report failure in done callback', async assert => {
    const command = ['qunit', 'bad-callbacks/done-throw.js'];

    try {
      const result = await execute(command);
      assert.pushResult({
        result: false,
        actual: result.stdout
      });
    } catch (e) {
      assert.equal(e.code, 1);
      assert.equal(e.stdout, getExpected(command));
    }
  });

  QUnit.test('report failure in moduleDone callback', async assert => {
    const command = ['qunit', 'bad-callbacks/moduleDone-throw.js'];

    try {
      const result = await execute(command);
      assert.pushResult({
        result: false,
        actual: result.stdout
      });
    } catch (e) {
      assert.equal(e.code, 1);

      // FIXME: The details of this error are swallowed
      assert.equal(e.stdout, `TAP version 13
ok 1 module1 > test1`);
      assert.equal(e.stderr, 'Error: Process exited before tests finished running');
    }
  });

  QUnit.test('report failure in testStart callback', async assert => {
    const command = ['qunit', 'bad-callbacks/testStart-throw.js'];

    try {
      const result = await execute(command);
      assert.pushResult({
        result: false,
        actual: result.stdout
      });
    } catch (e) {
      assert.equal(e.code, 1);

      // FIXME: The details of this error are swallowed
      assert.equal(e.stdout, 'TAP version 13');
      assert.equal(e.stderr, 'Error: Process exited before tests finished running');
    }
  });

  QUnit.test('callbacks', async assert => {
    const expected = `CALLBACK: begin1
CALLBACK: begin2
CALLBACK: moduleStart1
CALLBACK: moduleStart2
CALLBACK: testStart1
CALLBACK: testStart2
CALLBACK: module1 > before
CALLBACK: module1 > beforeEach
TEST: module1 > test1
CALLBACK: log1
CALLBACK: log2
CALLBACK: module1 > afterEach
CALLBACK: testDone1
CALLBACK: testDone2
CALLBACK: moduleStart1
CALLBACK: moduleStart2
CALLBACK: testStart1
CALLBACK: testStart2
CALLBACK: module2 > before
CALLBACK: module1 > beforeEach
CALLBACK: module2 > beforeEach
TEST: module2 > test1
CALLBACK: log1
CALLBACK: log2
CALLBACK: module2 > afterEach
CALLBACK: module1 > afterEach
CALLBACK: module2 > after
CALLBACK: testDone1
CALLBACK: testDone2
CALLBACK: moduleDone1
CALLBACK: moduleDone2
CALLBACK: moduleStart1
CALLBACK: moduleStart2
CALLBACK: testStart1
CALLBACK: testStart2
CALLBACK: module3 > before
CALLBACK: module1 > beforeEach
CALLBACK: module3 > beforeEach
TEST: module3 > test1
CALLBACK: log1
CALLBACK: log2
CALLBACK: module3 > afterEach
CALLBACK: module1 > afterEach
CALLBACK: module3 > after
CALLBACK: testDone1
CALLBACK: testDone2
CALLBACK: moduleDone1
CALLBACK: moduleDone2
CALLBACK: testStart1
CALLBACK: testStart2
CALLBACK: module1 > beforeEach
TEST: module1 > test2
CALLBACK: log1
CALLBACK: log2
CALLBACK: module1 > afterEach
CALLBACK: testDone1
CALLBACK: testDone2
CALLBACK: moduleStart1
CALLBACK: moduleStart2
CALLBACK: testStart1
CALLBACK: testStart2
CALLBACK: module4 > before
CALLBACK: module1 > beforeEach
CALLBACK: module4 > beforeEach
TEST: module4 > test1
CALLBACK: log1
CALLBACK: log2
CALLBACK: module4 > afterEach
CALLBACK: module1 > afterEach
CALLBACK: module4 > after
CALLBACK: module1 > after
CALLBACK: testDone1
CALLBACK: testDone2
CALLBACK: moduleDone1
CALLBACK: moduleDone2
CALLBACK: moduleDone1
CALLBACK: moduleDone2
CALLBACK: done1
CALLBACK: done2`;

    const command = ['qunit', 'callbacks.js'];
    const execution = await execute(command);

    assert.equal(execution.stderr, expected);
    assert.equal(execution.code, 0);
  });

  QUnit.test('callbacks with promises', async assert => {
    const expected = `CALLBACK: begin
CALLBACK: begin2
CALLBACK: moduleStart
CALLBACK: moduleStart
CALLBACK: testStart - test1
CALLBACK: testDone - test1
CALLBACK: moduleDone - module1 > nestedModule1
CALLBACK: testStart - test2
CALLBACK: testDone - test2
CALLBACK: moduleStart
CALLBACK: testStart - test3
CALLBACK: testDone - test3
CALLBACK: moduleDone - module1 > nestedModule2
CALLBACK: moduleDone - module1
CALLBACK: done`;

    const command = ['qunit', 'callbacks-promises.js'];
    const execution = await execute(command);

    assert.equal(execution.stderr, expected);
    assert.equal(execution.code, 0);
  });

  QUnit.test('global hooks order', async assert => {
    const expected = `
HOOK: A1 @ global beforeEach-1
HOOK: A1 @ global beforeEach-2
HOOK: A1 @ global afterEach-2
HOOK: A1 @ global afterEach-1
HOOK: B1 @ B before
HOOK: B1 @ global beforeEach-1
HOOK: B1 @ global beforeEach-2
HOOK: B1 @ B beforeEach
HOOK: B1 @ B afterEach
HOOK: B1 @ global afterEach-2
HOOK: B1 @ global afterEach-1
HOOK: B2 @ global beforeEach-1
HOOK: B2 @ global beforeEach-2
HOOK: B2 @ B beforeEach
HOOK: B2 @ B afterEach
HOOK: B2 @ global afterEach-2
HOOK: B2 @ global afterEach-1
HOOK: BC1 @ BC before
HOOK: BC1 @ global beforeEach-1
HOOK: BC1 @ global beforeEach-2
HOOK: BC1 @ B beforeEach
HOOK: BC1 @ BC beforeEach
HOOK: BC1 @ BC afterEach
HOOK: BC1 @ B afterEach
HOOK: BC1 @ global afterEach-2
HOOK: BC1 @ global afterEach-1
HOOK: BC2 @ global beforeEach-1
HOOK: BC2 @ global beforeEach-2
HOOK: BC2 @ B beforeEach
HOOK: BC2 @ BC beforeEach
HOOK: BC2 @ BC afterEach
HOOK: BC2 @ B afterEach
HOOK: BC2 @ global afterEach-2
HOOK: BC2 @ global afterEach-1
HOOK: BCD1 @ BCD before
HOOK: BCD1 @ global beforeEach-1
HOOK: BCD1 @ global beforeEach-2
HOOK: BCD1 @ B beforeEach
HOOK: BCD1 @ BC beforeEach
HOOK: BCD1 @ BCD beforeEach
HOOK: BCD1 @ BCD afterEach
HOOK: BCD1 @ BC afterEach
HOOK: BCD1 @ B afterEach
HOOK: BCD1 @ global afterEach-2
HOOK: BCD1 @ global afterEach-1
HOOK: BCD1 @ BCD after
HOOK: BCD1 @ BC after
HOOK: BCD1 @ B after`;

    const command = ['qunit', 'hooks-global-order.js'];
    const execution = await execute(command);

    assert.equal(execution.stderr, expected.trim());
    assert.equal(execution.code, 0);
  });

  QUnit.test('global hooks context', async assert => {
    const command = ['qunit', 'hooks-global-context.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  if (semver.gte(process.versions.node, '12.0.0')) {
    QUnit.test('run ESM test suite with import statement', async assert => {
      const command = ['qunit', '../../es2018/esm.mjs'];
      const execution = await execute(command);

      assert.equal(execution.code, 0);

      // Node 12 enabled ESM by default, without experimental flag,
      // but left the warning in stderr. The warning was removed in Node 14.
      // Don't bother checking stderr
      const stderr = semver.gte(process.versions.node, '14.0.0') ? execution.stderr : '';
      assert.equal(stderr, '');

      assert.equal(execution.stdout, getExpected(command));
    });
  }

  // https://nodejs.org/dist/v12.12.0/docs/api/cli.html#cli_enable_source_maps
  if (semver.gte(process.versions.node, '14.0.0')) {
    // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
    QUnit[skipOnWinTest]('normal trace with native source map', async assert => {
      const command = ['qunit', 'sourcemap/source.js'];
      try {
        await execute(command);
      } catch (e) {
        assert.equal(e.code, 1);
        assert.equal(e.stderr, '');
        assert.equal(e.stdout, getExpected(command));
      }
    });

    // skip if running in code coverage mode,
    // as that leads to conflicting maps-on-maps that invalidate this test
    //
    // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
    QUnit[process.env.NYC_PROCESS_ID ? 'skip' : skipOnWinTest](
      'mapped trace with native source map', async function (assert) {
        const command = ['qunit', 'sourcemap/source.min.js'];
        try {
          await execute(command, {
            env: { NODE_OPTIONS: '--enable-source-maps' }
          });
        } catch (e) {
          assert.equal(e.code, 1);
          assert.equal(e.stderr, '');
          assert.equal(e.stdout, getExpected(command));
        }
      });
  }

  QUnit.test('timeouts correctly recover', async assert => {
    const command = ['qunit', 'timeout'];
    try {
      await execute(command);
    } catch (e) {
      assert.equal(e.code, 1);
      assert.equal(e.stderr, '');
      assert.equal(e.stdout, getExpected(command));
    }
  });

  QUnit.test('allows running zero-assertion tests', async assert => {
    const command = ['qunit', 'zero-assertions.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  // https://nodejs.org/docs/v14.0.0/api/v8.html#v8_v8_getheapsnapshot
  // Created in Node 11.x, but starts working the way we need from Node 14.
  if (semver.gte(process.versions.node, '14.0.0')) {
    QUnit.test('callbacks and hooks from modules are properly released for garbage collection', async assert => {
      const command = ['node', '--expose-gc', '../../../bin/qunit.js', 'memory-leak/*.js'];
      const execution = await execute(command);

      assert.equal(execution.code, 0);
      assert.equal(execution.stderr, '');
      assert.equal(execution.stdout, getExpected(command));
    });

    QUnit.test('callbacks and hooks from filtered-out modules are properly released for garbage collection', async assert => {
      const command = ['node', '--expose-gc', '../../../bin/qunit.js', '--filter', '!child', 'memory-leak/*.js'];
      const execution = await execute(command);

      assert.equal(execution.code, 0);
      assert.equal(execution.stderr, '');
      assert.equal(execution.stdout, getExpected(command));
    });
  }

  QUnit.module('filter', () => {
    QUnit.test('can properly filter tests', async assert => {
      const command = ['qunit', '--filter', 'single', 'test', 'single.js', 'glob/**/*-test.js'];
      const equivalentCommand = ['qunit', 'single.js'];
      const execution = await execute(command);

      assert.equal(execution.code, 0);
      assert.equal(execution.stderr, '');
      assert.equal(execution.stdout, getExpected(equivalentCommand));
    });

    // TODO: Workaround fact that child_process.spawn() args array is a lie on Windows.
    // https://github.com/nodejs/node/issues/29532
    // Can't trivially quote since that breaks Linux which would interpret quotes
    // as literals.
    QUnit[skipOnWinTest]('exit code is 1 when no tests match filter', async assert => {
      const command = ['qunit', '--filter', 'no matches', 'test'];
      try {
        await execute(command);
      } catch (e) {
        assert.equal(e.code, 1);
        assert.equal(e.stderr, '');
        assert.equal(e.stdout, getExpected(command));
      }
    });
  });

  QUnit.module('require', () => {
    QUnit.test('can properly require dependencies and modules', async assert => {
      const command = ['qunit', 'single.js',
        '--require', 'require-dep',
        '--require', './node_modules/require-dep/module.js'
      ];
      const execution = await execute(command);

      assert.equal(execution.code, 0);
      assert.equal(execution.stderr, '');
      assert.equal(execution.stdout, getExpected(command));
    });

    QUnit.test('displays helpful error when failing to require a file', async assert => {
      const command = ['qunit', 'single.js', '--require', 'does-not-exist-at-all'];
      try {
        await execute(command);
      } catch (e) {
        assert.equal(e.code, 1);
        assert.true(e.stderr.includes("Error: Cannot find module 'does-not-exist-at-all'"));
        assert.equal(e.stdout, '');
      }
    });
  });

  QUnit.module('seed', () => {
    QUnit.test('can properly seed tests', async assert => {
      const command = ['qunit', '--seed', 's33d', 'test', 'single.js', 'glob/**/*-test.js'];
      const execution = await execute(command);

      assert.equal(execution.code, 0);
      assert.equal(execution.stderr, '');
      assert.equal(execution.stdout, getExpected(command));
    });
  });

  QUnit.module('notrycatch', () => {
    QUnit.test('errors if notrycatch is used and a rejection occurs', async assert => {
      try {
        await execute(['qunit', 'notrycatch/returns-rejection.js']);
      } catch (e) {
        assert.pushResult({

          // only in stdout due to using `console.log` in manual `unhandledRejection` handler
          result: e.stdout.includes('Unhandled Rejection: bad things happen sometimes'),
          actual: e.stdout + '\n' + e.stderr
        });
      }
    });

    QUnit.test('errors if notrycatch is used and a rejection occurs in a hook', async assert => {
      try {
        await execute(['qunit', 'notrycatch/returns-rejection-in-hook.js']);
      } catch (e) {
        assert.pushResult({

          // only in stdout due to using `console.log` in manual `unhandledRejection` handler
          result: e.stdout.includes('Unhandled Rejection: bad things happen sometimes'),
          actual: e.stdout + '\n' + e.stderr
        });
      }
    });
  });

  QUnit.test('config.filter (string)', async assert => {
    const command = ['qunit', 'config-filter-string.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('config.filter (regex)', async assert => {
    const command = ['qunit', 'config-filter-regex.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('config.filter (regex exclude)', async assert => {
    const command = ['qunit', 'config-filter-regex-exclude.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('config.module', async assert => {
    const command = ['qunit', 'config-module.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('config.moduleId', async assert => {
    const command = ['qunit', 'config-moduleId.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('config.testId', async assert => {
    const command = ['qunit', 'config-testId.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, '');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('config.testTimeout', async assert => {
    const command = ['qunit', 'config-testTimeout.js'];

    try {
      await execute(command);
    } catch (e) {
      assert.equal(e.code, 1);
      assert.equal(e.stderr, '');
      assert.equal(e.stdout, getExpected(command));
    }
  });

  QUnit.module('noglobals', () => {
    QUnit.test('add global variable', async assert => {
      try {
        await execute(['qunit', 'noglobals/add-global.js']);
      } catch (e) {
        assert.pushResult({
          result: e.stdout.includes('message: Introduced global variable(s): dummyGlobal'),
          actual: e.stdout + '\n' + e.stderr
        });
      }
    });

    QUnit.test('remove global variable', async assert => {
      try {
        await execute(['qunit', 'noglobals/remove-global.js']);
      } catch (e) {
        assert.pushResult({
          result: e.stdout.includes('message: Deleted global variable(s): dummyGlobal'),
          actual: e.stdout + '\n' + e.stderr
        });
      }
    });

    QUnit.test('forgive qunit DOM global variables', async assert => {
      const execution = await execute(['qunit', 'noglobals/ignored.js']);
      assert.equal(execution.code, 0);
      assert.equal(execution.stderr, '');
    });
  });

  QUnit.module('assert.async', () => {
    QUnit.test('call after tests timeout', async assert => {
      const command = ['qunit', 'done-after-timeout.js'];
      try {
        await execute(command);
      } catch (e) {
        assert.equal(e.code, 1);
        assert.equal(e.stdout, getExpected(command));
      }
    });

    // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
    QUnit[skipOnWinTest]('drooling call to callback across tests', async assert => {
      const command = ['qunit', 'drooling-done.js'];
      try {
        await execute(command);
      } catch (e) {
        assert.equal(e.code, 1);
        assert.equal(e.stdout, getExpected(command));
      }
    });

    // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
    QUnit[skipOnWinTest]('extra call to callback across tests', async assert => {
      const command = ['qunit', 'drooling-extra-done.js'];
      try {
        await execute(command);
      } catch (e) {
        assert.equal(e.code, 1);
        assert.equal(e.stdout, getExpected(command));
      }
    });

    QUnit.test('extra call to callback outside tests', async assert => {
      const command = ['qunit', 'drooling-extra-done-outside.js'];
      try {
        await execute(command);
      } catch (e) {
        assert.equal(e.code, 1);
        assert.equal(e.stdout, getExpected(command));
      }
    });

    // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
    QUnit[skipOnWinTest]('too many calls to callback', async assert => {
      const command = ['qunit', 'too-many-done-calls.js'];
      try {
        await execute(command);
      } catch (e) {
        assert.equal(e.code, 1);
        assert.equal(e.stdout, getExpected(command));
      }
    });
  });

  QUnit.module('only', () => {
    QUnit.test('test', async assert => {
      const command = ['qunit', 'only/test.js'];
      const execution = await execute(command);

      assert.equal(execution.code, 0);
      assert.equal(execution.stderr, '');
      assert.equal(execution.stdout, getExpected(command));
    });

    // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
    QUnit[skipOnWinTest]('nested modules', async assert => {
      const command = ['qunit', 'only/module.js'];
      const execution = await execute(command);

      assert.equal(execution.code, 0);
      assert.equal(execution.stderr, '');
      assert.equal(execution.stdout, getExpected(command));
    });

    QUnit.test('module followed by test', async assert => {
      const command = ['qunit', 'only/module-then-test.js'];
      const execution = await execute(command);

      assert.equal(execution.code, 0);
      assert.equal(execution.stderr, '');
      assert.equal(execution.stdout, getExpected(command));
    });

    // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
    QUnit[skipOnWinTest]('flat modules', async assert => {
      const command = ['qunit', 'only/module-flat.js'];
      const execution = await execute(command);

      assert.equal(execution.code, 0);
      assert.equal(execution.stderr, '');
      assert.equal(execution.stdout, getExpected(command));
    });
  });

  // Regression test for https://github.com/qunitjs/qunit/issues/1478
  QUnit.test('nested module scopes', async assert => {
    const command = ['qunit', 'module-nested.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('warns about incorrect hook usage', async assert => {
    const command = ['qunit', 'incorrect-hooks-warning/test.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, 'The `beforeEach` hook was called inside the wrong module (`module providing hooks > module not providing hooks`). Instead, use hooks provided by the callback to the containing module (`module providing hooks`). This will become an error in QUnit 3.0.', 'The warning shows');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('warns about unsupported async module callback', async assert => {
    const command = ['qunit', 'async-module-warning/test.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, 'Returning a promise from a module callback is not supported. Instead, use hooks for async behavior. This will become an error in QUnit 3.0.', 'The warning shows');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.test('warns about unsupported promise return value from module', async assert => {
    const command = ['qunit', 'async-module-warning/promise-test.js'];
    const execution = await execute(command);

    assert.equal(execution.code, 0);
    assert.equal(execution.stderr, 'Returning a promise from a module callback is not supported. Instead, use hooks for async behavior. This will become an error in QUnit 3.0.', 'The warning shows');
    assert.equal(execution.stdout, getExpected(command));
  });

  QUnit.module('assert.expect failing conditions', () => {
    QUnit.test('mismatched expected assertions', async assert => {
      const command = ['qunit', 'assert-expect/failing-expect.js'];
      try {
        const result = await execute(command);
        assert.pushResult({
          result: false,
          actual: result.stdout
        });
      } catch (e) {
        assert.equal(e.code, 1);
        assert.equal(e.stderr, '');

        // can't match exactly due to stack frames including internal line numbers
        assert.true(e.stdout.includes('message: Expected 2 assertions, but 1 were run'), e.stdout);
      }
    });

    QUnit.test('no assertions run - use expect(0)', async assert => {
      const command = ['qunit', 'assert-expect/no-assertions.js'];
      try {
        const result = await execute(command);
        assert.pushResult({
          result: true,
          actual: result.stdout
        });
      } catch (e) {
        assert.equal(e.code, 1);
        assert.equal(e.stderr, '');

        // can't match exactly due to stack frames including internal line numbers
        assert.true(e.stdout.includes('Expected at least one assertion, but none were run - call expect(0) to accept zero assertions.'), e.stdout);
      }
    });

    QUnit.test('requireExpects', async assert => {
      const command = ['qunit', 'assert-expect/require-expects.js'];
      try {
        const result = await execute(command);
        assert.pushResult({
          result: false,
          actual: result.stdout
        });
      } catch (e) {
        assert.equal(e.code, 1);
        assert.equal(e.stderr, '');
        assert.true(e.stdout.includes('message: Expected number of assertions to be defined, but expect() was not called.'), e.stdout);
      }
    });
  });
});
