---
layout: post
title: "Instant rendering and early errors in QUnit 3"
author: krinkle
excerpt: Early errors.
tags:
- feature
---

QUnit 3 renders the UI significantly faster, and allows early errors to be displayed in the UI for the first time.

## Comparison

<figure><iframe height="500" style="width: 100%;" scrolling="no" title="Early error demo (QUnit 2.25)" src="https://codepen.io/Krinkle/embed/YPwNypz?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true">See <a href="https://codepen.io/Krinkle/pen/YPwNypz">Early error demo (QUnit 2.25)</a> on <a href="https://codepen.io">CodePen</a>.</iframe><figcaption>In QUnit 2.25.0, early errors trigger a "failed" status, but the details were only logged to the console.</figcaption></figure>

<figure><iframe height="500" style="width: 100%;" scrolling="no" title="Early error demo (QUnit 3.0)" src="https://codepen.io/Krinkle/embed/dPXpaXZ?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true">See <a href="https://codepen.io/Krinkle/pen/dPXpaXZ">Early error demo (QUnit 3.0)</a> on <a href="https://codepen.io">CodePen</a>.</iframe><figcaption>QUnit 3.0 includes full details of early errors.</figcaption></figure>

## What is an "early" error?

Early errors are errors when loading source code or test files, before we run your first test.

For example:

* a syntax error in a source file,
* an uncaught error when defining exports from your source files,
* an uncaught error from top-level code in your test files, outside any [`QUnit.test()`]({% link api/QUnit/test.md %}) function, such as an undefined variable or missing import. 

## Status quo

Until now, the HTML Reporter initialized the UI during the [`QUnit.begin()`]({% link api/callbacks/QUnit.begin.md %}) event. This event fires after loading your source code and test files, right before the first test begins.

This was simple and robust, but also meant we left the page blank until that point. And, if there is an early error, we have no UI to display it in!

We've long recommended to load styles from the HTML head, and scripts from the end of the body:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>QUnit</title>
  <link rel="stylesheet" href="lib/qunit/qunit.css">
</head>
<body>
  <div id="qunit"></div>

  <script src="lib/qunit/qunit.js"></script>
  <!-- <script src="src/my_project.js"></script> -->
  <!-- <script src="test/my_project.test.js"></script> -->
</body>
</html>
```

But, QUnit works regardless of HTML order. Older projects often load scripts from the HTML `<head>`, before the `<div id="qunit">` element. Like so:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>QUnit</title>
  <link rel="stylesheet" href="lib/qunit/qunit.css">
  <script src="lib/qunit/qunit.js"></script>
  <!-- <script src="src/my_project.js"></script> -->
  <!-- <script src="test/my_project.test.js"></script> -->
</head>
<body>
  <div id="qunit"></div>
</body>
</html>
```

Initializing the UI from the `QUnit.begin()` event meant the DOM is ready. If you define a `<div id="qunit">` element, we'll find it and append the UI, and if not, we know that you didn't and can leave the UI [turned off]({% link api/reporters/html.md %}).

## Instant rendering

If your test page follows the recommended HTML order, QUnit 3.0 will now render the UI instantly, while your files continue loading. This means early errors always have a place to go!

This builds on the the [Fast & fuzzy module selector]({% post_url 2022-04-16-redesign-module-selector %}) optimization by Matthew Beale, released a few years ago back in QUnit 2.18.2. That allowed the module selector to render before we have a complete list of test modules.

This feature works out-of-the-box and does not limit or change how you can disable the HTML Reporter through [markup]({% link browser.md %}#markup) or [config]({% link api/reporters/html.md %}).

### Headless optimization

Faster headless execution, when [`id=qunit` element](https://qunitjs.com/browser/) does not exist. [#1711](https://github.com/qunitjs/qunit/issues/1711)

Faster "Hide passed" toggling on large test suites. [a729421411](https://github.com/qunitjs/qunit/commit/a7294214116ab5ec0e111b37c00cc7e2c16b4e1b)

## Event memory

The redesigned HTML Reporter in QUnit 3.0 is made possible by the event memory feature, added to the [`error` event]({% link api/callbacks/QUnit.on.md %}#the-error-event) in QUnit 2.24.1.

If your test page does not qualify for instant rendering, early errors are reliably rendered for you as well. When the UI is displayed, any prior errors are read from the buffer and included for you to debug.

## See also

* [Add support for displaying early errors · Pull Request #1786](https://github.com/qunitjs/qunit/pull/1786)
* [Add support for instant rendering · Pull Request #1793](https://github.com/qunitjs/qunit/pull/1793)
* [Blog: Fast & fuzzy module selector]({% post_url 2022-04-16-redesign-module-selector %})
* [Blog: QUnit 2.24.1 - Add memory to the "error" event]({% post_url 2025-01-25-qunit-2-24-1 %})
* [Blog: QUnit 2.19.0 - Faster HTML startup]({% post_url 2022-04-28-qunit-2-19-0 %})
* [Blog: QUnit 2.18.2 - Instant module filter]({% post_url 2022-04-17-qunit-2-18-2 %})
* [Blog: QUnit 2.7.0 - HTML Reporter Performance]({% post_url 2018-10-10-qunit-2-7-0 %})
