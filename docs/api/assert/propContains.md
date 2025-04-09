---
layout: page-api
title: assert.propContains()
excerpt: Check that an object contains certain properties.
groups:
  - assert
redirect_from:
  - "/assert/propContains/"
version_added: "2.18.0"
---

`propContains( actual, expected, message = "" )`

Check that an object contains certain properties.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | Short description of the actual expression |

The `propContains` assertion compares only the **subset** of properties in the expected object,
and tests that these keys exist as own properties with strictly equal values.

This method is recursive and allows partial comparison of nested objects as well.

## See also

* Use [`assert.propEqual()`](./propEqual.md) to compare all properties, considering extra properties as unexpected.
* Use [`assert.notPropContains()`](./notPropContains.md) to test for the absence or inequality of properties.

## Examples

### Example: Usage

```js
QUnit.test('example', function (assert) {
  const result = {
    foo: 0,
    vehicle: {
      timeCircuits: 'on',
      fluxCapacitor: 'fluxing',
      engine: 'running'
    },
    quux: 1
  };

  assert.propContains(result, {
    foo: 0,
    vehicle: { fluxCapacitor: 'fluxing' }
  });

  function Point (x, y, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  assert.propContains(
    new Point(10, 20),
    { y: 20 }
  );

  assert.propContains(
    [ 'a', 'b' ],
    { 1: 'b' }
  );

  const nested = {
    north: [ /* ... */ ],
    east: new Point(10, 20),
    south: [ /* ... */ ],
    west: [ /* ... */ ]
  };

  assert.propContains(nested, { east: new Point(10, 20) });
  assert.propContains(nested, { east: { x: 10, y: 20 } });
  assert.propContains(nested, { east: { x: 10 } });
});
```

### Example: Alternative

```js
assert.propContains(
  new Point(10, 20, 30),
  { x: 10, z: 30 }
);
```

This is like the following, but without needing to describe each assertion, and without temporary variable.

```js
const myPlace = new Point(10, 20, 30);
assert.strictEqual(myPlace.x, 10, 'x property');
assert.strictEqual(myPlace.z, 30, 'z property');
```
