QUnit.config.requireExpects = true;

QUnit.test('passing [once]', function (assert) {
  assert.expect(3);

  assert.step('a');
  assert.step('b');
  assert.verifySteps(['a', 'b']);
});

QUnit.test('passing [twice]', function (assert) {
  assert.expect(7);

  assert.step('a');
  assert.step('b');
  assert.verifySteps(['a', 'b']);

  assert.step('c');
  assert.step('d');
  assert.step('e');
  assert.verifySteps(['c', 'd', 'e']);
});
