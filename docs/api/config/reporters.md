---
layout: page-api
title: QUnit.config.reporters
excerpt: Control which reporters to enable or disable.
groups:
  - config
redirect_from:
  - "/config/reporters/"
version_added: "unreleased"
---

Control which reporters to enable or disable.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`Object<string,bool>`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`{}`</td>
</tr>
</table>

## Built-in reporters

### tap

The **tap** reporter is a [TAP compliant](https://testanything.org/) reporter. This is the default in the [QUnit CLI](../../cli.md). This allows you to pair QUnit with many [TAP-based reporters](https://github.com/sindresorhus/awesome-tap#reporters), by piping the output. For example:

```sh
qunit test/ | tap-min
```

### console

The **console** reporter logs a JSON object for each reporter event from [`QUnit.on`](./api/callbacks/QUnit.on.md). Use this to explore or debug the Reporter API.

```
runStart {…}
testStart {…}
testEnd {…}
testStart {…}
testEnd {…}
runEnd {…}
```

### perf

The **perf** reporter emits measures for the duration of each QUnit test and each module via the Web Performance API. This allows you to visualize where time is spent during your test run. This uses the [performance.measure()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/measure) method internally. QUnit enables the perf reporter by default in [Browser](../../browser.md) environments. The measures are included in Firefox Profiler and Chrome DevTools (Safari is pending [WebKit #213870](https://bugs.webkit.org/show_bug.cgi?id=213870)).

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


The Web Performance API is also [available in Node.js](https://nodejs.org/docs/latest/api/perf_hooks.html) and the QUnit perf reporter can be enabled in Node.js. You can enable it in the QUnit CLI via `--reporter perf`. Note that the [Node.js inspector](https://nodejs.org/docs/latest/api/debugger.html#v8-inspector-integration-for-nodejs) does not yet send these to Chrome DevTools ([upstream nodejs/node#47813](https://github.com/nodejs/node/issues/47813)).


### html

The **html** reporter renders a toolbar and visualizes test results. This is the default in [Browser](../../browser.md) environments, and is documented at [HTML Reporter](../../browser.md#markup).

## Examples

By default, the [HTML Reporter](../../browser.md) is automatically enabled in browser environments if a `<div id="qunit">` element exists, and it remains disabled ("headless") if such element doesn't exist. You can override this to disable the HTML Reporter even if the element does exist.

For example, you can share the same HTML file for both manual testing and CI test runs, and have the CI test run disable the HTML Reporter for improved performance.

```js
// Set preconfig before loading qunit.js.
qunit_config_reporters_html = false;
qunit_config_reporters_perf = false;

// Or, disable at runtime (after qunit.js, but before the first test, i.e. runStart event).
QUnit.config.reporters.html = false;
QUnit.config.reporters.perf = false;
```

Declaratively enable the TAP reporter in a browser environment:

```js
// Set preconfig before loading qunit.js.
qunit_config_reporters_tap = true;
```

## See also

* [Preconfig](./index.md#preconfiguration)
* [QUnit Reporter API](../callbacks/QUnit.on.md#reporter-api)
