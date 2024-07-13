QUnit.test('passing [once]', function (assert) {
  assert.expect(1);

  assert.step('a');
  assert.step('b');
  assert.verifySteps(['a', 'b']);
});

QUnit.test('passing [twice]', function (assert) {
  assert.expect(2);

  assert.step('a');
  assert.step('b');
  assert.verifySteps(['a', 'b']);

  assert.step('c');
  assert.step('d');
  assert.step('e');
  assert.verifySteps(['c', 'd', 'e']);
});

QUnit.test('wrong [a little off]', function (assert) {
  assert.expect(2);

  assert.step('a');
  assert.step('b');
  assert.verifySteps(['a', 'b']);
});

QUnit.test('wrong [way off]', function (assert) {
  assert.expect(5);

  assert.step('a');
  assert.step('b');
  assert.verifySteps(['a', 'b']);
});

// These were the correct counts in QUnit 2.x
// https://github.com/qunitjs/qunit/issues/1226
QUnit.test('previously passing [once]', function (assert) {
  assert.expect(4);

  assert.step('a');
  assert.step('b');
  assert.verifySteps(['a', 'b']);
  assert.true(true);
});

QUnit.test('previously passing [twice]', function (assert) {
  assert.expect(9);

  assert.step('a');
  assert.true(true);
  assert.step('b');
  assert.verifySteps(['a', 'b']);

  assert.false(false);
  assert.step('c');
  assert.step('d');
  assert.step('e');
  assert.verifySteps(['c', 'd', 'e']);
});
