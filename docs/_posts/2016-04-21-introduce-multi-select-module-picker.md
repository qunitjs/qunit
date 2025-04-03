---
layout: post
title: "Introduce multi-select module picker"
author: Maciej Lato, Richard Gibson
tags:
- feature
---

Introduce a multi-select module dropdown, to replace the module selector.

## Features

This replaces the module select dropdown with a dropdown that opens up into a multi-selector.

* Multi-select window with checkboxes and scrolling.
* Search box for filtering by module or test name.
* "Apply" button to run selected tests or modules.
* "Reset" button to clear selection, returning to implied default of "Select all".

## Accessibility

* Display current module section (comma-separated) in placeholder and tooltip text.
* Close on Escape keydown.

<figure>
<figcaption markdown="span">[QUnit 1.23.1 demo](https://codepen.io/Krinkle/full/QwLZWWe)</figcaption>
<img alt="" width="614" src="https://github.com/user-attachments/assets/d2377b8e-2e1e-4d2f-b0e8-d455cc59bd78">
</figure>

<figure>
<figcaption markdown="span">[QUnit 2.0.0 demo](https://codepen.io/Krinkle/full/mybzddj)</figcaption>
<img alt="" width="740" src="https://github.com/user-attachments/assets/fcfd3fb2-3b43-4177-a8cf-b89f0b1eea88">
</figure>

## See also

* [Update UI to allow multiple test/module selection · Issue #953](https://github.com/qunitjs/qunit/issues/953)
* [HTML Reporter: Add multi-select module dropdown · Pull Request #973](https://github.com/qunitjs/qunit/pull/973)
* [HTML Reporter: Improve toolbar styles & accessibility · Pull Request #989](https://github.com/qunitjs/qunit/pull/989)
* [QUnit 2.0.0 Release]({% post_url 2016-06-16-qunit-2-0-0 %})
