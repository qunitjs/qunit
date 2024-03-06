---
layout: page-api
title: assert.ok()
excerpt: Check if the first argument is truthy.
groups:
  - assert
redirect_from:
  - "/assert/ok/"
  - "/ok/"
version_added: "1.0.0"
---

`ok( state, message = "" )`

A boolean check that passes when the first argument is truthy.

| name | description |
|------|-------------|
| `state` | Expression being tested |
| `message` (string) | Short description |

This assertion requires only one argument. If the argument evaluates to true, the assertion passes; otherwise, it fails.

To strictly compare against boolean true, use [`assert.true()`](./true.md).

For the inverse of `ok()`, refer to [`assert.notOk()`](./notOk.md)

## Examples

```js
QUnit.test('example', assert => {
  // success
  assert.ok(true, 'boolean true');
  assert.ok('foo', 'non-empty string');
  assert.ok(1, 'number one');

  // failure
  assert.ok(false, 'boolean false');
  assert.ok('', 'empty string');
  assert.ok(0, 'number zero');
  assert.ok(NaN, 'NaN value');
  assert.ok(null, 'null value');
  assert.ok(undefined, 'undefined value');
});
```
