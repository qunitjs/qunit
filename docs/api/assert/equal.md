---
layout: page-api
title: assert.equal()
excerpt: A non-strict comparison.
groups:
  - assert
redirect_from:
  - "/equal/"
  - "/equals/"
  - "/assert/equal/"
  - "/assert/equals/"
version_added: "1.0.0"
---

`equal( actual, expected, message = "" )`

A non-strict comparison of two values.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | Short description of the actual expression |

The `equal` assertion uses the simple comparison operator (`==`) to compare the actual and expected arguments. When they are equal, the assertion passes; otherwise, it fails. When it fails, both actual and expected values are displayed in the test result, in addition to a given message.

This method is similar to the `assertEquals()` method found in xUnit-style frameworks.

To explicitly test inequality, use [`assert.notEqual()`](./notEqual.md).

To test for strict equality, use [`assert.strictEqual()`](./strictEqual.md).

## Changelog

* Prior to QUnit 1.1, this method was known as `assert.equals`.<br>The alias was removed in QUnit 1.3.

## Examples

The simplest assertion example:

```js
QUnit.test('a test', function (assert) {
  assert.equal(1, '1', "String '1' and number 1 have the same value");
});
```

A slightly more thorough set of assertions:

```js
QUnit.test('equal test', function (assert) {
  assert.equal(0, 0, 'Zero, Zero; equal succeeds');
  assert.equal('', 0, 'Empty, Zero; equal succeeds');
  assert.equal('', '', 'Empty, Empty; equal succeeds');

  assert.equal('three', 3, 'Three, 3; equal fails');
  assert.equal(null, false, 'null, false; equal fails');
});
```
