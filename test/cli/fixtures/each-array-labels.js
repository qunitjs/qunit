// Automatic labels for test.each() array data where possible
// https://github.com/qunitjs/qunit/issues/1733

QUnit.test.each('array of arrays', [[1, 2, 3], [1, 1, 2]], function (assert, _data) {
  assert.true(true);
});

QUnit.test.each('array of simple strings', [
  'foo',
  'x'.repeat(40),
  '$',
  'http://example.org',
  ' ',
  ''
], function (assert, _data) {
  assert.true(true);
});

QUnit.test.each('array of mixed', [
  undefined,
  null,
  false,
  true,
  0,
  1,
  -10,
  10 / 3,
  10e42,
  Infinity,
  NaN,
  [],
  {},
  '999: example',
  'simple string',
  '\b',
  '\n',
  'y'.repeat(100)
], function (assert, _value) {
  assert.true(true);
});

QUnit.test.each('keyed objects', { caseFoo: [1, 2, 3], caseBar: [1, 1, 2] }, function (assert, _data) {
  assert.true(true);
});
