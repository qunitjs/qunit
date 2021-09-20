---
layout: page-api
title: assert.verifySteps()
excerpt: A helper assertion to verify the order and number of steps in a test.
groups:
  - assert
version_added: "2.2.0"
---

`verifySteps( steps, message = "" )`

A helper assertion to verify the order and number of steps in a test.

| name | description |
|------|-------------|
| `steps` (array) | List of strings |
| `message` (string) | A short description of the assertion |

The `assert.verifySteps()` assertion compares a given array of string values (representing steps) with the order and values of previous `step()` calls. This assertion is helpful for verifying the order and count of portions of code paths, especially asynchronous ones.

The list of steps to validate is reset when `assert.verifySteps([/* ...snip ... */])` is called. This allows multiple combinations of `assert.step` and `assert.verifySteps` within the same test.

Learn how to use the Step API and the value it adds to your test suite.

## Examples

The **Step API** strictly validates the order and frequency of observed values. It also allows detecting of unexpected steps, which are then shown as part the test failure.

### Test event-based interface

This example uses a class based on an [`EventEmitter`](https://nodejs.org/api/events.html), such as the one provided by Node.js and other environments:

```js
QUnit.test( "good example", async assert => {
  const thing = new MyThing();
  thing.on( "start", () => {
    assert.step( "start" );
  });
  thing.on( "middle", () => {
    assert.step( "middle" );
  });
  thing.on( "end", () => {
    assert.step( "end" );
  });
  thing.on( "error", message => {
    assert.step( { error: message } );
  });

  await thing.process();

  assert.verifySteps( [ "start", "middle", "end" ] );
});
```

When approaching this scenario **without the Step API** one might be tempted to place comparison checks directly inside event callbacks. It is considered an anti-pattern to make dummy assertions in callbacks that the test does not have control over, because that would provide loose assurances and can easily cause false positives (a callback might not run, run out of order, or run multipe times). It also offers rather limited debugging information in case of problems.

```js
// WARNING: This is a BAD example
QUnit.test( "bad example 1", assert => {
  const thing = new MyThing();
  thing.on( "start", () => {
    assert.true( true, "start" );
  });
  thing.on( "middle", () => {
    assert.true( true, "middle" );
  });
  thing.on( "end", () => {
    assert.true( true, "end" );
  });
  thing.on( "error", () => {
    assert.true( false, "error" );
  });

  return thing.process();
});
```

A less fragile approach could involve a local counter variable with an array that we check with [`deepEqual`](./deepEqual.md). This catches out-of-order issues, unexpected values, duplicate values, and provides detailed debugging information in case of problems. This is basically how the Step API works:

```js
QUnit.test( "manual example without Step API", assert => {
  const values = [];

  const thing = new MyThing();
  thing.on( "start", () => {
    values.push( "start" );
  });
  thing.on( "middle", () => {
    values.push( "middle" );
  });
  thing.on( "end", () => {
    values.push( "end" );
  });
  thing.on( "error", () => {
    values.push( "error" );
  });


  return thing.process().then(() => {
    assert.deepEqual( values, [ "start", "middle", "end" ] );
  });
});
```

### Test publish/subscribe system

Use the **Step API** to verify messages received in a Pub-Sub channel or topic.

```js
QUnit.test( "good example", assert => {
  const publisher = new Publisher();

  const subscriber1 = (message) => assert.step(`Sub 1: ${message}`);
  const subscriber2 = (message) => assert.step(`Sub 2: ${message}`);

  publisher.subscribe(subscriber1);
  publisher.subscribe(subscriber2);
  publisher.publish( "Hello!" );

  publisher.unsubscribe(subscriber1);
  publisher.publish( "World!" );

  assert.verifySteps([
    "Sub 1: Hello!",
    "Sub 2: Hello!",
    "Sub 2: World!"
  ]);
});
```

### Multiple steps verifications in one test

The internal buffer of observed steps is automatically reset when calling `verifySteps()`.

```js
QUnit.test( "multiple verifications example", assert => {
  assert.step( "one" );
  assert.step( "two" );
  assert.verifySteps([ "one", "two" ]);

  assert.step( "three" );
  assert.step( "four" );
  assert.verifySteps([ "three", "four" ]);
});
 ```
