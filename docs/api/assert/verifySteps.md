---
layout: page-api
title: assert.verifySteps()
excerpt: Verify the exact order of steps.
groups:
  - assert
redirect_from:
  - "/assert/verifySteps/"
version_added: "2.2.0"
---

`verifySteps( steps, message = "" )`

Verify the presence and exact order of previously marked steps in a test.

| name | description |
|------|-------------|
| `steps` (array) | List of strings |
| `message` (string) | Short description |

The Step API provides an easy way to verify execution logic to a high degree of accuracy and precision, whether for asynchronous code, event-driven code, or callback-driven code.

For example, you can mark steps to observe and validate whether parts of your code are reached correctly, or to check the frequency (how often) an asynchronous code path is executed. You can also capture any unexpected steps, which are automatically detected and shown as part of the test failure.

This assertion compares a given array of string values to a list of previously recorded steps, as marked via previous calls to [`assert.step()`](./step.md).

Calling `verifySteps()` will clear and reset the internal list of steps. This allows multiple independent sequences of `assert.step()` to exist within the same test.

Refer to the below examples and learn how to use the Step API in your test suite.

## Changelog

| UNRELEASED | [assert.expect()](./expect.md) now counts `assert.verifySteps()` as one assertion. Steps no longer count separately.

## Examples

### Test event-based interface

This example uses a class based on an [`EventEmitter`](https://nodejs.org/api/events.html), such as the one provided by Node.js and other environments:

```js
QUnit.test('good example', async function (assert) {
  MyWordParser.on('noun', function (word) {
    assert.step(word);
  });
  const song = await MyWordParser.sing('My Favorite Things', { lines: 1 });

  assert.true(song.finished, 'finished');
  assert.verifySteps([
    'Raindrops',
    'roses',
    'whiskers',
    'kittens'
  ]);
});
```

```js
QUnit.test('good example', async function (assert) {
  const maker = new WordMaker();
  maker.on('start', () => {
    assert.step('start');
  });
  maker.on('data', (word) => {
    assert.step(word);
  });
  maker.on('end', () => {
    assert.step('end');
  });
  maker.on('error', message => {
    assert.step('error: ' + message);
  });

  await maker.process('3.1');

  assert.verifySteps(['start', '3', 'point', '1', 'end']);
});
```

If you approach this scenario *without* the Step API, one might be tempted to place assertions directly inside event callbacks. This is **risky**, because it assumes the code you're testing has no bugs. For example, some callbacks might not run, or run multiple times, or run out of order. It is therefore generally recommended to only run assertions directly in the test function. Avoid assertions in callbacks that the test does not have control over. Such loose assurances easily produce false positives (because the subset of assertions that *did* run, passed!). It also offers virtually no debugging information during failures.

```js
// WARNING: This is a BAD example
QUnit.test('bad example 1', async function (assert) {
  const maker = new WordMaker();
  maker.on('start', () => {
    assert.true(true, 'start');
  });
  maker.on('middle', () => {
    assert.true(true, 'middle');
  });
  maker.on('end', () => {
    assert.true(true, 'end');
  });
  maker.on('error', () => {
    assert.true(false, 'error');
  });

  await maker.process();
});
```

A less fragile approach could involve a local array that we check afterwards with [`deepEqual`](./deepEqual.md). This catches out-of-order issues, unexpected values, and duplicate values. It also places the assertion under the test's direct control, leaving no room for it to be skipped, run too early, too late, or multiple times. The array approach also provides ample debugging information during failures. The below is in essence how the Step API works:

```js
QUnit.test('manual example without Step API', async function (assert) {
  const values = [];

  const maker = new WordMaker();
  maker.on('start', () => {
    values.push('start');
  });
  maker.on('middle', () => {
    values.push('middle');
  });
  maker.on('end', () => {
    values.push('end');
  });
  maker.on('error', () => {
    values.push('error');
  });

  await maker.process();

  assert.deepEqual(values, ['start', 'middle', 'end']);
});
```

### Test publish/subscribe system

Use the **Step API** to verify messages received in a Pub-Sub channel or topic.

```js
QUnit.test('good example', function (assert) {
  const publisher = new Publisher();

  const subscriber1 = (message) => assert.step(`Sub 1: ${message}`);
  const subscriber2 = (message) => assert.step(`Sub 2: ${message}`);

  publisher.subscribe(subscriber1);
  publisher.subscribe(subscriber2);
  publisher.publish('Hello!');

  publisher.unsubscribe(subscriber1);
  publisher.publish('World!');

  assert.verifySteps([
    'Sub 1: Hello!',
    'Sub 2: Hello!',
    'Sub 2: World!'
  ]);
});
```

### Multiple step verifications in one test

The internal buffer of observed steps is automatically reset when calling `verifySteps()`.

```js
QUnit.test('multiple verifications example', function (assert) {
  assert.step('one');
  assert.step('two');
  assert.verifySteps(['one', 'two']);

  assert.step('three');
  assert.step('four');
  assert.verifySteps(['three', 'four']);
});
 ```
