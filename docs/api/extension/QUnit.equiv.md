---
layout: page-api
title: QUnit.equiv
excerpt: Test any two types of JavaScript values for equality.
groups:
  - extension
redirect_from:
  - "/extension/QUnit.equiv/"
version_added: "1.0.0"
---

`QUnit.equiv( a, b )`

Test any two types of JavaScript values for equality.

| name | description |
|------|-------------|
| `a` | First value to compare |
| `b` | Second value to compare |

This is a recursive and strict comparison. For primitive values, a strict comparison is performed. For objects, the object identity is disregarded and instead a recursive comparison of all own and inherited properties is used. This means arrays, plain objects, and arbitrary class instance objects can all be compared in this way.

This utility is what powers [`assert.deepEqual()`](../assert/deepEqual.md).

Supported types include:

* Primitive values, including `NaN`.
* Boxed primitives (e.g. `new Number()`), which compare equal to their primitive counterpart.
* Arrays, compared element by element in order.
* Plain objects, compared by constructor and by property names and values.
* Arbitrary class instances, which are equivalent only if they share the same constructor.
* `Date` objects, compared by their timestamp.
* `RegExp` objects, compared by `source` and flags.
* ES6 `Map` and `Set` objects, compared in an unordered fashion. Repetitions are not counted.
* Circular references are handled via recursion detection.

Functions compare equal only by reference identity.

## Multiple arguments

When called with more than two arguments, the values are compared in adjacent pairs from right to left. For example, `QUnit.equiv( a, b, c, d )` returns true if `c` and `d` are equivalent, and `b` and `c` are equivalent, and `a` and `b` are equivalent.

When called with zero or one argument, there is nothing to compare and the result is `true`.

## Changelog

| [QUnit 1.0.0](https://github.com/qunitjs/qunit/releases/tag/1.0.0) | Introduced.
