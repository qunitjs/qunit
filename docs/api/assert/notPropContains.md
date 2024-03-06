---
layout: page-api
title: assert.notPropContains()
excerpt: Check that an object does not contain certain properties.
groups:
  - assert
redirect_from:
  - "/assert/notPropContains/"
version_added: "2.18.0"
---

`notPropContains( actual, expected, message = "" )`

Check that an object does not contain certain properties.

| name | description |
|------|-------------|
| `actual` | Expression being tested |
| `expected` | Known comparison value |
| `message` (string) | Short description |

The `notPropContains` assertion compares the subset of properties in the expected object, and tests that these keys are either absent or hold a value that is different according to a strict equality comparison.

This method is recursive and allows partial comparison of nested objects as well.

## See also

* Use [`assert.propContains()`](./propContains.md) to test for the presence and equality of properties instead.

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

  // succeeds, property "timeCircuits" is actually "on"
  assert.notPropContains(result, {
    vehicle: {
      timeCircuits: 'off'
    }
  });

  // succeeds, property "wings" is not in the object
  assert.notPropContains(result, {
    vehicle: {
      wings: 'flapping'
    }
  });

  function Point (x, y) {
    this.x = x;
    this.y = y;
  }

  assert.notPropContains(
    new Point(10, 20),
    { z: 30 }
  );

  const nested = {
    north: [ /* ... */ ],
    east: new Point(10, 20),
    south: [ /* ... */ ],
    west: [ /* ... */ ]
  };

  assert.notPropContains(nested, { east: new Point(88, 42) });
  assert.notPropContains(nested, { east: { x: 88 } });
});
```
