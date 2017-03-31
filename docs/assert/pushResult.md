---
layout: default
title: pushResult
description: Report the result of a custom assertion.
categories:
  - assert
---

## `pushResult( data: { result, actual, expected, message } )`

Report the result of a custom assertion.

| name               | description                          |
|--------------------|--------------------------------------|
| `data.result` (boolean) | Result of the assertion |
| `data.actual` | Expression being tested |
| `data.expected` | Known comparison value |
| `data.message` (string) | A short description of the assertion |

Some test suites may need to express an expectation that is not defined by any of QUnit's built-in assertions. This need may be met by encapsulating the expectation in a JavaScript function which returns a `Boolean` value representing the result; this value can then be passed into QUnit's `ok` assertion.

A more readable solution would involve defining a custom assertion. If the expectation function invokes `pushResult`, QUnit will be notified of the result and report it accordingly.

### Example

Define a custom `mod2` assertion that tests if the provided numbers are equivalent in modulo 2.

```js
QUnit.assert.mod2 = function( value, expected, message ) {
    var actual = value % 2;
    this.pushResult( {
        result: actual === expected,
        actual: actual,
        expected: expected,
        message: message
    } );
};

QUnit.test( "mod2", function( assert ) {
    assert.expect( 2 );

    assert.mod2( 2, 0, "2 % 2 == 0" );
    assert.mod2( 3, 1, "3 % 2 == 1" );
});
```
