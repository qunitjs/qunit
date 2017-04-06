---
layout: default
title: async
description: Instruct QUnit to wait for an asynchronous operation.
categories:
  - assert
  - async
---

## `async( [ acceptCallCount = 1 ] )`

Instruct QUnit to wait for an asynchronous operation.

| name | description |
|------|-------------|
| `acceptCallCount` (Number) | Number of expected callbacks before the test is done. Defaults to `1`. |

### Description

`assert.async()` returns a callback function and pauses test processing until the callback function is invoked the specified number of times. The callback will throw an `Error` if it is invoked more often than the accepted call count.

This replaces functionality previously provided by [`QUnit.stop()`](/QUnit/stop) and [`QUnit.start()`](/QUnit/start).

### Examples

Tell QUnit to wait for the `done()` call inside the timeout.

```js
QUnit.test( "assert.async() test", function( assert ) {
  var done = assert.async();
  var input = $( "#test-input" ).focus();
  setTimeout(function() {
    assert.equal( document.activeElement, input[0], "Input was focused" );
    done();
  });
});
```

Call `assert.async()` for each operation. Each `done` callback can be called at most once.

```js
QUnit.test( "two async calls", function( assert ) {
  assert.expect( 2 );

  var done1 = assert.async();
  var done2 = assert.async();
  setTimeout(function() {
    assert.ok( true, "test resumed from async operation 1" );
    done1();
  }, 500 );
  setTimeout(function() {
    assert.ok( true, "test resumed from async operation 2" );
    done2();
  }, 150);
});
```

Set up an async test three exit points. Each `done()` call adds up to the `acceptCallCount`. After three calls, the test is done.

```js
QUnit.test( "multiple call done()", function( assert ) {
  assert.expect( 3 );
  var done = assert.async( 3 );

  setTimeout(function() {
    assert.ok( true, "first call done." );
    done();
  }, 500 );

  setTimeout(function() {
    assert.ok( true, "second call done." );
    done();
  }, 500 );

  setTimeout(function() {
    assert.ok( true, "third call done." );
    done();
  }, 500 );
});
```
