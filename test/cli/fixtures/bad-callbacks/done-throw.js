QUnit.done(() => {
  throw new Error('No dice');
});

QUnit.module('module1', () => {
  QUnit.test('test1', assert => {
    assert.true(true);
  });
});
