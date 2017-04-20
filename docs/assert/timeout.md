---
layout: default
title: timeout
description: Sets the length of time to wait for async operations before failing the test.
categories:
  - assert
  - async
---

## `timeout( duration )`

Sets the length of time to wait for async operations before failing the test.

| name | description |
|------|-------------|
| `duration` (Number) | The length of time, in milliseconds, to wait for async operations. |

### Description

`assert.timeout()` sets the length of time, in milliseconds, to wait for async operations in the current test. This is equivalent to setting `config.testTimeout` on a per-test basis. The timeout length only applies when performing async operations.

If `0` is passed, then the test will be assumed to be completely synchronous. If a non-numeric value is passed as an argument, the function will throw an error.

### Examples

```js
QUnit.test( "Waiting for focus event", function( assert ) {
  assert.timeout( 1000 ); // Timeout of 1 second
  var done = assert.async();
  var input = $( "#test-input" ).focus();
  setTimeout(function() {
    assert.equal( document.activeElement, input[0], "Input was focused" );
    done();
  });
});
```

```js
QUnit.test( "Waiting for async function", function( assert ) {
  assert.timeout( 500 ); // Timeout of .5 seconds
  var promise = asyncFunction();
  return promise.then( function( result ) {
    assert.ok( result );
  } );
});
```
