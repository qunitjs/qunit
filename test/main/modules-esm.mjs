import sum from '../dynamic-import/sum.mjs';

QUnit.module('modules [esm]', () => {
  QUnit.test('example', assert => {
    assert.equal(5, sum(2, 3));
  });
});
