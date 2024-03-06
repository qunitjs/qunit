---
layout: page-api
title: assert.expect()
excerpt: Specify how many assertions are expected in a test.
groups:
  - assert
redirect_from:
  - "/assert/expect/"
  - "/expect/"
version_added: "1.0.0"
---

`expect( amount )`

Specify how many assertions are expected in a test.

| name | description |
|------|-------------|
| `amount` | Number of expected assertions in this test |

This is most commonly used as `assert.expect(0)`, which indicates that a test may pass without making any assertions. This means the test is only used to verify that the code runs to completion, without any uncaught errors. This is is essentially the inverse of [`assert.throws()`](./throws.md).

This can also be used to explicitly require a certain number of assertions to be recorded in a given test. If afterwards the number of assertions does not match the expected count, the test will fail.

It is recommended to test asynchronous code with [`assert.step()`](./step.md) or [`assert.async()`](./async.md) instead.

## Examples

### Example: No assertions

A test without any assertions:

```js
QUnit.test('example', function (assert) {
  assert.expect(0);

  var android = new Robot();
  android.up(2);
  android.down(2);
  android.left();
  android.right();
  android.left();
  android.right();
  android.attack();
  android.jump();
});
```

### Example: Custom assert

If you use a generic assertion library that throws when an expectation is not met, you can use `assert.expect(0)` if there are no other assertions needed in the test.

```js
QUnit.test('example', function (assert) {
  assert.expect(0);

  var android = new Robot(database);
  android.run();

  database.assertNoOpenConnections();
});
```

### Example: Explicit count

Require an explicit assertion count.

```js
QUnit.test('example', function (assert) {
  assert.expect(2);

  function calc (x, operation) {
    return operation(x);
  }

  let result = calc(2, function (x) {
    assert.true(true, 'calc() calls operation function');
    return x * x;
  });

  assert.strictEqual(result, 4, '2 squared equals 4');
});
```
