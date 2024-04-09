QUnit.test('contains a hard error after using assert.async()', assert => {
  assert.async();
  assert.true(true);
  throw new Error('expected error thrown in test');

  // the "done" callback from `assert.async` should be called later,
  // but the hard-error prevents the test from reaching that
});
