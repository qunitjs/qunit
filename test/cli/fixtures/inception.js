const outerQUnit = globalThis.QUnit;
delete globalThis.QUnit;
const myQUnit = require('../../../src/cli/require-qunit')();
globalThis.QUnit = outerQUnit;

const data = [];
myQUnit.on('runStart', function () {
  data.push('runStart');
});
myQUnit.on('testEnd', function () {
  data.push('testEnd');
});
myQUnit.on('runEnd', function () {
  data.push('runEnd');
});

myQUnit.module('example', function () {
  myQUnit.test('a', function (assert) {
    assert.true(true, 'message');
  });
});

const myQunitRun = new Promise(resolve => {
  myQUnit.on('runEnd', resolve);
});

myQUnit.start();

QUnit.test('inception', async function (assert) {
  await myQunitRun;

  assert.deepEqual(data, [
    'runStart',
    'testEnd',
    'runEnd'
  ]);
});
