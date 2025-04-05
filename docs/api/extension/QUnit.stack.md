---
layout: page-api
title: QUnit.stack()
excerpt: Generate a stacktrace from the current line.
groups:
  - extension
redirect_from:
  - "/config/QUnit.stack/"
  - "/extension/QUnit.stack/"
version_added: "1.19.0"
---

`QUnit.stack( offset = 0 )`

Generate a stacktrace or (call stack) from the current line.

| name | description |
|------|-------------|
| `offset` (number) | How many function calls to skip over. Defaults to `0` |

QUnit automatically hides its own internal stack from the end of the stacktrace, so the bottom of the stack starts at the user's [`QUnit.test()`](../QUnit/test.md) function.

When called directly in a test function, `QUnit.stack()` neatly returns a single line only, representing the location of the currently executing line of code in the test function.

If called indirectly by your own helper functions, it is recommended to use the `offset` argument to also exclude most (or all) of your own source code from the top of the stack. That way, it points developers directly at where we are in the test function.

In environments where [support for Error.stack][mdn] is lacking, `QUnit.stack()` will return `undefined`.

[mdn]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack#browser_compatibility

## Example

The stacktrace line can be used on custom assertions and reporters.

```js
function addHelper (a, b) {
  console.log(QUnit.stack());
  // fooHelper@
  // foo@
  // @example.test.js:18 (example A)

  console.log(QUnit.stack(2));
  // @example.test.js:18 (example A)

  return a + b;
}

function add (a, b) {
  return addHelper(a, b);
}

QUnit.test('example A', function (assert) {
  assert.equal(add(2, 3), 5);
});

QUnit.test('example B', function (assert) {
  assert.true(true);

  console.log(QUnit.stack());
  // @example.test.js:24 (example B)
});
```
