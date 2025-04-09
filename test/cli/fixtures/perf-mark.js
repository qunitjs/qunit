/* eslint-env browser */

QUnit.config.reorder = false;

QUnit.test('foo', function (assert) {
  assert.true(true);
});

QUnit.test('bar', function (assert) {
  assert.true(true);
});

QUnit.test('getEntries', function (assert) {
  const entries = performance.getEntriesByType('measure')
    .filter(function (entry) {
      return entry.name.indexOf('QUnit') === 0;
    })
    .map(function (entry) {
      return entry.toJSON();
    });

  assert.propContains(entries, [
    { name: 'QUnit Test: foo' },
    { name: 'QUnit Test: bar' }
  ]);
});
