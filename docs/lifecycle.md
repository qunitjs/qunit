---
layout: page
title: Test lifecycle
excerpt: The order of module hooks and test context in QUnit.
amethyst:
  toc: true
---

<h2 id="diagram" class="screen-reader-text">Diagram</h2>

<p class="lead" markdown="1">

The execution order of module hooks in QUnit.

</p>

<figure>
<img src="/resources/qunit-lifecycle-hooks-order.svg" width="676" height="901" alt="" title="Imagine a test suite that uses global hooks,
and has a module called Parent that uses hooks and contains one test called Foo,
and a nested module called Child that also uses hooks and contains one test called Bar.
The execution order is as follows:
1. The Parent module runs its before hook exactly once.
2. Every test in the Parent module inherits the test context from this before hook.
3. This repeats for every test in the Parent module: call global beforeEach, parent beforeEach, actual test (Foo), parent afterEach, and lastly the global afterEach.
4. The Child module inherits context from the Parent's before hook, and runs its own before hook exactly once.
5. Every test in the Child module inherits test context from this before hook.
6. This repeats for every test in the Child module: call the global beforeEach, parent beforeEach, child beforeEach, actual test (Bar), child afterEach, parent afterEach, and lastly the global afterEach.
">
</figure>
## Module hooks

_See also: [QUnit.module § Hooks](./api/QUnit/module.md#hooks)_

You can define the following hooks via `QUnit.module()`:

* `before`: Add a callback before the first test, once per module.
* `beforeEach`: Add a callback before every test.
* `afterEach`: Add a callback after every test.
* `after`: Add a callback after the last test, once per module.

Hooks that run _before_ a test, are executed in the order that they are added (from outer-most to inner-most). This means that utilities and fixtures provided global hooks are safe to use during all tests, and also during the beforeEach hooks of all modules. Likewise, the same is true between a parent module and its child modules.

For example:

* first, any global beforeEach hooks from [`QUnit.module()`](./api/QUnit/hooks.md),
* then, the beforeEach hooks of any parent modules,
* then, the hooks of the current module.

Hooks that run _after_ a test, are executed in the reverse order (from inner-most to outer-most).

For example:

* first, the hooks of the current module,
* then, the afterEach hooks of any parent modules,
* then, any global afterEach hooks.

In technical terms, we say that `before` and `beforeEach` callbacks are processed using a [queue][] (handled in <abbr title="first-in, first-out">FIFO-order</abbr>), while `afterEach` and `after` form a [stack][] (handled in <abbr title="last-in, first-out">LIFO-order</abbr>).

[queue]: https://en.wikipedia.org/wiki/Queue_%28abstract_data_type%29
[stack]: https://en.wikipedia.org/wiki/Stack_%28abstract_data_type%29

### Example: Nested hooks

```js
QUnit.module('Foo', function (hooks) {
  var a, b;

  hooks.beforeEach(function () {
    a = 'Hello';
    b = 'world';
  });

  // You may add as many hooks as you need.
  hooks.beforeEach(function () {
    globalThis.MyApp = {
      greeting () {
        return `${a} ${b}`;
      }
    };
  });
  hooks.afterEach(function () {
    delete globalThis.MyApp;
  });

  QUnit.test('example', function (assert) {
    assert.equal(a, 'Hello');
    assert.equal(b, 'world');
    assert.equal(MyApp.greeting(), 'Hello world');

    a = 'Goodbye';
    assert.equal(MyApp.greeting(), 'Goodbye world');

    // The beforeEach hook will reset "a" back from "Goodbye" to "Hello",
    // before the next test begins.
  });

  QUnit.module('Bar Child', function (hooks) {
    let c;

    hooks.beforeEach(function (assert) {
      // The parent "beforeEach" hook runs first,
      // so its data and utilities are safe to use here.

      a += ' to this';
      c = 'Stranger';
    });

    QUnit.test('nested example', (assert) => {
      assert.equal(a, 'Hello to this');
      assert.equal(b, 'world');
      assert.equal(MyApp.greeting(), 'Hello to this world');

      assert.equal(c, 'Stranger');
    });
  });
});
```

## Example: Async hook callback

```js
QUnit.module('Database connection', function (hooks) {
  hooks.before(async function () {
    await MyDb.connect();
  });

  hooks.after(async function () {
    await MyDb.disconnect();
  });

  // define tests...
});
```

You can also define async hooks without modern async-await syntax, by returning a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or other "then"-able object:

```js
QUnit.module('Database connection', {
  before: function () {
    return new Promise(function (resolve, reject) {
      MyDb.connect(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  },
  after: function () {
    return new Promise(function (resolve, reject) {
      MyDb.disconnect(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
});
```

## Test context

Each test starts with a fresh copy of the test context as provided by the module. This is generally an empty object. The test context is available as `this` inside any [`QUnit.test()`](./api/QUnit/test.md) function or hook callbacks.

At the end of every test, changes to the test context are automatically reset (e.g. changes by tests or hooks). The next test will start with a fresh context provided by the module.

The `before` hook has access to the base object that tests and child modules inherit from. Properties set from here, are inherited without needing to re-create them on every test.

```js
QUnit.module('Maker', function (hooks) {
  hooks.beforeEach(function () {
    this.parts = ['A', 'B'];
  });

  QUnit.test('make alphabet', function (assert) {
    this.parts.push('C');
    assert.equal(this.parts.join(''), 'ABC');
  });

  QUnit.test('make music', function (assert) {
    this.parts.push('B', 'A');
    assert.equal(this.parts.join(''), 'ABBA');
  });
});
```

If you use arrow functions, beware that the `this` test context is not reachable from inside an arrow function. JavaScript does have a built-in lexical scope that you can use in a similar way. This works the same as a text context for simple cases (i.e. you assign all variables together in `beforeEach`).

```js
QUnit.module('Machine Maker', function (hooks) {
  let parts;
  hooks.beforeEach(function () {
    parts = ['A', 'B'];
  });

  QUnit.test('make alphabet', function (assert) {
    parts.push('C');
    assert.equal(parts.join(''), 'ABC');
  });

  QUnit.test('make music', function (assert) {
    parts.push('B', 'A');
    assert.equal(parts.join(''), 'ABBA');
  });
});
```

### Example: Set context via options

The following are equivalent:

```js
QUnit.module('example', {
  myparts: ['A', 'B']
});

QUnit.test('make alphabet', function (assert) {
  this.parts.push('C');
  assert.equal(this.parts.join(''), 'ABC');
});
```

Is essentially equivalent to:

```js
QUnit.module('example', {
  beforeEach () {
    this.myparts = ['A', 'B'];
  }
});

QUnit.test('make alphabet', function (assert) {
  this.parts.push('C');
  assert.equal(this.parts.join(''), 'ABC');
});
```