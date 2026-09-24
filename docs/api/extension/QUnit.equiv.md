---
layout: page-api
title: QUnit.equiv()
excerpt: Compare two values for deep equality.
groups:
  - extension
redirect_from:
  - "/extension/QUnit.equiv/"
version_added: "1.0.0"
---

`QUnit.equiv( a, b )`

Compare two JavaScript values for deep equality.

| name | description |
|------|-------------|
| `a` | First value |
| `b` | Second value |

Returns `true` when the values are considered equivalent, otherwise `false`.

This is the comparison used by [`assert.deepEqual()`](../assert/deepEqual.md), [`assert.propEqual()`](../assert/propEqual.md), and related assertions. Use it directly when writing custom assertions, helpers, or reporters that need the same deep-equality rules without recording an assertion result.

For primitive values, comparison is strict (`===`), with special cases for `NaN` (equal to itself) and boxed primitives (for example `1` is equivalent to `new Number(1)`). For objects, identity is disregarded and own plus inherited properties are compared recursively. Built-in support includes `Date`, `RegExp`, `Symbol`, `Set`, and `Map`.

When more than two arguments are passed, values are compared pairwise from right to left (for example `QUnit.equiv(a, b, c)` checks `b` vs `c`, then `a` vs `b`). With fewer than two arguments, the result is `true`.

## Examples

```js
QUnit.test('custom assertion using QUnit.equiv', function (assert) {
  function assertSameShape (actual, expected, message) {
    assert.pushResult({
      result: QUnit.equiv(actual, expected),
      actual: actual,
      expected: expected,
      message: message
    });
  }

  assertSameShape(
    { name: 'Alice', tags: new Set(['a', 'b']) },
    { name: 'Alice', tags: new Set(['b', 'a']) },
    'sets are unordered'
  );
});
```

```js
// Standalone use outside an assertion
QUnit.equiv({ x: 1 }, { x: 1 }); // true
QUnit.equiv([1, 2], [1, 2]); // true
QUnit.equiv(new Date('2020-01-01'), new Date('2020-01-01')); // true
QUnit.equiv(NaN, NaN); // true
QUnit.equiv(0, false); // false
```
