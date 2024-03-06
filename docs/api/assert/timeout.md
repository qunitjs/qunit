---
layout: page-api
title: assert.timeout()
excerpt: How long to wait for async operations.
groups:
  - assert
  - async
redirect_from:
  - "/assert/timeout/"
version_added: "2.4.0"
---

`timeout( duration )`

Set how long to wait for async operations to finish.

| name | description |
|------|-------------|
| `duration` (number) | The length of time to wait, in milliseconds. |

This assertion defines how long to wait (at most) in the current test. It overrides [`QUnit.config.testTimeout`](../config/testTimeout.md) on a per-test basis.

The timeout length only applies when a test actually involves asynchronous functions or promises. If `0` is passed, then awaiting or returning any Promise may fail the test.

If `assert.timeout()` is called after a different timeout is already set, the old timeout will be cleared and the new duration will be used to start a new timer.

## Examples

```js
QUnit.test('wait for an event', assert => {
  assert.timeout(1000); // Timeout after 1 second
  const done = assert.async();

  const adder = new NumberAdder();
  adder.on('ready', res => {
    assert.strictEqual(res, 12);
    done();
  });
  adder.run([ 1, 1, 2, 3, 5 ]);
});
```

```js
QUnit.test('wait for an async function', async assert => {
  assert.timeout(500); // Timeout after 0.5 seconds

  const result = await asyncAdder(5, 7);
  assert.strictEqual(result, 12);
});
```

Using classic ES5 syntax:

```js
QUnit.test('wait for a returned promise', function (assert) {
  assert.timeout(500); // Timeout after 0.5 seconds

  var promise = asyncAdder(5, 7);

  return promise.then(function (result) {
    assert.strictEqual(result, 12);
  });
});
```
