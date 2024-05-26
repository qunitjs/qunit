QUnit.test('fast async', function (assert) {
  var done = assert.async();
  assert.true(true);
  setTimeout(done, 7);
});

QUnit.test('slow async 1', function (assert) {
  var done = assert.async();
  assert.true(true);
  setTimeout(done, 3500);
});

QUnit.test('slow async 2', function (assert) {
  var done = assert.async();
  assert.true(true);
  setTimeout(done, 3500);
});
