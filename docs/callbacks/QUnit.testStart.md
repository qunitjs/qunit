---
layout: default
title: QUnit.testStart
description: Register a callback to fire whenever a test begins.
categories:
  - callbacks
---

## `QUnit.testStart( callback )`

Register a callback to fire whenever a test begins.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback details object |

#### Callback details: `callback( details: { name, module, testId, previousFailure } )`

| parameter | description |
|-----------|-------------|
| `name` (string) | Name of the next test to run |
| `module` (string) | Name of the current module |
| `testId` (string) | Id of the next test to run |
| `previousFailure` (boolean) | Whether the next test failed on a previous run |

### Example

Register a callback that logs the module and name

```js
QUnit.testStart(function( details ) {
  console.log( "Now running: ", details.module, details.name );
});
```

Using modern syntax:

```js
QUnit.testStart( ( { module, name } ) => {
  console.log( `Now running: ${module}: ${name}` );
});
```
