---
layout: post
title: "Early error reporting"
author: krinkle
excerpt: Early errors.
tags:
- feature
---

In QUnit 2, early errors are reported to the browser console, but not displayed in the UI.

QUnit 3 improves on this in two ways: **event memory**, and **instant** rendering.

## Comparison

<figure><iframe height="500" style="width: 100%;" scrolling="no" title="Early error demo (QUnit 2.25)" src="https://codepen.io/Krinkle/embed/YPwNypz?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true">See <a href="https://codepen.io/Krinkle/pen/YPwNypz">Early error demo (QUnit 2.25)</a> on <a href="https://codepen.io">CodePen</a>.</iframe><figcaption>In QUnit 2.25.0, early errors trigger a "failed" status, but the details are limited to the console.</figcaption></figure>

<figure><iframe height="500" style="width: 100%;" scrolling="no" title="Early error demo (QUnit 3.0)" src="https://codepen.io/Krinkle/embed/dPXpaXZ?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true">See <a href="https://codepen.io/Krinkle/pen/dPXpaXZ">Early error demo (QUnit 3.0)</a> on <a href="https://codepen.io">CodePen</a>.</iframe><figcaption>QUnit 3.0 includes full details of early errors.</figcaption></figure>

## What is an "early" error?

Early errors are errors when loading source code or test files, outside and before the first test.

For example:

* a syntax error in a source file,
* an uncaught error while defining exports from your source files,
* an uncaught error from top-level code in your test files, outside your [`QUnit.test()`]({% link api/QUnit/test.md %}) cases, such as a misspelled import. 

## Status quo

Until now, the HTML Reporter initialized the UI during the [`QUnit.begin()`]({% link api/callbacks/QUnit.begin.md %}) event. This fires after your source and test files are loaded, before the first test begins. This approach is simple and robust.

We generally recommend loading styles from the HTML head, and scripts from the end of the body:

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

Initializing the UI from a `QUnit.begin()` event, is akin to waiting for the DOM-ready or `window.onload` event. We simply look for the `<div id="qunit">` element and either, safely append the UI, or decide definitively that we're running headless with the UI [turned off]({% link api/reporters/html.md %}).

However this meant that for early `error` events the page remains blank, because there is no UI to report it in.


## Instant rendering

…

## Event memory

The redesigned HTML Reporter in QUnit 3.0 leverages 

QUnit 2.24.1 added memory to the [`error` event]({% link api/callbacks/QUnit.on.md %}#the-error-event).


## See also

* [QUnit 2.24.1 Released: Add memory to the "error" event]({% post_url 2025-01-25-qunit-2-24-1 %})
* [Add support for displaying early errors · Pull Request #1786](https://github.com/qunitjs/qunit/pull/1786)
