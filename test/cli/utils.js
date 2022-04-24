const path = require('path');

const { getIgnoreList } = require('../../src/cli/utils');
const { normalize } = require('./helpers/execute');

QUnit.module('CLI utils', function () {
  QUnit.test('getIgnoreList()', function (assert) {
    const ignoreList = getIgnoreList('test/cli/fixtures');
    assert.deepEqual(ignoreList, ['/abcd', '/efgh']);
  });

  QUnit.test('normalize()', function (assert) {
    const projectdir = path.join(__dirname, '..', '..');

    assert.equal(
      normalize(`
  at done (${projectdir}/qunit/qunit.js:2639:17)
  at advanceTestQueue (${projectdir}/qunit/qunit.js:2542:7)
  at Object.advance (${projectdir}/qunit/qunit.js:2495:7)
  at unblockAndAdvanceQueue (${projectdir}/qunit/qunit.js:4547:21)
  at processTicksAndRejections (internal/process/task_queues.js:97:5)
...`
      ),
      `
  at qunit.js
...`,
      'normalize projectdir, qunit.js, and nodejs internal'
    );

    assert.equal(
      normalize(`
  at run (${projectdir}/src/cli/run.js:84:9)
  at Object.<anonymous> (/example/temp/foo.js:3)
  at Object.<anonymous> (${projectdir}/bin/qunit.js:57:3)
...`
      ),
      `
  at internal
  at Object.<anonymous> (/example/temp/foo.js:3)
...`,
      'normalize bin/qunit.js and src/cli'
    );

    assert.equal(
      normalize(`
  at Object.<anonymous> (${projectdir}/test/cli/fixtures/syntax-error/test.js:1:1)
  at Module._compile (internal/modules/cjs/loader.js:999:30)
  at Object.Module._extensions..js (internal/modules/cjs/loader.js:1027:10)
  at Module.load (internal/modules/cjs/loader.js:863:32)
  at Function.Module._load (internal/modules/cjs/loader.js:708:14)
  at Module.require (internal/modules/cjs/loader.js:887:19)
  at require (internal/modules/cjs/helpers.js:74:18)
  at run (${projectdir}/src/cli/run.js:84:9)
  at Object.<anonymous> (${projectdir}/bin/qunit.js:57:3)
  at Module._compile (internal/modules/cjs/loader.js:999:30)
...`
      ),
      `
  at /qunit/test/cli/fixtures/syntax-error/test.js:1:1
...`,
      'flatten successive internal frames'
    );

    assert.equal(
      normalize(`
  at Object.<anonymous> (/example/temp/foo.js:3)
  at internal
  at Module.replacementCompile (/example/node_modules/append-transform/index.js:60:13)
  at internal
  at Object.<anonymous> (/example/node_modules/append-transform/index.js:64:4)
  at internal
...`
      ),
      `
  at Object.<anonymous> (/example/temp/foo.js:3)
...`,
      'strip frames for node_modules/append-transform'
    );
  });
});
