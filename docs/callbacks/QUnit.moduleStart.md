---
layout: default
title: QUnit.moduleStart
description: Register a callback to fire whenever a module begins.
categories:
  - callbacks
---

## `QUnit.moduleStart( callback )`

Register a callback to fire whenever a module begins.

| parameter | description |
|-----------|-------------|
| callback (function) | Callback to execute. Provides a single argument with the callback details object |

#### Callback details: `callback( details: { name } )`

| parameter | description |
|-----------|-------------|
| `name` (string) | Name of the next module to run |

### Example

Register a callback that logs the module name

```js
QUnit.moduleStart(function( details ) {
  console.log( "Now running: ", details.name );
});
```

Using modern syntax:

```js
QUnit.moduleStart( ( { name } ) => {
  console.log( `Now running: ${name}` );
});
```
