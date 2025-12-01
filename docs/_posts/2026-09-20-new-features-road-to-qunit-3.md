---
layout: post
title: "The Road to QUnit 3: New features"
author: krinkle
excerpt: Step API, data providers, conditional skip, global hooks, and more.
tags:
- feature
---

Check out the [blog archive]({% link blog/archive.md %}) or [repository changelog](https://github.com/qunitjs/qunit/blob/2.26.0/History.md) for a more detailed history.

## Step API

The [Step API]({% link api/assert/verifySteps.md %}) provides a complete and strict way to verify asynchronous or event-driven code. You use it via the `assert.step()` and `assert.verifySteps()` methods. It was introduced in [QUnit 2.2]({% post_url 2017-03-11-qunit-2-2-0 %}).

By simply recording and verifying steps, you achieve comprehensive and strict coverage for async or even-driven code. It naturally observes what is called, how it is called, in which order, and how often. You can also detect unexpected steps, which are reported as test failures.

```js
QUnit.test('example', function (assert) {
  const finder = new WordFinder();
  finder.on('start', () => assert.step('start'));
  finder.on('data', (word) => assert.step('data: ' + word));
  finder.on('end', () => assert.step('end'));
  finder.on('error', (e) => assert.step('error: ' + e));

  finder.process('Hello, 2026. Great!');

  assert.verifySteps(['start', 'data: Hello', 'data: Great', 'end']);
});
```

## test.todo()

QUnit 2.2 adds [`QUnit.test.todo()`]({% link api/QUnit/test.todo.md %}) to natively recognise tests that intentionally fail because the implementation is not yet finished. QUnit 2.4 later added [`QUnit.module.todo()`]({% link api/QUnit/module.md %}) to mark a group of tests, e.g. a nested sub-module or entire module.

If you write tests before the feature implementation, e.g. as part of a [TDD](https://en.wikipedia.org/wiki/Test-driven_development) practice, this method encourages sharing a specification or design early on by committing it to source control. You can then collaborate on that feature, and gradually enable tests and make them pass.

## assert.timeout()

Since QUnit 2.4, you can override the default timeout on a per-test basis with [`assert.timeout()`]({% link api/assert/timeout.md %}).

```js
QUnit.test('wait for an async function', async function (assert) {
  assert.timeout(500); // Timeout after 0.5 seconds

  const result = await asyncAdder(5, 7);
  assert.strictEqual(result, 12);
});
```

## assert.rejects()

QUnit 2.5 adds [`assert.rejects()`]({% link api/assert/rejects.md %}) as asynchronous version of `assert.throws()`. It allows for a simple and readable way to match an expected error from any async function or rejected Promise. No more [workarounds]({% link api/assert/rejects.md %}#example-workarounds)!

```js
async function feedBaby (food) {
  if (food === 'sprouts') {
    throw new RangeError('Do not like');
  }
  return true;
}

QUnit.test('example', async function (assert) {
  assert.true(feedBaby('apple'));

  await assert.rejects(feedBaby('sprouts'), RangeError);

  assert.true(feedBaby('cucumber'));
});
```

You can perform additional assertions on the rejection value via the return value, since [QUnit 2.26]({% post_url 2026-05-31-qunit-2-26-0 %}):

```js
QUnit.test('example', async function (assert) {
  const p = feedMe();
  const e = await assert.rejects(p, RangeError);
  assert.deepEqual(e.somedata, { foo: 'bar' });
});
```

## Performance Timeline

QUnit 2.7 adds integration with browser DevTools to understand where your tests spend time. This feature measures the duration of every test, and adds them to the  Performance Timeline in Firefox Profiler or Chrome DevTools. It is enabled by default when running tests in a browser.

See also [`QUnit.reporters.perf`]({% link api/reporters/perf.md %}).

```
QUnit Run
└── QUnit Module: Example
    ├── QUnit Test: apple
    ├── QUnit Test: banana
    └── QUnit Test: citron
```

<figure>
  <img alt="QUnit profiling in Chrome DevTools Performance tab" src="/resources/perf-chrome.png">
</figure>

## assert.true() and assert.false()

The new strict boolean [`assert.true()`]({% link api/assert/true.md %}) and [`assert.false()`]({% link api/assert/false.md %}) methods arrived in QUnit 2.11. These methods provide a shortcut to [`assert.strictEqual()`]({% link api/assert/strictEqual.md %}) with `true` or `false` as the expected value.

The new methods promote strict equality by providing an appealing alternative to [`assert.ok()`]({% link api/assert/ok.md %}) and [`assert.equal(,true)`]({% link api/assert/equal.md %}), which were shorter than `assert.strictEqual()` but involve type casting.

## Data providers

QUnit 2.16 introduced [`QUnit.test.each()`]({% link api/QUnit/test.each.md %}) to generate multiple test cases from a single template and a data provider. This removes the need to duplicate code across many similar tests, and removes the need for ad-hoc loops and other (often, untested) custom abstractions.

## assert.propContains()

QUnit 2.18 added [`assert.propContains()`]({% link api/assert/propContains.md %}) to partially compare an object against expected key-value pairs, whilst ignoring other properties. This complements the [`assert.propEqual()`]({% link api/assert/propEqual.md %}) method.

```js
QUnit.test('example', function (assert) {
  const result = {
    foo: 0,
    vehicle: {
      timeCircuits: 'on',
      fluxCapacitor: 'fluxing',
      engine: 'running'
    },
    quux: 1
  };

  assert.propContains(result, {
    foo: 0,
    vehicle: { fluxCapacitor: 'fluxing' }
  });
});
```

## assert.closeTo()

QUnit 2.21 introduced [`assert.closeTo()`]({% link api/assert/closeTo.md %}), which checks that a number is within a range or tolerance from an expected number.

```js
QUnit.test('example', function (assert) {
  // passing: x is between 0.299 and 0.301
  const x = 0.1 + 0.2; // 0.30000000000000004
  assert.closeTo(x, 0.3, 0.001);

  // passing: 3.14159 is between 3.140 and 3.142
  assert.closeTo(Math.PI, 3.141, 0.001);

  // passing: y is between 2010 and 2014 inclusive
  const y = 2014;
  assert.closeTo(y, 2012, 2);
});
```

## Conditional skip

QUnit 2.22 introduced [`QUnit.test.if()`]({% link api/QUnit/test.if.md %}) and `QUnit.module.if()` to automatically skip a test when a certain condition is false. For example, to skip a test for a feature that is not available in older browsers.

## Features for test runners and plugins

### Preconfiguration

QUnit 2.1 introduced support for a predefined [`QUnit.config`]({% link api/config/index.md %}).

### Event emitter

QUnit 2.2 introduced the [`QUnit.on()`]({% link api/callbacks/QUnit.on.md %}) event emitter, which lets you create custom reporters. These can be loaded in the browser, or in the [QUnit CLI]({% link cli.md %}) via `--reporter`.

```js
QUnit.on('runEnd', (runEnd) => {
  console.log(`Passed: ${runEnd.passed}`);
  console.log(`Failed: ${runEnd.failed}`);
  console.log(`Skipped: ${runEnd.skipped}`);
  console.log(`Todo: ${runEnd.todo}`);
  console.log(`Total: ${runEnd.total}`);
});
```

### QUnit CLI

QUnit 2.3 introduced the [QUnit CLI]({% link cli.md %}), with the `--require` option arriving in 2.6, and the `--module` option in 2.19.

### Global hooks

QUnit 2.18 introduced [QUnit.hooks]({% link api/QUnit/hooks.md %}) to globally add `beforeEach` and `afterEach` hooks on all tests.

## See also

* [QUnit 3.0 Upgrade Guide]({% link upgrade-guide-3.x.md %})
