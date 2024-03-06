---
layout: page-api
title: assert.false()
excerpt: A strict boolean false comparison.
groups:
  - assert
redirect_from:
  - "/assert/false/"
version_added: "2.11.0"
---

`false( actual, message = "" )`

A strict comparison that passes if the first argument is boolean `false`.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `message` (string) | Short description |

`false` requires just one argument. If the argument evaluates to false, the assertion passes; otherwise, it fails.

This method is similar to the `assertFalse()` method found in xUnit-style frameworks.

[`assert.true()`](./true.md) can be used to explicitly test for a true value.

## Examples

```js
QUnit.test('example', assert => {
  // success
  assert.false(false, 'boolean false');

  // failure
  assert.false('foo', 'non-empty string');
  assert.false('', 'empty string');
  assert.false(0, 'number zero');
  assert.false(true, 'boolean true');
  assert.false(NaN, 'NaN value');
  assert.false(null, 'null value');
  assert.false(undefined, 'undefined value');
});
```
