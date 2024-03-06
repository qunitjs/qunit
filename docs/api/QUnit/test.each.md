---
layout: page-api
title: QUnit.test.each()
excerpt: Add tests using a data provider.
groups:
  - main
redirect_from:
  - "/QUnit/test.each/"
version_added: "2.16.0"
---

`QUnit.test.each( name, dataset, callback )`<br>
`QUnit.test.only.each( name, dataset, callback )`<br>
`QUnit.test.skip.each( name, dataset, callback )`<br>
`QUnit.test.todo.each( name, dataset, callback )`

Add tests using a data provider.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `dataset` (array or object) | Array or object of data values passed to each test case |
| `callback` (function) | Function that performs the test |

### Callback parameters

| parameter | description |
|-----------|-------------|
| `assert` (object) | A new instance object with the [assertion methods](../assert/index.md) |
| `data` (any) | Data value |

Use this method to add multiple tests that are similar, but with different data passed in.

`QUnit.test.each()` generates multiple calls to [`QUnit.test()`](./test.md) internally, and has all the same capabilities such support for async functions, returning a Promise, and the `assert` argument.

Each test case is passed one value of your dataset.

The [`only`](./test.only.md), [`skip`](./test.skip.md), and [`todo`](./test.todo.md) variants are also available, as `QUnit.test.only.each`, `QUnit.test.skip.each`, and `QUnit.test.todo.each` respectively.

## Examples

### Basic data provider

```js
function isEven (x) {
  return x % 2 === 0;
}

QUnit.test.each('isEven()', [2, 4, 6], (assert, data) => {
  assert.true(isEven(data), `${data} is even`);
});
```

### Array data provider

The original array is passed to your callback. [Array destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) can be used to unpack the data array, directly from the callback signature.


```js
function square (x) {
  return x * x;
}

QUnit.test.each('square()', [
  [2, 4],
  [3, 9]
], (assert, [value, expected]) => {
  assert.equal(square(value), expected, `${value} squared`);
});
```

### Object data provider

```js
QUnit.test.each('isEven()', {
  caseEven: [2, true],
  caseNotEven: [3, false]
}, (assert, [value, expected]) => {
  assert.strictEqual(isEven(value), expected);
});
```

### Async functions with `each()`

```js
function isEven (x) {
  return x % 2 === 0;
}

async function isAsyncEven (x) {
  return isEven(x);
}

QUnit.test.each('isAsyncEven()', [2, 4], async (assert, data) => {
  assert.true(await isAsyncEven(data), `${data} is even`);
});
```

Or in classic ES5 syntax, by returning a Promise from each callback:

```js
function isEven (x) {
  return x % 2 === 0;
}

function isAsyncEven (x) {
  return Promise.resolve(isEven(x));
}

QUnit.test.each('isAsyncEven()', [2, 4], function (assert, data) {
  return isAsyncEven(data).then(function (result) {
    assert.true(result, data + ' is even');
  });
});
```
