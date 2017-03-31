---
layout: default
title: QUnit.moduleDone
description: Register a callback to fire whenever a module ends.
categories:
  - callbacks
---

## `QUnit.moduleDone( callback )`

Register a callback to fire whenever a module ends.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback details object |

#### Callback details: `callback( details: { name, failed, passed, total, runtime } )`

| parameter | description |
|-----------|-------------|
| `name` (string) | Name of this module |
| `failed` (number) | The number of failed assertions |
| `passed` (number) | The number of passed assertions |
| `total` (number) | The total number of assertions |
| `runtime` (number) | The execution time in millseconds of this module |

### Example

Register a callback that logs the module results

```js
QUnit.moduleDone(function( details ) {
  console.log( "Finished running: ", details.name, "Failed/total: ", details.failed, details.total );
});
```

Using modern syntax:

```js
QUnit.moduleDone( ( { name, failed, total } ) => {
  console.log( `Finished running: ${name} Failed/total: ${failed}, ${total}` );
});
```