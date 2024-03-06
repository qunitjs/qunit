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

```js
QUnit.test('example', assert => {
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

  function Point (x, y) {
    this.x = x;
    this.y = y;
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
