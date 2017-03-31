---
layout: default
title: expect
description: Specify how many assertions are expected to run within a test.
categories:
  - assert
---

## `expect( amount )`

Specify how many assertions are expected to run within a test.

| name | description |
|------|-------------|
| `amount` | Number of assertions in this test. |

### Description

To ensure that an explicit number of assertions are run within any test, use `assert.expect( number )` to register an expected count. If the number of assertions run does not match the expected count, the test will fail.

### Examples

Establish an expected assertion count

```js
QUnit.test( "a test", function( assert ) {
  assert.expect( 2 );

  function calc( x, operation ) {
    return operation( x );
  }

  var result = calc( 2, function( x ) {
    assert.ok( true, "calc() calls operation function" );
    return x * x;
  });

  assert.equal( result, 4, "2 squared equals 4" );
});
```
