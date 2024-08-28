const fs = require('fs');
const os = require('os');
const path = require('path');

const proxyquire = require('proxyquire').noCallThru();

function resolveStub (path) {
  return path;
}

QUnit.module('requireQUnit', function (hooks) {
  const cwd = process.cwd();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'qunit-test-'));

  hooks.before(() => {
    process.chdir(cwd);
  });
  hooks.afterEach(() => {
    process.chdir(cwd);
    fs.rmSync(tmpDir, { force: true, recursive: true });
  });

  QUnit.test('find local qunit in the current working directory', function (assert) {
    // We can't use a fixture inside the project directory (e.g. /test/cli/fixtures)
    // because Node.js will always find 'qunit' from inside our own package, no
    // matter what paths you pass to require.resolve() or even Module.createRequire(),
    // it will always look for LOAD_PACKAGE_SELF first [1], and return from there if
    // it has "exports" set in package.json.
    //
    // [1]: https://nodejs.org/docs/latest-v18.x/api/modules.html#all-together from inside the a  inside a project that uses "exports" in package.json
    //
    // create:
    // - tmpDir/
    // - tmpDir/node_modules/
    // - tmpDir/node_modules/qunit/
    // - tmpDir/node_modules/qunit/index.js
    fs.mkdirSync(
      path.join(tmpDir, 'node_modules', 'qunit'),
      { recursive: true }
    );
    fs.writeFileSync(
      path.join(tmpDir, 'node_modules', 'qunit', 'index.js'),
      'module.exports = { version: "from-cwd" };'
    );
    const requireQUnit = require('../../src/cli/require-qunit.js');

    process.chdir(tmpDir);

    assert.strictEqual(requireQUnit().version, 'from-cwd');
  });

  // For development mode invoked locally,
  // or for global install without local dependency installed.
  QUnit.test('find relative self', function (assert) {
    const fakeQUnit = {
      version: 'from-fake'
    };
    const requireQUnit = proxyquire('../../src/cli/require-qunit.js', {
      qunit: null,
      '../../qunit/qunit': fakeQUnit
    });
    assert.strictEqual(requireQUnit(resolveStub).version, 'from-fake');
  });

  QUnit.test('throw if none found', function (assert) {
    const requireQUnit = proxyquire('../../src/cli/require-qunit.js', {
      qunit: null,
      '../../qunit/qunit': null
    });

    assert.throws(requireQUnit, /Cannot find module/);
  });
});
