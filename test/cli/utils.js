const path = require('path');

const { getIgnoreList } = require('../../src/cli/utils');
const { normalize, concurrentMap, concurrentMapKeys } = require('./helpers/execute');

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
  at internal
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
  at internal
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
  at internal
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
  at internal
...`,
      'strip frames for node_modules/append-transform'
    );
  });

  QUnit.test.each('concurrentMap()', {
    'concurrency=1': [1, [
      'prepare',
      'start A',
      'init',
      'finish A',
      'start B',
      'finish B',
      'start C',
      'finish C',
      'start D',
      'finish D',
      'start E',
      'finish E',
      'start F',
      'finish F'
    ]],
    'concurrency=2': [2, [
      'prepare',
      'start A',
      'start B',
      'init',
      'finish A',
      'finish B',
      'start C',
      'start D',
      'finish C',
      'finish D',
      'start E',
      'start F',
      'finish E',
      'finish F'
    ]],
    'concurrency=3': [3, [
      'prepare',
      'start A',
      'start B',
      'start C',
      'init',
      'finish A',
      'finish B',
      'finish C',
      'start D',
      'start E',
      'start F',
      'finish D',
      'finish E',
      'finish F'
    ]]
  }, async function (assert, [concurrency, expected]) {
    const steps = [];

    steps.push('prepare');

    const stream = concurrentMap(
      ['A', 'B', 'C', 'D', 'E', 'F'],
      concurrency,
      async function (val) {
        steps.push(`start ${val}`);
        await Promise.resolve();
        steps.push(`finish ${val}`);
        return val;
      }
    );

    steps.push('init');

    const end = stream.length - 1;
    await stream[end];

    assert.deepEqual(steps, expected);
  });

  function waitMicroTicks (count) {
    let prom = Promise.resolve();
    for (let i = 1; i < count; i++) {
      prom = prom.then(() => {
        return new Promise(resolve => {
          setImmediate(resolve);
        });
      });
    }
    return prom;
  }

  QUnit.test('concurrentMapKeys()', async function (assert) {
    let actual = [];
    let running = 0;

    const stream = concurrentMapKeys({
      one: 10,
      two: 5,
      three: 7,
      four: 1,
      five: 29,
      six: 15,
      seven: 17,
      eight: 8,
      nine: 9
    }, 4, async function (int) {
      running++;
      actual.push(running);
      await waitMicroTicks(int);
      running--;
      return 1000 + int;
    });

    assert.strictEqual(await stream.one, 1010);
    assert.strictEqual(await stream.seven, 1017);
    assert.strictEqual(await stream.nine, 1009);
    assert.deepEqual(actual, [
      // ramp up
      1,
      2,
      3,
      // keep up
      4,
      4,
      4,
      4,
      4,
      // no more remaining
      4
    ]);
  });
});
