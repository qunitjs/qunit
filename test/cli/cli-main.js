'use strict';

const expectedOutput = require('./fixtures/expected/tap-outputs');
const { execute, prettyPrintCommand, concurrentMapKeys } = require('./helpers/execute');
const semver = require('semver');

const skipOnWinTest = (process.platform === 'win32' ? 'skip' : 'test');

function getExpected (command) {
  return expectedOutput[prettyPrintCommand(command)];
}

const fixtureCases = {
  'load "tests" directory by default': ['qunit'],
  'load file not found': ['qunit', 'does-not-exist.js'],
  'load glob pattern': ['qunit', 'glob/**/*-test.js'],
  'load single file': ['qunit', 'single.js'],
  'load multiple files': ['qunit', 'single.js', 'double.js'],
  'load a directory': ['qunit', 'test'],
  'load mixture of file, directory, and glob': ['qunit', 'test', 'single.js', 'glob/**/*-test.js'],
  'load file with syntax error': ['qunit', 'syntax-error/test.js'],

  'no tests': ['qunit', 'no-tests'],
  'no tests and config.failOnZeroTests=false': ['qunit', 'assert-expect/no-tests.js'],

  'test with failing assertion': ['qunit', 'fail/failure.js'],
  'test that hangs': ['qunit', 'hanging-test'],
  'test with pending async after timeout': ['qunit', 'pending-async-after-timeout.js'],
  'two tests with one timeout': ['qunit', 'timeout'],
  'test with zero assertions': ['qunit', 'zero-assertions.js'],

  'unhandled rejection': ['qunit', 'unhandled-rejection.js'],
  'uncaught error after assert.async()': ['qunit', 'hard-error-in-test-with-no-async-handler.js'],
  'uncaught error in hook': ['qunit', 'hard-error-in-hook.js'],
  'uncaught error in "begin" callback': ['qunit', 'bad-callbacks/begin-throw.js'],
  'uncaught error in "done" callback': ['qunit', 'bad-callbacks/done-throw.js'],
  // FIXME: Details of moduleDone() error are swallowed
  'uncaught error in "moduleDone" callback"': ['qunit', 'bad-callbacks/moduleDone-throw.js'],
  // FIXME: Details of testStart() error are swallowed
  'uncaught error in "testStart" callback"': ['qunit', 'bad-callbacks/testStart-throw.js'],

  'QUnit.hooks context': ['qunit', 'hooks-global-context.js'],

  '--filter matches module': ['qunit', '--filter', 'single', 'test', 'single.js', 'glob/**/*-test.js'],
  '--module selects a module (case-insensitive)': ['qunit', '--module', 'seconD', 'test/'],
  '--require loads dependency and script': ['qunit', 'single.js', '--require', 'require-dep', '--require', './node_modules/require-dep/module.js'],
  '--seed value': ['qunit', '--seed', 's33d', 'test', 'single.js', 'glob/**/*-test.js'],

  'config.filter with a string': ['qunit', 'config-filter-string.js'],
  'config.filter with a regex': ['qunit', 'config-filter-regex.js'],
  'config.filter with inverted regex': ['qunit', 'config-filter-regex-exclude.js'],

  'config.module': ['qunit', 'config-module.js'],
  'config.moduleId': ['qunit', 'config-moduleId.js'],
  'config.testId': ['qunit', 'config-testId.js'],
  'config.testTimeout': ['qunit', 'config-testTimeout.js'],
  'config.noglobals and add a global': ['qunit', 'noglobals/add-global.js'],
  'config.noglobals and remove a global': ['qunit', 'noglobals/remove-global.js'],
  'config.noglobals and add ignored DOM global': ['qunit', 'noglobals/ignored.js'],

  'assert.async() handled after timeout': ['qunit', 'done-after-timeout.js'],
  'assert.async() handled outside test': ['qunit', 'drooling-extra-done-outside.js'],
  'assert.expect() different count': ['qunit', 'assert-expect/failing-expect.js'],
  'assert.expect() no assertions': ['qunit', 'assert-expect/no-assertions.js'],
  'assert.expect() missing and config.requireExpects=true': ['qunit', 'assert-expect/require-expects.js'],
  'test.only()': ['qunit', 'only/test.js'],
  'module.only() followed by test': ['qunit', 'only/module-then-test.js'],
  'module() nested with interrupted executeNow': ['qunit', 'module-nested.js'],
  'module() with async function': ['qunit', 'async-module-warning/test.js'],
  'module() with promise': ['qunit', 'async-module-warning/promise-test.js'],

  'hooks.beforeEach() during other module': ['qunit', 'incorrect-hooks-warning/test.js']
};

