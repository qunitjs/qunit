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
`QUnit.test.todo.each( name, dataset, callback )`<br>
`QUnit.test.skip.each( name, dataset, callback )`<br>
`QUnit.test.if.each( name, condition, dataset, callback )`

Add tests using a data provider.

| parameter | description |
|-----------|-------------|
| `name` (string) | Title of unit being tested |
| `dataset` (array or object) | Array or object of data items passed to each test case |
| `callback` (function) | Function that performs the test |

### Callback parameters

| parameter | description |
|-----------|-------------|
| `assert` (object) | A new instance object with the [assertion methods](../assert/index.md) |
| `data` (any) | Data item |

Use this method to add multiple tests that are similar, but with different data passed in.

`QUnit.test.each()` generates multiple calls to [`QUnit.test()`](./test.md) internally, and has all the same capabilities such support for async functions, returning a Promise, and the `assert` argument.

Each test case is passed one item from your dataset.

The [`only`](./test.only.md), [`todo`](./test.todo.md), [`skip`](./test.skip.md), and [`if`](./test.if.md) variants are also available, as `QUnit.test.only.each`, `QUnit.test.todo.each`, `QUnit.test.skip.each`, and `QUnit.test.if.each` respectively.

## Changelog

| [QUnit 2.23.0](https://github.com/qunitjs/qunit/releases/tag/2.23.0) | Add [automatic labels](https://github.com/qunitjs/qunit/issues/1733) for primitive values in arrays.
| [QUnit 2.16.0](https://github.com/qunitjs/qunit/releases/tag/2.16.0) | Introduce `QUnit.test.each()`.

## Examples

### Data provider

Each item in the dataset is passed to the callback. In the case of an array holding basic primitives (string, number, boolean, null, or undefined) these receive an automatic label, based on the string representation of the value.

When using an array data provider with complex values, the array index in the dataset is added to the test name.

You can also use an object instead of an array, to give each item a descriptive label, including for nested arrays, objects, and other complex values.

```js
// isReserved [Admin]
// isReserved [root]
// isReserved [ADMIN]
QUnit.test.each('isReserved', ['Admin', 'root', 'ADMIN'], function (assert, name) {
  assert.true(isReserved(name));
});

// isReserved [Alice]
// isReserved [Bob]
QUnit.test.each('isReserved', ['Alice', 'Bob'], function (assert, name) {
  assert.false(isReserved(name));
});

function isReserved (name) {
  return ['root', 'admin'].includes(name.toLowerCase());
}

// truthy [0: true]
// truthy [1: 42]
// truthy [2: Infinity]
QUnit.test.each('truthy', [true, 42, Infinity], function (assert, data) {
  assert.true(Boolean(data));
});

// falsy [0: false]
// falsy [1: null]
QUnit.test.each('falsy', [false, null], function (assert, data) {
  assert.false(Boolean(data));
});
```

### Array data provider

Each item is passed to the callback These can be primitive values as demonstrated above. But they can also be nested arrays. With [JavaScript array destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment), you can also unpack the array and give multiple values their own variable names.

For example, you can let each test case provide both an `input` and an `expected` value via an array.

```js
function square (x) {
  return x * x;
}

// square [0]
// square [1]
QUnit.test.each('square', [
  [2, 4],
  [3, 9]
], function (assert, data) {
  assert.equal(square(data[0]), data[1]);
});

// With array destructuring
QUnit.test.each('square', [
  [2, 4],
  [3, 9]
], function (assert, [input, expected]) {
  assert.equal(square(input), expected);
});

// With array destructuring and arrow functions
QUnit.test.each('square', [
  [2, 4],
  [3, 9]
], (assert, [input, expected]) => {
  assert.equal(square(input), expected);
});
```

### Object data provider

You can give each item in your data set a custom name, by wrapping the data in an object instead of an array. The object key becomes the test case name.

For example, you can self-document each item to more cleary convey what aspect or behavior you want to cover with that test.

```js
function square (x) {
  return x * x;
}

// square [even]
// square [odd]
// square [fraction]
QUnit.test.each('square', {
  even: [2, 4],
  odd: [3, 9],
  fraction: [3.14, 9.8596]
}, function (assert, [input, expected]) {
  assert.equal(square(input), expected);
});

// isReserved [title case]
// isReserved [lower case]
// isReserved [all caps]
QUnit.test.each('isReserved', {
  'title case': 'Admin',
  'lower case': 'root',
  'all caps': 'ADMIN'
}, function (assert, name) {
  assert.true(isReserved(name));
});

function isReserved (name) {
  return ['root', 'admin'].includes(name.toLowerCase());
}
```

### Async functions with `each()`

```js
function isEven (x) {
  return x % 2 === 0;
}

async function isAsyncEven (x) {
  return isEven(x);
}

QUnit.test.each('isAsyncEven', [2, 4], async (assert, data) => {
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

QUnit.test.each('isAsyncEven', [2, 4], function (assert, data) {
  return isAsyncEven(data).then(function (result) {
    assert.true(result, data + ' is even');
  });
});
```
