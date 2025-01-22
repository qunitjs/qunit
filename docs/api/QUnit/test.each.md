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
`QUnit.test.todo.each( name, dataset, callback )`<br>
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

Use this method to define many similar tests, with different data passed in.

`QUnit.test.each()` generates multiple calls to [`QUnit.test()`](./test.md), and provides the same features, such as support for async functions and test context.

Each test case is passed one item from your dataset.

The [`only`](./test.only.md), [`skip`](./test.skip.md), [`todo`](./test.todo.md), and [`if`](./test.if.md) variants are also available, as `QUnit.test.only.each`, `QUnit.test.skip.each`, `QUnit.test.todo.each`, and `QUnit.test.if.each` respectively.

### Reduce code duplication

You can use `QUnit.test.each()` to write a single test, run once for each item in a dataset. This avoids code duplication and prevents unintentional drift over time between similar tests.

This tends to cut unintentional, unimportant, or undocumented differences. That in turn improves readability and comprehension to future contributors. When multiple tests do similar things, there can be _intentional_ and _unintentional_ differences. The intentional difference is motivated by what you want to cover (e.g. input A and input B). The _unintentional_ difference may be due to authors having their own coding style, or changing habits over time. As a contributor it can be confusing when your patch causes tests to fail. These unintentional differences make it difficult to judge if a test is "safe" to change. For example, if test A fails but B passes, and A would pass if it was written more like B, is A okay to change because it was only that way by accident? Or was this an intended alternative approach covered by that test?

By writing your tests with `QUnit.test.each()`, you write shared code only once. Any intentional differences are clearly visible through a declarative dataset. By writing it only once, it also encourages writing of code comments as you won’t have to duplicate and maintain these across multiple tests.

```js
// Without QUnit.test.each()

QUnit.test('example', function (assert) {
  const mockPage1 = {
    title: 'Example',
    lastModified: '2011-04-01T12:00:00Z',
    content: 'Foo bar.'
  };
  const mockUser1 = {
    name: 'Admin',
    registered: '1991-10-18T12:00:00Z',
    role: 'administrator'
  };
  APP.appendToPage(mockPage1, mockUser1, 'Added text here.');
  assert.equal(mockPage1.content, 'Foo bar.\n\nAdded text here.');

  const mockUser2 = {
    name: 'root',
    registered: '1963-06-09T03:00:00Z',
    role: 'administrator'
  };
  const mockPage2 = {
    title: 'Example',
    lastModified: '2011-04-01T12:00:00Z',
    content: ''
  };
  APP.appendToPage(mockPage2, mockUser2, 'Added text here.');
  assert.equal(mockPage2.content, 'Added text here.');
});
```

Compared to:

```js
QUnit.test.each('example', {
  // Expect an empty line between existing content and appendage.
  'existing content': ['Foo.', 'Added text.', 'Foo.\n\nAdded text.'],

  // No extra lines if the page started empty.
  'empty content': ['', 'Added text here.', 'Added text here.']

}, function (assert, [input, appendage, expected]) {
  const mockPage = {
    title: 'Example',
    lastModified: '2011-04-01T12:00:00Z',
    content: input
  };
  const mockUser = {
    name: 'Admin',
    registered: '1991-10-18T12:00:00Z',
    // Roles are always lowercase
    role: 'administrator'
  };
  APP.appendToPage(mockPage, mockUser, appendage);

  assert.equal(mockPage.content, expected);
});
```

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
