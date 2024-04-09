const NPMReporter = require('npm-reporter');

const findReporter = require('../../src/cli/find-reporter').findReporter;

const { execute } = require('./helpers/execute');

QUnit.module('find-reporter', function () {
  QUnit.test('tap reporter is bundled', function (assert) {
    assert.strictEqual(typeof QUnit.reporters.tap, 'function');
  });

  QUnit.test('find console reporter', function (assert) {
    const reporter = findReporter('console', QUnit.reporters);
    assert.strictEqual(reporter, QUnit.reporters.console);
  });

  QUnit.test('find tap reporter', function (assert) {
    const reporter = findReporter('tap', QUnit.reporters);
    assert.strictEqual(reporter, QUnit.reporters.tap);
  });

  QUnit.test('default to tap reporter', function (assert) {
    const reporter = findReporter(undefined, QUnit.reporters);
    assert.strictEqual(reporter, QUnit.reporters.tap);
  });

  QUnit.test('find extra reporter package', function (assert) {
    const reporter = findReporter('npm-reporter', QUnit.reporters);
    assert.strictEqual(reporter, NPMReporter);
  });
});

QUnit.module('CLI Reporter', function () {
  QUnit.test('runs tests using the specified reporter', async function (assert) {
    const command = ['qunit', '--reporter', 'npm-reporter'];
    const execution = await execute(command);

    assert.equal(execution.snapshot, 'Run ended!');
  });

  QUnit.test('exits early and lists available reporters if reporter is not found', async function (assert) {
    const command = ['qunit', '--reporter', 'does-not-exist'];
    const execution = await execute(command);

    assert.equal(execution.snapshot, `# stderr
No reporter found matching "does-not-exist".
Built-in reporters: console, tap
Extra reporters found among package dependencies: npm-reporter

# exit code: 1`);
  });

  QUnit.test('exits early and lists available reporters if reporter option is used with no value', async function (assert) {
    const command = ['qunit', '--reporter'];
    const execution = await execute(command);

    assert.equal(execution.snapshot, `# stderr
Built-in reporters: console, tap
Extra reporters found among package dependencies: npm-reporter

# exit code: 1`);
  });
});
