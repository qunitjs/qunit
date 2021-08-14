---
layout: page-api
title: assert.ok()
excerpt: Check if the first argument is truthy.
groups:
  - assert
redirect_from:
  - "/ok/"
version_added: "1.0.0"
---

`ok( state [, message ] )`

A boolean check. Passes if the first argument is truthy.

| name | description |
|------|-------------|
| `state` | Expression being tested |
| `message` (string) | A short description of the assertion |

### Description

The most basic assertion in QUnit, `ok()` requires just one argument. If the argument evaluates to true, the assertion passes; otherwise, it fails. If a second message argument is provided, it will be displayed in place of the result.

### Examples

```js
QUnit.test( "example", assert => {
  // success
  assert.ok( true, "boolean true" );
  assert.ok( "foo", "non-empty string" );
  assert.ok( 1, "number one" );

  // failure
  assert.ok( false, "boolean false" );
  assert.ok( "", "empty string" );
  assert.ok( 0, "number zero" );
  assert.ok( NaN, "NaN value" );
  assert.ok( null, "null value" );
  assert.ok( undefined, "undefined value" );
});
```
