'use strict';

const path = require('path');
const { Module } = require('module');

/**
 * Depending on the exact usage, QUnit could be in one of several places, this
 * function handles finding it.
 */
module.exports = function requireQUnit (resolve = require.resolve) {
  try {
    // For:
    //
    // - QUnit is installed as local dependency and invoked normally
    //   within the current project, e.g. via `npm test`, `npm run …`,
    //   or `node_modules/.bin/qunit`.
    //   The below will lead to the same package directory that
    //   the CLI command belonged to.
    //
    // - QUnit is installed both as local dependency in the current project,
    //   and also globally installed via npm by the end-user.
    //   If the user (accidentally) ran the CLI command from their global
    //   install, then we prefer to stil use the qunit library file from the
    //   current project's dependency.
    //
    // NOTE: We can't use require.resolve() because, despite it taking a 'paths'
    // option, the resolution algorithm [1] is poisoned by current filename (i.e.
    // this src/cli/require-qunit.js file). The documentation doesn't say it,
    // but in practice the "paths" option only overrides how step 6 (LOAD_NODE_MODULES)
    // traverses directories. It does not influence step 5 (LOAD_PACKAGE_SELF) which
    // looks explicilty relative to the current file (regardless of `process.cwd`,
    // and regardless of `paths` passed to require.resolve). This wasn't an issue
    // until QUnit 3.0 because LOAD_PACKAGE_SELF only looks for cases where
    // package.json uses "exports", which QUnit 3.0 adopted for ESM support.
    //
    // If this uses `requires.resolve(, paths:[cwd])` instead of
    // `Module.createRequire(cwd).resolve()`, then this would always return
    // the 'qunit' copy that this /src/cli/require-qunit.js file came from,
    // regardless of the process.cwd(), which defeats the purpose of looking
    // relative to process.cwd().
    //
    // This is covered by /test/cli/require-qunit-test.js
    //
    // [1]: https://nodejs.org/docs/latest-v18.x/api/modules.html#all-together
    const localQUnitPath = Module.createRequire(
      path.join(process.cwd(), 'fake.js')
    ).resolve('qunit');

    delete require.cache[localQUnitPath];
    return require(localQUnitPath);
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      // For:
      //
      // - QUnit is installed globally via npm by the end-user, and the
      //   the user ran this global CLI command in a project directory that
      //   does not have a qunit dependency installed.
      //   Use the library file relative to the global CLI command in that case.
      //
      // - We are running a local command from within the source directory
      //   of the QUnit project itself (e.g. qunit Git repository).
      //   Use the library file relative to this command, within the source directory.
      //   If you get "Error: Cannot find module ../../qunit/qunit", it probably
      //   means you haven't yet run "npm run build".
      //
      delete require.cache[resolve('../../qunit/qunit.js')];
      return require('../../qunit/qunit.js');
    }

    throw e;
  }
};
