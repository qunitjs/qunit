---
layout: post
title: "Early error reporting"
author: krinkle
excerpt: Early errors.
tags:
- feature
---

## What is an "early" error?

Early errors are errors when loading source code or test files, outside and before the first test.

For example, a syntax error in a source file. Or an uncaught error while defining exports from your source files. Or an early error from a test file, such as if you misspell an import, or call an undefined function in top-level code outside your [`QUnit.test()`]({% link api/QUnit/test.md %}) cases.

## Status quo

In both QUnit 1.x and 2.x, "early" errors are reporter to the browser console, but not displayed in the UI of the HTML Reporter.

Until now, the HTML Reporter initialized the UI during the [`QUnit.begin()`]({% link api/callbacks/QUnit.begin.md %}) event. This fires after your source and test files are loaded, before the first test begins. This approach is **simple** and **robust**.

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

Initializing the UI from a `QUnit.begin()` event, is akin to waiting for the DOM-ready or `window.onload` event, and means we simply look for the `<div id="qunit">` element and either safely append the UI, or decide definitively that we're running headless with the UI [turned off]({% link api/reporters/html.md %}).

However, this also meant that if we receive an early `error` event, the page remains blank.


[`error` event]({% link api/callbacks/QUnit.on.md %}#the-error-event)



## Instant rendering



## See also

* [QUnit 2.24.1 Released: Add memory to the "error" event]({% post_url 2025-01-25-qunit-2-24-1 %})
* [Add support for displaying early errors · Pull Request #1786](https://github.com/qunitjs/qunit/pull/1786)
