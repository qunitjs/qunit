QUnit.config.reorder = false;

let done;

QUnit.test('Test A', assert => {
  assert.ok(true);
  done = assert.async();

  // Passing.
  done();
});

QUnit.test('Test B', assert => {
  assert.ok(true);

  // Boom
  done();
});
