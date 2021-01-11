---
layout: default
title: assert.notOk()
excerpt: Check if the first argument is falsy.
categories:
  - assert
version_added: "1.18"
---

`notOk( state [, message ] )`

A boolean check, inverse of `ok()`. Passes if the first argument is falsy.

| name               | description                          |
|--------------------|--------------------------------------|
| state              | Expression being tested              |
| message (string)   | A short description of the assertion |

### Description

`notOk()` requires just one argument. If the argument evaluates to false, the assertion passes; otherwise, it fails. If a second message argument is provided, it will be displayed in place of the result.

### Examples

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
