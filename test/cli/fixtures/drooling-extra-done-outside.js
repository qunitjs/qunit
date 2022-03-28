QUnit.test('extra done scheduled outside any test', assert => {
  assert.timeout(10);
  const done = assert.async();
  assert.true(true);

  // Later, boom!
  setTimeout(done, 100);

  // Passing, end of test
  done();
});
