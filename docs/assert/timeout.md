---
layout: default
title: assert.timeout()
excerpt: Set the length of time to wait for async operations before failing the test.
categories:
  - assert
  - async
version_added: "2.4"
---

`timeout( duration )`

Set the length of time to wait for async operations before failing the test.

| name | description |
|------|-------------|
| `duration` (Number) | The length of time, in milliseconds, to wait for async operations. |

### Description

`assert.timeout()` sets the length of time, in milliseconds, to wait for async operations in the current test. This is equivalent to setting `config.testTimeout` on a per-test basis. The timeout length only applies when performing async operations.

If `assert.timeout()` is called after a timeout has already been set, the old timeout will be cleared and the new duration will be used for the new timer.

If `0` is passed, then the test will be assumed to be completely synchronous. If a non-numeric value is passed as an argument, the function will throw an error.

### Examples

```js
QUnit.test( "wait for an event", assert => {
  assert.timeout( 1000 ); // Timeout after 1 second
  const done = assert.async();

  const adder = new NumberAdder();
  adder.on( "ready", res => {
    assert.strictEqual( res, 12 );
    done();
  });
  adder.run([ 1, 1, 2, 3, 5 ]);
});
```

```js
QUnit.test( "wait for an async function", async assert => {
  assert.timeout( 500 ); // Timeout after 0.5 seconds

  const result = await asyncAdder( 5, 7 );
  assert.strictEqual( result, 12 );
});
```

Using classic ES5 syntax:

```js
QUnit.test( "wait for a returned promise", function( assert ) {
  assert.timeout( 500 ); // Timeout after 0.5 seconds

  var promise = asyncAdder( 5, 7 );

  return promise.then( function( result ) {
    assert.strictEqual( result, 12 );
  } );
});
```
