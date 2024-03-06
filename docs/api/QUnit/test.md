---
layout: page-api
title: QUnit.test()
excerpt: Define a test.
groups:
  - main
  - async
redirect_from:
  - "/QUnit.asyncTest/"
  - "/QUnit.test/"
  - "/QUnit/test/"
  - "/asyncTest/"
  - "/test/"
version_added: "1.0.0"
---

`QUnit.test( name, callback )`

Define a test using `QUnit.test()`.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `callback` (function) | Function that performs the test |

### Callback parameters

| parameter | description |
|-----------|-------------|
| `assert` (object) | An [Assert](../assert/index.md) object |

The `assert` argument to the callback contains all of QUnit's [assertion methods](../assert/index.md). Use this to make your test assertions.

`QUnit.test()` can automatically handle the asynchronous resolution of a Promise on your behalf if you return a "then-able" Promise as the result of your callback function.

See also:
* [`QUnit.test.only()`](./test.only.md)
* [`QUnit.test.skip()`](./test.skip.md)
* [`QUnit.test.todo()`](./test.todo.md)

## Changelog

| [QUnit 1.16](https://github.com/qunitjs/qunit/releases/tag/1.16.0) | Added support for async functions, and returning of a Promise.

## Examples

### Example: Standard test

A practical example, using the assert argument.

```js
function square (x) {
  return x * x;
}

QUnit.test('square()', assert => {
  assert.equal(square(2), 4);
  assert.equal(square(3), 9);
});
```

### Example: Async test

Following the example above, `QUnit.test` also supports JS [async functions][] syntax out of the box.

[async functions]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function

```js
QUnit.test('Test with async-await', async assert => {
  const a = await fetchSquare(2);
  const b = await fetchSquare(3);

  assert.equal(a, 4);
  assert.equal(b, 9);
  assert.equal(await fetchSquare(5), 25);
});
```


### Example: Test with Promise

In ES5 and older environments, you can also return a [Promise] from your standard test function. This also supports other then-able, values such as `jQuery.Deferred`, and Bluebird Promise.

This example returns a Promise that is resolved after waiting for 1 second.

[Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

```js
function fetchSquare (x) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(x * x);
    }, 1000);
  });
}

QUnit.test('Test with Promise', function (assert) {
  return fetchSquare(3).then(function (result) {
    assert.equal(result, 9);
  });
});
```
