---
layout: post
title: "Cleaner stack traces in QUnit"
author: krinkle
tags:
- feature
---

Stack traces shown in the QUnit CLI now remove or grey out internal calls by Node.js and QUnit.

## Background

QUnit has always omitted its own source lines from stack traces when showing assertion failures. [^1]

This means we can report assertion failures with a stack that is just one level deep, pointing directly at your test file, to the line where the assertion happens.

```js
QUnit.test('banana', function (assert) {
  const actual = 'This is actual.';
  assert.strictEqual(actual, 'This is expected.');
});
```

```tap
not ok 2 banana
  ---
  actual  : This is actual.
  expected: This is expected.
  stack: |
        at /test/example.js:3:10
```

<figure><img src="/resources/2025-stacktrace-assert-html.png" width="560" height="244" alt="Screenshot of QUnit test results in a web browser.
1) apple
2) banana
Expected: This is expected.
Result    This is actual.
Source:   @/test/example.js:3:10
"></figure>

The "real" stack trace is actually quite a bit longer, but we rebase it to become trace for your assertion. We remove lines before your assertion point (i.e. QUnit calling your test function), and remove any calls after that point (i.e. code inside an assert function).

This works well in browsers. But, when it comes to Node.js, we can do better!

## Node.js runtime internals

Web browsers generally don't expose their own internals to stack traces at all. For example, the internals of `fetch()`, or `setTimeout()`. [^2] Node.js implements many of its internals in JavaScript, which are sometimes visible in a stack trace.

Let's look a slow example test:

```js
QUnit.test('slow example', function (assert) {
  assert.timeout(100);

  const done = assert.async();
  // Never done()
});
```

Status quo with QUnit 2.23.1:

```tap
TAP version 13
not ok 1 slow example
  ---
  message: Test took longer than 100ms; test timed out.
  severity: failed
  stack: |
        at listOnTimeout (node:internal/timers:573:17)
        at process.processTimers (node:internal/timers:514:7)
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1
```

Notice the function calls inside the virtual `note:internal` module?

### Hide internal frames

While these functions are not called inside QUnit, we hide them because this timer is scheduled by QUnit. In this case, there are other stack frames and we can omit the trace entirely, for an even cleaner result. The same result in QUnit 2.24.0:

```tap
TAP version 13
not ok 1 slow example
  ---
  message: Test took longer than 100ms; test timed out.
  severity: failed
  ...
1..1
# pass 0
# skip 0
# todo 0
# fail 1
```

### Grey out Node.js internals

Let's look at a slightly more involved example, where your own code schedules a timer.

```js
QUnit.test('assert example', function (assert) {
  const done = assert.async();
  setTimeout(function () {
    assert.false(true, 'hello');
    done();
  });
});
```
<div class="figure-row">
<figure><img src="/resources/2025-stacktrace-assert-tap-before.png" width="463" height="241" alt="not ok 1 assert example. actual: true. expected: false. stack: at assert-example.js, at node:internal/timers, at node:internal/timers"><figcaption>QUnit 2.23.0</figcaption></figure>
<figure><img src="/resources/2025-stacktrace-assert-tap-after.png" width="463" height="241" alt=""><figcaption>QUnit 2.24.0</figcaption></figure>
</div>

In this case, we can't remove any frames. We should report errors from user code with the same level of detail as Node.js would, if you ran it outside a test. But, what we can do is grey out these `node:internal` frames, and draw attention to what is most likely of interest.

## Uncaught exceptions

The above examples were about stack traces that originate from inside a test case.

We also format stack traces when reporting uncaught exceptions (a.k.a. "global failure"). This includes errors that bubble up to `window.onerror` or `process.on('uncaughtException', …)`, as received by [`QUnit.onUncaughtException`]({% link api/extension/QUnit.onUncaughtException.md %}).

As of QUnit 2.24 we now apply the same stack trace cleaner when formatting uncaught exceptions.

```js
// example.js
QUnit.on(null);
```
```sh
qunit example.js
```

<div class="figure-row">
<figure><img src="/resources/2025-stacktrace-error-before.png" width="540" height="302" alt="Failed to load file example.js. TypeError: eventName must be a string. at qunit.js, at example.js, at node:internal/cjs/loader."><figcaption>QUnit 2.23.1</figcaption></figure>
<figure><img src="/resources/2025-stacktrace-error-after.png" width="540" height="288" alt="Failed to load file example.js. TypeError: eventName must be a string. at example.js, at node:internal/cjs/loader."><figcaption>QUnit 2.24.0</figcaption></figure>
</div>

Notice the removal of the first `qunit.js` call, which lets the trace starts cleanly at `example.js`. The other internal calls are greyed out.

### Trimming traces

For assertion failures and uncaught exceptions alike, we only trim internal frames from the start or end of a stack. Removing frames from the middle would falsely present a call relationship that never happened, and would cause confusion among developers. Instead, frames we can't trim, are greyed out instead. This is similar to Node.js's own error formatter does.

## TAP reporter

These changes are applied to the TAP reporter, which the QUnit CLI uses by default. If you use the TAP reporter in browser environments, the same improvements apply there as well.

## See also

* [Exclude or grey internal frames in error stacks · Pull Request #1789](https://github.com/qunitjs/qunit/pull/1789)
* [Apply trace cleaning to assertion stack as well · Pull Request #1795](https://github.com/qunitjs/qunit/pull/1795)
* [Remove confusing "expected: undefined" under errors · Pull Request #1794](https://github.com/qunitjs/qunit/pull/1794)
* [Limit colors in TAP reporter to test names · Pull Request #1801](https://github.com/qunitjs/qunit/pull/1801)
* [QUnit 2.23.1 Release]({% post_url 2024-12-06-qunit-2-23-1 %})
* [QUnit 2.24.0 Release]({% post_url 2025-01-20-qunit-2-24-0 %})

## Footnotes

[^1]: This was released with QUnit 1.7 back in 2012 ([commit](https://github.com/qunitjs/qunit/commit/171ad8f042007e795766893a701d9315bdedeef1)).
[^2]: This is in part because native browser code isn't written in JavaScript, so the JavaScript stack is naturally limited to your code only.
