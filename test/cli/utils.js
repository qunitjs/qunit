const { getIgnoreList } = require('../../src/cli/utils');
const { normalize } = require('./helpers/execute');

QUnit.module('getIgnoreList', function () {
  QUnit.test('reads .gitignore', function (assert) {
    const ignoreList = getIgnoreList('test/cli/fixtures');
    assert.deepEqual(ignoreList, ['/abcd', '/efgh']);
  });
});

QUnit.module('execute', function () {
  QUnit.test('normalize strips append-transform', function (assert) {
    assert.equal(
      normalize(`
  at Object.<anonymous> (/qunit/temp/foo.js:3)
  at internal
  at Module.replacementCompile (/qunit/node_modules/append-transform/index.js:60:13)
  at internal
  at Object.<anonymous> (/qunit/node_modules/append-transform/index.js:64:4)
  at internal`
      ),
      `
  at Object.<anonymous> (/qunit/temp/foo.js:3)
  at internal`
    );
  });
});