QUnit.module('CLI Main', () => {
  QUnit.test.each('fixtures',
    // Faster testing: Let the commands run in the background with concurrency,
    // and only await/assert the already-started command.
    concurrentMapKeys(fixtureCases, 0, (command) => execute(command)),
    async (assert, execution) => {
      const result = await execution;
      assert.equal(result.snapshot, getExpected(result.command));
    }
  );

  // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
  QUnit[skipOnWinTest]('report assert.throws() failures properly', async assert => {
    const command = ['qunit', 'fail/throws-match.js'];
    const execution = await execute(command);
    assert.equal(execution.snapshot, getExpected(command));
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

  if (semver.gte(process.versions.node, '12.0.0')) {
    QUnit.test('run ESM test suite with import statement', async assert => {
      const command = ['qunit', '../../es2018/esm.mjs'];
      const execution = await execute(command);

      // Node 12 enabled ESM by default, without experimental flag,
      // but left the warning in stderr. The warning was removed in Node 14.
      // Don't bother checking stderr
      const stderr = semver.gte(process.versions.node, '14.0.0') ? execution.stderr : '';
      assert.equal(execution.code, 0);
      assert.equal(stderr, '');
      assert.equal(execution.stdout, getExpected(command));
    });
  }

  // https://nodejs.org/dist/v12.12.0/docs/api/cli.html#cli_enable_source_maps
  if (semver.gte(process.versions.node, '14.0.0')) {
    // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
    QUnit[skipOnWinTest]('normal trace with native source map', async assert => {
      const command = ['qunit', 'sourcemap/source.js'];
      const execution = await execute(command);

      assert.equal(execution.snapshot, getExpected(command));
    });

    // skip if running in code coverage mode,
    // as that leads to conflicting maps-on-maps that invalidate this test
    //
    // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
    QUnit[process.env.NYC_PROCESS_ID ? 'skip' : skipOnWinTest](
      'mapped trace with native source map', async function (assert) {
        const command = ['qunit', 'sourcemap/source.min.js'];
        const execution = await execute(command, {
          env: { NODE_OPTIONS: '--enable-source-maps' }
        });

        assert.equal(execution.snapshot, getExpected(command));
      });
  }

  // https://nodejs.org/docs/v14.0.0/api/v8.html#v8_v8_getheapsnapshot
  // Created in Node 11.x, but starts working the way we need from Node 14.
  if (semver.gte(process.versions.node, '14.0.0')) {
    QUnit.test('memory-leak/module-closure [unfiltered]', async assert => {
      const command = ['node', '--expose-gc', '../../../bin/qunit.js', 'memory-leak/module-closure.js'];
      const execution = await execute(command);
      assert.equal(execution.snapshot, getExpected(command));
    });

    QUnit.test('memory-leak/module-closure [filtered module]', async assert => {
      const command = ['node', '--expose-gc', '../../../bin/qunit.js', '--filter', '!child', 'memory-leak/module-closure.js'];
      const execution = await execute(command);
      assert.equal(execution.snapshot, getExpected(command));
    });

    QUnit.test('memory-leak/test-object', async assert => {
      const command = ['node', '--expose-gc', '../../../bin/qunit.js', 'memory-leak/test-object.js'];
      const execution = await execute(command);
      assert.equal(execution.snapshot, getExpected(command));
    });
  }

  // TODO: Workaround fact that child_process.spawn() args array is a lie on Windows.
  // https://github.com/nodejs/node/issues/29532
  // Can't trivially quote since that breaks Linux which would interpret quotes
  // as literals.
  QUnit[skipOnWinTest]('--filter matches nothing', async assert => {
    const command = ['qunit', '--filter', 'no matches', 'test'];
    const execution = await execute(command);

    assert.equal(execution.snapshot, getExpected(command));
  });

  QUnit.test('--require loads unknown module', async assert => {
    const command = ['qunit', 'single.js', '--require', 'does-not-exist-at-all'];
    const execution = await execute(command);
    // TODO: Change to a generic tap-outputs.js
    // https://github.com/qunitjs/qunit/issues/1688
    assert.equal(execution.code, 1);
    assert.true(execution.stderr.includes("Error: Cannot find module 'does-not-exist-at-all'"));
    assert.equal(execution.stdout, '');
  });

  QUnit.test('config.notrycatch with rejected test', async assert => {
    const command = ['qunit', 'notrycatch/returns-rejection.js'];
    const execution = await execute(command);

    assert.pushResult({
      // only in stdout due to using `console.log` in manual `unhandledRejection` handler
      result: execution.stdout.includes('Unhandled Rejection: bad things happen sometimes'),
      actual: execution.stdout + '\n' + execution.stderr
    });
  });

  QUnit.test('config.notrycatch with rejected hook', async assert => {
    const command = ['qunit', 'notrycatch/returns-rejection-in-hook.js'];
    const execution = await execute(command);

    assert.pushResult({
      // only in stdout due to using `console.log` in manual `unhandledRejection` handler
      result: execution.stdout.includes('Unhandled Rejection: bad things happen sometimes'),
      actual: execution.stdout + '\n' + execution.stderr
    });
  });

  // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
  QUnit[skipOnWinTest]('assert.async() handled after fail in other test', async assert => {
    const command = ['qunit', 'drooling-done.js'];
    const execution = await execute(command);

    assert.equal(execution.snapshot, getExpected(command));
  });

  // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
  QUnit[skipOnWinTest]('assert.async() handled again in other test', async assert => {
    const command = ['qunit', 'drooling-extra-done.js'];
    const execution = await execute(command);

    assert.equal(execution.snapshot, getExpected(command));
  });

  // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
  QUnit[skipOnWinTest]('assert.async() handled too often', async assert => {
    const command = ['qunit', 'too-many-done-calls.js'];
    const execution = await execute(command);

    assert.equal(execution.snapshot, getExpected(command));
  });

  // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
  QUnit[skipOnWinTest]('module.only() nested', async assert => {
    const command = ['qunit', 'only/module.js'];
    const execution = await execute(command);

    assert.equal(execution.snapshot, getExpected(command));
  });

  // TODO: Figure out why trace isn't trimmed on Windows. https://github.com/qunitjs/qunit/issues/1359
  QUnit[skipOnWinTest]('module.only() flat', async assert => {
    const command = ['qunit', 'only/module-flat.js'];
    const execution = await execute(command);

    assert.equal(execution.snapshot, getExpected(command));
  });
});
