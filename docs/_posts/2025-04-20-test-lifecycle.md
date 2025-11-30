---
layout: post
title: "Test lifecycle diagram"
image: /resources/qunit-lifecycle-hooks-order.svg
author: krinkle
tags:
- feature
---

Ever wondered how beforeEach works in unit test frameworks?

## Test lifecycle

<figure>
<img src="/resources/qunit-lifecycle-hooks-order.svg" width="676" height="901" alt="" title="Imagine a test suite with global hooks, and a Parent and Child module that use hooks also. The execution order is:
1. Parent module runs the before hook.
2. Every test in the Parent module inherits context from the before hook, and repeats as follows: call global beforeEach, parent beforeEach, the actual test, parent afterEach, and lastly the global afterEach.
3. The Child module inherits context from the Parent before hook, and then runs its own before hook.
4. Every test in the Child module inherits context from this before hook, and repeats as follows: call global beforeEach, parent beforeEach, child beforeEach, the actual test, child afterEach, parent afterEach, and lastly the global afterEach.
">
<figcaption markdown="1">
Learn about the execution on the new [Test lifecycle](https://qunitjs.com/lifecycle/) page.
</figcaption>
</figure>

## Why

An experienced developer will find that test hooks work more or less the same in every JavaScript unit test framework. The execution order is also intuitive enough that most people answer correctly when they guess. So why explain it?

You shouldn't have to guess!

I think it's worth laying out explicitly, even if this is not unique to QUnit, because a new developer is going to encounter this for the first time.

But more importantly, by demonstrating that the order is stable and guaranteed, I hope this gives you the confidence to lean into it. Build on it! The new [Test lifecycle](https://qunitjs.com/lifecycle/) page showcases what's possible when you depend on this with intent: Nesting hooks, sharing hooks, [global hooks](https://qunitjs.com/api/QUnit/hooks/), and extending test context.

## Thanks

Thanks to FND, Jan D, and NullVoxPopuli for reviewing, improving, and promoting this work!

## See also

* [QUnit.module()](https://qunitjs.com/api/QUnit/module/)
* [Issue #1358](https://github.com/qunitjs/qunit/issues/1358)
