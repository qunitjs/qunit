'use strict';

const path = require('path');

const semver = require('semver');

const { execute, concurrentMapKeys } = require('./helpers/execute.js');
const { readFixtures } = require('./helpers/fixtures.js');

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const skipOnWinTest = (process.platform === 'win32' ? 'skip' : 'test');

QUnit.module('CLI Main', () => {
  QUnit.test.each('fixtures',
    // Faster testing: Let the commands run in the background with concurrency,
    // and only await/assert the already-started command.
    concurrentMapKeys(readFixtures(FIXTURES_DIR), 0, (runFixture) => runFixture()),
    async (assert, fixture) => {
      const result = await fixture;
      assert.equal(result.snapshot, result.expected, result.name);
    }
  );

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
      assert.equal(execution.stdout, `TAP version 13
ok 1 ESM test suite > sum()
1..1
# pass 1
# skip 0
# todo 0
# fail 0`);
    });
  }

  // https://nodejs.org/dist/v12.12.0/docs/api/cli.html#cli_enable_source_maps
  if (semver.gte(process.versions.node, '14.0.0')) {
    QUnit.test('normal trace with native source map', async assert => {
      const command = ['qunit', 'sourcemap/source.js'];
      const execution = await execute(command);

      assert.equal(execution.snapshot, `TAP version 13
ok 1 Example > good
not ok 2 Example > bad
  ---
  message: failed
  severity: failed
  actual  : false
  expected: true
  stack: |
        at /qunit/test/cli/fixtures/sourcemap/source.js:7:16
  ...
1..2
# pass 1
# skip 0
# todo 0
# fail 1

# exit code: 1`);
    });

    // skip if running in code coverage mode,
    // as that leads to conflicting maps-on-maps that invalidate this test
    QUnit[process.env.NYC_PROCESS_ID ? 'skip' : 'test'](
      'mapped trace with native source map', async function (assert) {
        const command = ['qunit', 'sourcemap/source.min.js'];
        const execution = await execute(command, {
          env: { NODE_OPTIONS: '--enable-source-maps' }
        });

        assert.equal(execution.snapshot, `TAP version 13
ok 1 Example > good
not ok 2 Example > bad
  ---
  message: failed
  severity: failed
  actual  : false
  expected: true
  stack: |
        at /qunit/test/cli/fixtures/sourcemap/sourcemap/source.js:7:10
  ...
1..2
# pass 1
# skip 0
# todo 0
# fail 1

# exit code: 1`);
      });
  }

  // https://nodejs.org/docs/v14.0.0/api/v8.html#v8_v8_getheapsnapshot
  // Created in Node 11.x, but starts working the way we need from Node 14.
  if (semver.gte(process.versions.node, '14.0.0')) {
    QUnit.test('memory-leak/module-closure [unfiltered]', async assert => {
      const command = ['node', '--expose-gc', '../../../bin/qunit.js', 'memory-leak/module-closure.js'];
      const execution = await execute(command);
      assert.equal(execution.snapshot, `TAP version 13
ok 1 module-closure > example test
ok 2 module-closure > example child module > example child module test
ok 3 module-closure check > memory release
1..3
# pass 3
# skip 0
# todo 0
# fail 0`);
    });

    QUnit.test('memory-leak/module-closure [filtered module]', async assert => {
      const command = ['node', '--expose-gc', '../../../bin/qunit.js', '--filter', '!child', 'memory-leak/module-closure.js'];
      const execution = await execute(command);
      assert.equal(execution.snapshot, `TAP version 13
ok 1 module-closure > example test
ok 2 module-closure check > memory release
1..2
# pass 2
# skip 0
# todo 0
# fail 0`);
    });

    QUnit.test('memory-leak/test-object', async assert => {
      const command = ['node', '--expose-gc', '../../../bin/qunit.js', 'memory-leak/test-object.js'];
      const execution = await execute(command);
      assert.equal(execution.snapshot, `TAP version 13
ok 1 test-object > example test
1..1
# pass 1
# skip 0
# todo 0
# fail 0`);
    });
  }

  // TODO: Workaround fact that child_process.spawn() args array is a lie on Windows.
  // https://github.com/nodejs/node/issues/29532
  // Can't trivially quote since that breaks Linux which would interpret quotes
  // as literals.
  QUnit[skipOnWinTest]('--filter matches nothing', async assert => {
    const command = ['qunit', '--filter', 'no matches', 'test'];
    const execution = await execute(command);

    assert.equal(execution.snapshot, `TAP version 13
not ok 1 global failure
  ---
  message: "No tests matched the filter \\"no matches\\"."
  severity: failed
  actual  : undefined
  expected: undefined
  stack: |
    Error: No tests matched the filter "no matches".
        at qunit.js
        at internal
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`);
  });

  QUnit.test('--require loads unknown module', async assert => {
    const command = ['qunit', 'basic-one.js', '--require', 'does-not-exist-at-all'];
    const execution = await execute(command);
    // TODO: Change to a generic tap-outputs.js
    // https://github.com/qunitjs/qunit/issues/1688
    assert.equal(execution.code, 1);
    assert.true(execution.stderr.includes("Error: Cannot find module 'does-not-exist-at-all'"));
    assert.equal(execution.stdout, '');
  });

  QUnit.test('config.notrycatch with rejected test', async assert => {
    const command = ['qunit', 'config-notrycatch-test-rejection.js'];
    const execution = await execute(command);

    assert.pushResult({
      // only in stdout due to using `console.log` in manual `unhandledRejection` handler
      result: execution.stdout.includes('Unhandled Rejection: bad things happen sometimes'),
      actual: execution.stdout + '\n' + execution.stderr
    });
  });

  QUnit.test('config.notrycatch with rejected hook', async assert => {
    const command = ['qunit', 'config-notrycatch-hook-rejection.js'];
    const execution = await execute(command);

    assert.pushResult({
      // only in stdout due to using `console.log` in manual `unhandledRejection` handler
      result: execution.stdout.includes('Unhandled Rejection: bad things happen sometimes'),
      actual: execution.stdout + '\n' + execution.stderr
    });
  });
});
