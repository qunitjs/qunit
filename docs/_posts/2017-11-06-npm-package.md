---
layout: post
title: 'QUnit is now "qunit" on NPM'
author: trentmwillis
tags:
- link
---

<p class="note" markdown="1">IMPORTANT: QUnit is now being published as "qunit" on NPM! Previously, we were publishing as "qunitjs".</p>

The old "qunit" package was a CLI tool that came into existence prior to a built-in CLI. That package is now published as "node-qunit".

Transitioning should be simple. If you are using `qunitjs@2.4.1` you just need to drop the "js"; we have republished 2.4.1 as `qunit@2.4.1`.

We hope this will help fix some confusion over package names moving forward :)

<https://www.npmjs.com/package/qunit>

-------

_Originally published on [Twitter](https://twitter.com/qunitjs/status/927346245437308928)._
