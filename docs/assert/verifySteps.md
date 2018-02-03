---
layout: default
title: verifySteps
description: A helper assertion to verify the order and number of steps in a test.
categories:
  - assert
---

## `verifySteps( steps [, message ] )`

A helper assertion to verify the order and number of steps in a test.

| name               | description                          |
|--------------------|--------------------------------------|
| `steps` (array)    | Array of strings representing steps to verify |
| `message` (string) | A short description of the assertion |

### Description

The `assert.verifySteps()` assertion compares a given array of string values (representing steps) with the order and values of previous `step()` calls. This assertion is helpful for verifying the order and count of portions of code paths, especially asynchronous ones.

The list of steps to validate is reset when `assert.verifySteps([/* ...snip ... */])` is called. This allows multiple combinations of `assert.step` and `assert.verifySteps` within the same test.

### Examples

The following examples look at scenarios in which the Step API is particularly useful and shows how you might have implemented the same functionality with less-specific APIs.

#### Verifying Hook Execution Order

**Without Step API**

```js
QUnit.test( "user-defined hooks execute in correct order", function( assert ) {
  let lastStep = 'none';
  let startCount = 0;
  let middleCount = 0;
  let endCount = 0;

  obj.start = function() {
    assert.equal(lastStep, 'none');
    lastStep = 'start';
    startCount++;
  };
  obj.middle = function() {
    assert.equal(lastStep, 'start');
    lastStep = 'middle';
    middleCount++;
  };
  obj.end = function() {
    assert.equal(lastStep, 'middle');
    endCount++;
  };

  return obj.process().then(function() {
    assert.equal(startCount, 1);
    assert.equal(middleCount, 1);
    assert.equal(endCount, 1);
  });
});
```

**With Step API**

```js
QUnit.test( "user-defined hooks execute in correct order", function( assert ) {
  obj.start = function() {
    assert.step('start');
  };
  obj.middle = function() {
    assert.step('middle');
  };
  obj.end = function() {
    assert.step('end');
  };

  return obj.process().then(function() {
    assert.verifySteps(['start', 'middle', 'end']);
  });
});
```

#### Verifying Evented Systems

**Without Step API**

```js
QUnit.test( "subscribe/unsubscribe", function( assert ) {

  const publisher = new Publisher();
  const messages = [];

  const subscriber1 = message => messages.push(`Subscriber #1: ${message}`);
  const subscriber2 = message => messages.push(`Subscriber #2: ${message}`);

  publisher.subscribe(subscriber1);
  publisher.subscribe(subscriber2);

  publisher.publish('Hello!');

  publisher.unsubscribe(subscriber1);

  publisher.publish('World!');

  assert.deepEqual(messages, [
    'Subscriber #1: Hello!',
    'Subscriber #2: Hello!',
    'Subscriber #2: World!'
  ]);
});
```

**With Step API**

```js
QUnit.test( "subscribe/unsubscribe", function( assert ) {

  const publisher = new Publisher();

  const subscriber1 = message => assert.step(`Subscriber #1: ${message}`);
  const subscriber2 = message => assert.step(`Subscriber #2: ${message}`);

  publisher.subscribe(subscriber1);
  publisher.subscribe(subscriber2);

  publisher.publish('Hello!');

  publisher.unsubscribe(subscriber1);

  publisher.publish('World!');

  assert.verifySteps([
    'Subscriber #1: Hello!',
    'Subscriber #2: Hello!',
    'Subscriber #2: World!'
  ]);
});
```

#### Verifying Steps Multiple Times

```js
QUnit.test( "verify steps", function test(assert){
    assert.expect( 5 );

    assert.step( "do stuff 1" );
    assert.step( "do stuff 2" );
    assert.verifySteps( [ "do stuff 1", "do stuff 2" ] );

    assert.step( "do stuff 3" );
    assert.verifySteps( [ "do stuff 3" ] );
} );
```
