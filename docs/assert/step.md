---
layout: default
title: assert.step()
excerpt: A marker for progress in a given test.
categories:
  - assert
version_added: "2.2"
---

`step( [ message ] )`

A marker for progress in a given test.

| name               | description                          |
|--------------------|--------------------------------------|
| `message` (string) | Message to display for the step      |

### Description

The `step()` assertion registers a passing assertion with a provided message. This makes it easy to check that specific portions of code are being executed, especially in asynchronous test cases and when used with `verifySteps()`. A step will always pass unless a message is not provided or is a non-string value.

Together with the `verifySteps()` method, `step()` assertions give you an easy way to verify both the count and order of code execution.

### Examples

```js
QUnit.test( "step example", assert => {
  const thing = new MyThing();
  thing.on( "something", () => {
    assert.step( "something happened" );
  });
  thing.run();

  assert.verifySteps([ "something happened" ]);
});
```

_Note: See [`verifySteps`](./verifySteps.md) for more detailed examples._
