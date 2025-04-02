---
layout: page-api
title: QUnit.reporters.perf
excerpt: |
  The perf reporter measures each QUnit test, to then access or visualize in the browser devtools.

  <img alt="QUnit profiling in Chrome DevTools Performance tab" src="/resources/perf-chrome.png">
groups:
  - reporters
version_added: "2.7.0"
---

The **perf** reporter measures the duration of each QUnit test and each module, which you can then access in the browser dev tools to understand where time is spent during your test run.

This uses the [performance.measure()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure) method of the User Timing API, which adds each measure to the Performance Timeline.

## Browser usage

QUnit enables the perf reporter by default in [Browser](../../browser.md) environments. The measures are automatically included in Firefox Profiler and Chrome DevTools (Safari is pending [WebKit #213870](https://bugs.webkit.org/show_bug.cgi?id=213870)).

```
QUnit Test Run
└── QUnit Test Suite: Example
    ├── QUnit Test: apple
    ├── QUnit Test: banana
    └── QUnit Test: citron
```

<figure>
  <img alt="QUnit profiling in Chrome DevTools Performance tab" src="/resources/perf-chrome.png">
  <figcaption>Chrome</figcaption>
</figure>

-------

<figure>
  <img alt="QUnit performance in Firefox Profiler" src="/resources/perf-firefox.png">
  <figcaption>Firefox</figcaption>
</figure>

## Node.js usage

The Web Performance API is also [available in Node.js](https://nodejs.org/docs/latest/api/perf_hooks.html), and the QUnit perf reporter can be enabled in Node.js since QUnit 3.0.

You can enable it in the QUnit CLI via `--reporter perf`, or activate it explicitly from a [setup file](../../cli.md#--require) as:

```js
QUnit.reporters.perf.init(QUnit);
```

**Note:** As of 2025, the [Node.js inspector](https://nodejs.org/docs/latest/api/debugger.html#v8-inspector-integration-for-nodejs) does not yet send User Timing measures to Chrome DevTools ([upstream nodejs/node#47813](https://github.com/nodejs/node/issues/47813)).

This means that you _can_ retrieve the QUnit measures from [`performance.getEntries()`](https://nodejs.org/docs/latest/api/perf_hooks.html) and export or visualise them with tooling of your own (e.g. from a [runEnd event](../callbacks/QUnit.on.md#the-runend-event), or via a PerformanceObserver).

But, when connecting Chrome DevTools to a Node.js process, these are not currently visualised. If you currently test frontend code for browsers via jsdom in Node.js, consider [testing in a real browser](../../browser.md) instead.

## Changelog

| UNRELEASED | Exposed separately via `qunit --reporter` on the CLI, via `QUnit.reporters.perf` for progammatic use in Node.js, and declaratively via [`QUnit.config.reporters`](../config/reporters.md).
| [QUnit 2.7.0](https://github.com/qunitjs/qunit/releases/tag/2.7.0) | Introduced as part of the HTML Reporter, always enabled.
