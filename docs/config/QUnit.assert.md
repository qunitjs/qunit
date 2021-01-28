---
layout: default
title: QUnit.assert
excerpt: Namespace for QUnit assertion methods.
categories:
  - config
version_added: "1.7"
---

Namespace for QUnit assertion methods. This object is the prototype for the internal Assert class of which instances are passed as the argument to [`QUnit.test()`](../QUnit/test.md) callbacks.

This object contains QUnit's [built-in assertion methods](../assert/index.md), and may be extended by plugins to register additional assertion methods.

See [`assert.pushResult()`](../assert/pushResult.md) for how to create a custom assertion.
