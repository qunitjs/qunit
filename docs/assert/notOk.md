---
layout: page-api
title: assert.notOk()
excerpt: Check if the first argument is falsy.
groups:
  - assert
version_added: "1.18.0"
---

`notOk( state, message = "" )`

A boolean check, inverse of [`assert.ok()`](./ok.md). Passes if the first argument is falsy.

| name | description |
|------|-------------|
| state | Expression being tested |
| message (string) | A short description of the assertion |

`notOk()` requires just one argument. If the argument evaluates to false, the assertion passes; otherwise, it fails. If a second message argument is provided, it will be displayed in place of the result.

## Examples

```js
QUnit.test( "example", assert => {
  // success
  assert.notOk( false, "boolean false" );
  assert.notOk( "", "empty string" );
  assert.notOk( 0, "number zero" );
  assert.notOk( NaN, "NaN value" );
  assert.notOk( null, "null value" );
  assert.notOk( undefined, "undefined value" );

  // failure
  assert.notOk( "foo", "non-empty string" );
  assert.notOk( true, "boolean true" );
  assert.notOk( 1, "number one" );
});
```
