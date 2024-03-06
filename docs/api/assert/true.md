---
layout: page-api
title: assert.true()
excerpt: A strict boolean true comparison.
groups:
  - assert
redirect_from:
  - "/assert/true/"
version_added: "2.11.0"
---

`true( actual, message = "" )`

A strict comparison that passes if the first argument is boolean `true`.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `message` (string) | Short description of the actual expression |

`true()` requires just one argument. If the argument evaluates to true, the assertion passes; otherwise, it fails.

This method is similar to the `assertTrue()` method found in xUnit-style frameworks.

[`assert.false()`](./false.md) can be used to explicitly test for a false value.

## Examples

```js
QUnit.test('example', assert => {
  // success
  assert.true(true, 'boolean true');

  // failure
  assert.true('foo', 'non-empty string');
  assert.true('', 'empty string');
  assert.true(0, 'number zero');
  assert.true(false, 'boolean false');
  assert.true(NaN, 'NaN value');
  assert.true(null, 'null value');
  assert.true(undefined, 'undefined value');
});
```

