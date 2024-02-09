// Regression test for https://github.com/qunitjs/qunit/issues/1705
QUnit.test('example', async assert => {
  assert.timeout(10);
  // eslint-disable-next-line no-unused-vars
  const done = assert.async();
  assert.true(true);
});
