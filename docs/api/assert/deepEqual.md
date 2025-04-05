---
layout: page-api
title: assert.deepEqual()
excerpt: A recursive and strict comparison.
groups:
  - assert
redirect_from:
  - "/assert/deepEqual/"
  - "/deepEqual/"
version_added: "1.0.0"
---

`deepEqual( actual, expected, message = "" )`

A recursive and strict comparison, considering all own and inherited properties.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | Short description of the actual expression |

This assertion compares the full objects as passed. For primitive values, a strict comparison is performed. For objects, the object identity is disregarded and instead a recursive comparison of all own and inherited properties is used. This means arrays, plain objects, and arbitrary class instance objects can all be compared in this way.

The deep comparison includes built-in support for Date objects, regular expressions (RegExp), NaN, as well as ES6 features such as Symbol, Set, and Map objects.

To assert strict equality on own properties only, refer to [`assert.propEqual()`](./propEqual.md) instead.

[`assert.notDeepEqual()`](./notDeepEqual.md) can be used to check for inequality instead.

## Changelog

| [QUnit 1.2.0](https://github.com/qunitjs/qunit/releases/tag/1.2.0) | Objects with null prototypes can now be tested via object literals.

## Examples

```js
function makeComplexObject (name, extra, country) {
  const children = new Set();
  children.add('Alice');
  children.add(extra);
  const countryToCapital = { UK: 'London' };
  return {
    name: name,
    children: children,
    location: {
      country: country,
      nearestCapital: countryToCapital[country]
    }
  };
}

QUnit.test('object example', function (assert) {
  const result = makeComplexObject('Marty', 'Bob', 'UK');

  // Succeeds!
  // While each object is distinct by strict equality (identity),
  // every property, array, object, etc has equal values.
  assert.deepEqual(result, {
    name: 'Marty',
    children: new Set(['Alice', 'Bob']),
    location: { country: 'UK', nearestCapital: 'London' }
  });
});
```

```js
QUnit.test('date example', function (assert) {
  const result = timeCircuit.getLastDeparted();

  // succeeds
  // - object is instance of same Date class
  // - internal timestamp is equal
  assert.deepEqual(result, new Date('1985-10-26T01:20-07:00'));
  assert.deepEqual(result, new Date('1985-10-26T08:20Z'));

  // fails, because the internal timestamp differs.
  assert.deepEqual(result, new Date('1985-10-26T01:21-07:00'));
  // Actual:   Sat Oct 26 1985 08:20:00 GMT+0000 (UTC)
  // Expected: Sat Oct 26 1985 08:21:00 GMT+0000 (UTC)
});
```

```js
class BaseCoord {
  constructor (lat, long) {
    this.lat = long;
    this.long = long;
  }
}
class PrimaryDimensionCoord extends BaseCoord {}
class UpsideDownCoord extends BaseCoord {}

QUnit.test('class example', function (assert) {
  eleven.goto('Enschede');
  eleven.enterGate();
  const loc = eleven.getLocation();

  // succeeds
  assert.deepEqual(loc, new UpsideDownCoord(52.2206, 6.8960));

  // fails, because loc is an instance of a different class.
  assert.deepEqual(loc, new PrimaryDimensionCoord(52.2206, 6.8960));
});
```

```js
QUnit.test('failing example', function (assert) {
  const result = {
    a: 'Albert',
    b: 'Berta',
    num: 123
  };

  // fails ,because the number 123 is not strictly equal to the string "123".
  assert.deepEqual(result, {
    a: 'Albert',
    b: 'Berta',
    num: '123'
  });
  // Actual:
  //           num: 123
  // Expected:
  //           num: "123"
});
```
