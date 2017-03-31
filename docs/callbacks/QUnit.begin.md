---
layout: default
title: QUnit.begin
description: Register a callback to fire whenever the test suite begins.
categories:
  - callbacks
---

## `QUnit.begin( callback )`

Register a callback to fire whenever the test suite begins.

`QUnit.begin()` is called once before running any tests.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback details object |

#### Callback details: `callback( details: { totalTests } )`

| parameter | description |
|-----------|-------------|
| `totalTests` | The number of total tests in the test suite |

### Example

Get total amount of tests.

```js
QUnit.begin(function( details ) {
  console.log( "Test amount:", details.totalTests );
});
```

Using modern syntax:

```js
QUnit.begin( ( { totalTests } ) => {
  console.log( `Test amount: ${totalTests}` );
});
```
