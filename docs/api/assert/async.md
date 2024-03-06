---
layout: page-api
title: assert.async()
excerpt: Instruct QUnit to wait for an asynchronous operation.
groups:
  - assert
  - async
redirect_from:
  - "/assert/async/"
  - "/QUnit.stop/"
  - "/QUnit/stop/"
  - "/stop/"
version_added: "1.16.0"
---

`async( count = 1 )`

Instruct QUnit to wait for an asynchronous operation.

| name | description |
|------|-------------|
| `count` (number) | Number of expected calls. Defaults to `1`. |

`assert.async()` returns a callback function and pauses test processing until the callback function is called. The callback will throw an `Error` if it is invoked more often than the required call count.

## See also

* [Migration guide](../../upgrade-guide-2.x.md#introducing-assertasync) from QUnit 1.x `stop()` and `start()`.

## Examples

### Wait for callback

Tell QUnit to wait for the `done()` call from a callback.

```js
function fetchDouble (num, callback) {
  const double = num * 2;
  callback(double);
}

QUnit.test('async example', assert => {
  const done = assert.async();

  fetchDouble(21, res => {
    assert.strictEqual(res, 42, 'Result');
    done();
  });
});
```
### Wait for multiple callbacks

Call `assert.async()` multiple times to wait for multiple async operations. Each `done` callback must be called exactly once for the test to pass.

```js
QUnit.test('two async calls', assert => {
  const done1 = assert.async();
  const done2 = assert.async();

  fetchDouble(3, res => {
    assert.strictEqual(res, 6, 'double of 3');
    done1();
  });
  fetchDouble(9, res => {
    assert.strictEqual(res, 18, 'double of 9');
    done2();
  });
});
```

### Require multiple calls

The `count` parameter can be used to require multiple calls to the same callback. In the below example, the test passes after exactly three calls.

```js
function uploadBatch (batch, notify, complete) {
  batch.forEach((item) => {
    // Do something with item
    notify();
  });
  complete(null);
}

QUnit.test('multiple calls example', assert => {
  assert.timeout(1000);

  const notify = assert.async(3);
  const done = assert.async();

  uploadBatch(
    ['a', 'b', 'c'],
    notify,
    (err) => {
      assert.strictEqual(err, null, 'complete error parameter');

      done();
    }
  );
});
```
