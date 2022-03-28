import sum from './sum.mjs';

QUnit.module('ESM test suite', () => {
  QUnit.test('sum()', assert => {
    assert.equal(5, sum(2, 3));
  });
});
