'use strict';

const path = require('path');

const { execute, executeRaw, concurrentMapKeys } = require('./helpers/execute.js');
const { readFixtures } = require('./helpers/fixtures.js');

const FIXTURES_DIR = path.join(__dirname, 'fixtures');
const isWindows = (process.platform === 'win32');

QUnit.module('CLI Main', () => {
  QUnit.test.each('fixtures',
    // Faster testing: Let the commands run in the background with concurrency,
    // and only await/assert the already-started command.
    concurrentMapKeys(readFixtures(FIXTURES_DIR), 0, (runFixture) => runFixture()),
    async (assert, fixture) => {
      assert.timeout(10000);
      const result = await fixture;
      assert.equal(result.snapshot, result.expected, result.name);
    }
  );

  QUnit.test('preconfig-flat', async assert => {
    const command = ['qunit', 'preconfig-flat.js'];
    const execution = await execute(command, {
      env: {
        qunit_config_filter: '!foobar',
        qunit_config_seed: 'dummyfirstyes',
        qunit_config_testtimeout: '7',

        qunit_config_altertitle: 'true',
        qunit_config_noglobals: '1',
        qunit_config_notrycatch: 'false'
      }
    });
    assert.equal(execution.snapshot, `TAP version 13
ok 1 dummy
not ok 2 slow
  ---
  message: Test took longer than 7ms; test timed out.
  severity: failed
  actual  : null
  expected: undefined
  stack: |
        at internal
  ...
ok 3 config
1..3
# pass 2
# skip 0
# todo 0
# fail 1

# exit code: 1`);
  });

  // TODO: Move to /test/cli/fixtures/
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

  // Skip in code coverage mode, conflicting maps-on-maps change result
  QUnit.test.if('trace with native source map', !process.env.NYC_PROCESS_ID, async function (assert) {
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

  // TODO: Move to /test/cli/fixtures/
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

  QUnit.test.if('tap pipe [pass]', !isWindows, async assert => {
    const command = 'qunit basic-one.js | ../../../node_modules/.bin/tap-min';
    const execution = await executeRaw(command);
    assert.equal(execution.snapshot.trim(), '1 test complete (1ms)');
  });

  QUnit.test.if('tap pipe [fail]', !isWindows, async assert => {
    const command = 'qunit basic-fail.js | ../../../node_modules/.bin/tap-min';
    const execution = await executeRaw(command);
    assert.equal(execution.snapshot.trim(), `bar
\tat:       undefined
\toperator: undefined
\texpected: true
\tactual:   false

at /qunit/test/cli/fixtures/basic-fail.js:5:14



3 tests complete (1ms)

# exit code: 1`);
  });

  QUnit.test.if('tap pipe [error]', !isWindows, async assert => {
    assert.timeout(10000);
    const command = 'qunit syntax-error.js | ../../../node_modules/.bin/tap-min';
    const execution = await executeRaw(command);
    assert.equal(execution.snapshot.trim(), `global failure
\tat:       undefined
\toperator: undefined
\texpected: undefined
\tactual:   undefined

ReferenceError: varIsNotDefined is not defined
    at /qunit/test/cli/fixtures/syntax-error.js:1:1
    at internal



1 test complete (1ms)

# exit code: 1`);
  });

  // TODO: Workaround fact that child_process.spawn() args array is a lie on Windows.
  // https://github.com/nodejs/node/issues/29532
  // Can't trivially quote since that breaks Linux which would interpret quotes
  // as literals.
  QUnit.test.if('--filter matches nothing', !isWindows, async assert => {
    const command = ['qunit', '--filter', 'no matches', 'test'];
    const execution = await execute(command);

    assert.equal(execution.snapshot, `TAP version 13
not ok 1 global failure
  ---
  message: "Error: No tests matched the filter \\"no matches\\"."
  severity: failed
  stack: |
    Error: No tests matched the filter "no matches".
  ...
Bail out! Error: No tests matched the filter "no matches".
1..1
# pass 0
# skip 0
# todo 0
# fail 1

# exit code: 1`);
  });

  QUnit.test('--seed generates new random seed', async assert => {
    // https://github.com/qunitjs/qunit/issues/1691
    const command = ['qunit', '--seed', '--', 'basic-one.js', 'test/'];
    const execution = await execute(command);

    const actualHarness = execution.snapshot
      .replace(/^(Running tests with seed: )([a-z0-9]{10,20})/g, (_m, m1) => {
        return m1 + '0000000000';
      })
      .split('\n')
      .filter(line => !line.startsWith('ok '))
      .join('\n');

    const actualResults = execution.snapshot
      .replace(/^ok \d/gm, 'ok 0')
      .split('\n')
      .filter(line => line.startsWith('ok '))
      .sort()
      .join('\n');

    assert.equal(actualHarness, `Running tests with seed: 0000000000
TAP version 13
1..3
# pass 3
# skip 0
# todo 0
# fail 0`);

    assert.equal(actualResults, `ok 0 First > 1
ok 0 Second > 1
ok 0 Single > has a test`);
  });

  QUnit.test('--require loads unknown module', async assert => {
    const command = ['qunit', 'basic-one.js', '--require', 'does-not-exist-at-all'];
    const execution = await execute(command);
    // TODO: Change to a generic .tap.txt fixture
    // https://github.com/qunitjs/qunit/issues/1688
    assert.equal(execution.code, 1);
    assert.true(execution.stderr.includes("Error: Cannot find module 'does-not-exist-at-all'"));
    assert.equal(execution.stdout, '');
  });
});
