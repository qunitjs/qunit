---
layout: page-api
title: QUnit.module()
excerpt: Group related tests under a common label.
groups:
  - main
redirect_from:
  - "/QUnit.module/"
  - "/QUnit/module/"
  - "/module/"
version_added: "1.0.0"
---

`QUnit.module( name )`<br>
`QUnit.module( name, scope )`<br>
`QUnit.module( name, options )`<br>
`QUnit.module( name, options, scope )`

Group related tests under a common label.

| parameter | description |
|-----------|-------------|
| `name` (string) | Label for this group of tests. |
| [`options`](#options-object) (object) | Set hook callbacks. |
| [`scope`](#module-scope) (function) | A scope for tests, nested modules, and/or hooks. |

All tests inside a module will be grouped under that module. Tests can be added to a module using the [QUnit.test](./test.md) method. Modules help organize, select, and filter tests to run. See [§ Examples](#examples).

Modules can be nested inside other modules via a [module scope](#module-scope). In the output, tests are generally prefixed by the names of all parent modules. E.g. "Grandparent > Parent > Child > my test".

The `QUnit.module.only()`, `QUnit.module.skip()`, and `QUnit.module.todo()` methods are aliases for `QUnit.module()` that apply the behaviour of [`QUnit.test.only()`](./test.only.md), [`QUnit.test.skip()`](./test.skip.md) or [`QUnit.test.todo()`](./test.todo.md) to all a module's tests at once.

<span id="nested-scope"></span><span id="nested-module-scope"></span>

### Module scope

The module scope can be used to group tests under a common label. These can be nested to create child modules under a common parent module.

The module scope is given a `hooks` object which can be used to add [hooks](#hooks).

| parameter | description |
|-----------|-------------|
| `hooks` (object) | An object for adding hooks. |

Example:

```js
QUnit.module('Group A', hooks => {
  QUnit.test('basic test example', assert => {
    assert.true(true, 'this is fine');
  });

  QUnit.test('basic test example 2', assert => {
    assert.true(true, 'this is also fine');
  });
});

QUnit.module('Group B', hooks => {
  QUnit.test('basic test example 3', assert => {
    assert.true(true, 'this is fine');
  });

  QUnit.test('basic test example 4', assert => {
    assert.true(true, 'this is also fine');
  });
});
```

### Hooks

You can use hooks to prepare fixtures, or run other setup and teardown logic. Hooks can run around individual tests, or around a whole module.

* `before`: Run a callback before the first test.
* `beforeEach`: Run a callback before each test.
* `afterEach`: Run a callback after each test.
* `after`: Run a callback after the last test.

You can add hooks via the `hooks` parameter to any [module scope](#module-scope) callback, or by setting a key in the [module `options`](#options-object). You can also create global hooks across all tests, via [QUnit.hooks](./hooks.md).

Hooks that are added to a module, will also apply to tests in any nested modules.

#### Hook order

_See also [§ Example: Hooks on nested modules](#hooks-on-nested-modules)._

Hooks that run _before_ a test, are ordered from outer-most to inner-most, in the order that they are added. This means that a test will first run any global beforeEach hooks, then the hooks of parent modules, and finally the hooks added to the current module that the test is part of.

Hooks that run _after_ a test, are ordered from inner-most to outer-most, in the reverse order. In other words, `before` and `beforeEach` callbacks are processed in a [queue][], while `afterEach` and `after` form a [stack][].

[queue]: https://en.wikipedia.org/wiki/Queue_%28abstract_data_type%29
[stack]: https://en.wikipedia.org/wiki/Stack_%28abstract_data_type%29

#### Hook callback

A hook callback may be an async function, and may return a Promise or any other then-able. QUnit will automatically wait for your hook's asynchronous work to finish before continuing to execute the tests. [§ Example: Async hook callback](#async-hook-callback).

Each hook has access to the same `assert` object, and test context via `this`, as the [QUnit.test](./test.md) that the hook is running for. [§ Example: Using the test context](#using-the-test-context).

| parameter | description |
|-----------|-------------|
| `assert` (object) | An [Assert](../assert/index.md) object. |

<p class="note" markdown="1">It is discouraged to dynamically create a [QUnit.test](./test.md) from inside a hook. In order to satisfy the requirement for the `after` hook to only run once and to be the last hook in a module, QUnit may associate dynamically defined tests with the parent module instead, or as global test. It is recommended to define any dynamic tests via [`QUnit.begin()`](../callbacks/QUnit.begin.md) instead.</p>

### Options object

You can use the options object to add [hooks](#hooks).

| name | description |
|-----------|-------------|
| `before` (function) | Runs before the first test. |
| `beforeEach` (function) | Runs before each test. |
| `afterEach` (function) | Runs after each test. |
| `after` (function) | Runs after the last test. |

Properties on the module options object are copied over to the test context object at the start of each test. Such properties can also be changed from the hook callbacks. See [§ Using the test context](#using-the-test-context).

Example: [§ Hooks via module options](#hooks-via-module-options).

## Changelog

| [QUnit 2.4](https://github.com/qunitjs/qunit/releases/tag/2.4.0) | The `QUnit.module.only()`, `QUnit.module.skip()`, and `QUnit.module.todo()` aliases were introduced.
| [QUnit 2.0](https://github.com/qunitjs/qunit/releases/tag/2.0.0) | The `before` and `after` options were introduced.
| [QUnit 1.20](https://github.com/qunitjs/qunit/releases/tag/1.20.0) | The `scope` feature was introduced.
| [QUnit 1.16](https://github.com/qunitjs/qunit/releases/tag/1.16.0) | The `beforeEach` and `afterEach` options were introduced.<br/>The `setup` and `teardown` options were deprecated in QUnit 1.16 and removed in QUnit 2.0.

## Examples

### Organizing your tests

By default, if `QUnit.module` is called without a `scope` callback, all subsequently defined tests are automatically grouped into that module, until the next module is defined.

```js
QUnit.module('Group A');

QUnit.test('foo', function (assert) {
  assert.true(true);
});
QUnit.test('bar', function (assert) {
  assert.true(true);
});

QUnit.module('Group B');

QUnit.test('baz', function (assert) {
  assert.true(true);
});
QUnit.test('quux', function (assert) {
  assert.true(true);
});
```

Using modern syntax:

```js
QUnit.module('Group A');

QUnit.test('foo', assert => {
  assert.true(true);
});
QUnit.test('bar', assert => {
  assert.true(true);
});

QUnit.module('Group B');

QUnit.test('baz', assert => {
  assert.true(true);
});
QUnit.test('quux', assert => {
  assert.true(true);
});
```

### Async hook callback

```js
QUnit.module('Database connection', function (hooks) {
  hooks.before(async function () {
    await MyDb.connect();
  });

  hooks.after(async function () {
    await MyDb.disconnect();
  });
});
```

<span id="module-hook-with-promise"></span>Module hook with Promise:

An example of handling an asynchronous `then`able Promise result in hooks. This example uses an [ES6 Promise][] interface that is fulfilled after connecting to or disconnecting from database.

[ES6 Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

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

### Hooks on nested modules

_Back to [§ Hook order](#hook-order)._

```js
QUnit.module('My Group', hooks => {
  // You may call hooks.beforeEach() multiple times to create multiple hooks.
  hooks.beforeEach(assert => {
    assert.ok(true, 'beforeEach called');
  });

  hooks.afterEach(assert => {
    assert.ok(true, 'afterEach called');
  });

  QUnit.test('with hooks', assert => {
    // 1 x beforeEach
    // 1 x afterEach
    assert.expect(2);
  });

  QUnit.module('Nested Child', hooks => {
    // This will run after the parent module's beforeEach hook
    hooks.beforeEach(assert => {
      assert.ok(true, 'nested beforeEach called');
    });

    // This will run before the parent module's afterEach hook
    hooks.afterEach(assert => {
      assert.ok(true, 'nested afterEach called');
    });

    QUnit.test('with nested hooks', assert => {
      // 2 x beforeEach (parent, child)
      // 2 x afterEach (child, parent)
      assert.expect(4);
    });
  });
});
```

### Hooks via module options

```js
QUnit.module('module A', {
  before: function () {
    // prepare something once for all tests
  },
  beforeEach: function () {
    // prepare something before each test
  },
  afterEach: function () {
    // clean up after each test
  },
  after: function () {
    // clean up once after all tests are done
  }
});
```

### Using the test context

The test context object is exposed to hook callbacks.

```js
QUnit.module('Maker', {
  beforeEach: function () {
    this.parts = ['A', 'B'];
  }
});

QUnit.test('make alphabet', function (assert) {
  this.parts.push('C');
  assert.equal(this.parts.join(''), 'ABC');
});

QUnit.test('make music', function (assert) {
  this.parts.push('B', 'A');
  assert.equal(this.parts.join(''), 'ABBA');
});
```

The test context is also available when using a module scope. Beware that use of the `this` binding is not available in arrow functions.

```js
QUnit.module('Maker', hooks => {
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

It might be more convenient to use JavaScript's own lexical scope instead:

```js
QUnit.module('Machine Maker', hooks => {
  let maker;
  let parts;
  hooks.beforeEach(() => {
    maker = new Maker();
    parts = ['wheels', 'motor', 'chassis'];
  });

  QUnit.test('makes a robot', assert => {
    parts.push('arduino');
    assert.equal(maker.build(parts), 'robot');
    assert.deepEqual(maker.log, ['robot']);
  });

  QUnit.test('makes a car', assert => {
    assert.equal(maker.build(parts), 'car');
    maker.duplicate();
    assert.deepEqual(maker.log, ['car', 'car']);
  });
});
```

### Only run a subset of tests

Use `QUnit.module.only()` to treat an entire module's tests as if they used [`QUnit.test.only`](./test.only.md) instead of [`QUnit.test`](./test.md).

```js
QUnit.module('Robot', hooks => {
  // ...
});

// When developing the feature, only run these tests,
// and skip tests from other modules.
QUnit.module.only('Android', hooks => {
  let android;
  hooks.beforeEach(() => {
    android = new Android();
  });

  QUnit.test('hello', assert => {
    assert.strictEqual(android.hello(), 'Hello, my name is AN-2178!');
  });
});
```

Use `QUnit.module.skip()` to treat an entire module's tests as if they used [`QUnit.test.skip`](./test.skip.md) instead of [`QUnit.test`](./test.md).

```js
QUnit.module('Robot', hooks => {
  // ...
});

// Skip this module's tests.
// For example if the android tests are failing due to unsolved problems.
QUnit.module.skip('Android', hooks => {
  let android;
  hooks.beforeEach(() => {
    android = new Android();
  });

  QUnit.test('hello', assert => {
    assert.strictEqual(android.hello(), 'Hello, my name is AN-2178!');
  });
});
```

Use `QUnit.module.todo()` to denote a feature that is still under development, and is known to not yet be passing all its tests. This treats an entire module's tests as if they used [`QUnit.test.todo`](./test.todo.md) instead of [`QUnit.test`](./test.md).

```js
QUnit.module.todo('Android', hooks => {
  let android;
  hooks.beforeEach(() => {
    android = new Android();
  });

  QUnit.test('hello', assert => {
    assert.strictEqual(android.hello(), 'Hello');
    // TODO: hello
    // Actual: Goodbye
    // Expected: Hello
  });
});
```

### Error: Cannot add hook outside the containing module {#E0002}

If you encounter this error, it means you have called `hooks.beforeEach()` or `hooks.afterEach()` on the "hooks" parameter of a module outside the current module scope. Detection of this issue was [introduced](https://github.com/qunitjs/qunit/issues/1576) in QUnit 3.0.

```
Error: Cannot add beforeEach hook outside the containing module.
```
```
Error: Cannot add afterEach hook outside the containing module.
Called on "X", instead of expected "Y".
```

This can happen if you use a module scope and forget to specify the `hooks` parameter on the inner scope:

```js
QUnit.module('MyGroup', (hooks) => {
  QUnit.module('Child', () => {
    //                  ^ Oops, forgot "hooks" here!

    hooks.beforeEach(() => {
      // ...
    });

    QUnit.test('example');
  });
});
```

Another way that this might happen is if you have named them differently, or perhaps mispelled one, and are referring to the outer parameter from the inner module. Is is recommended to name hooks parameters the same, as this will naturally refer to the correct and closest one always, thus avoiding any mistake.

```js
QUnit.module('MyGroup', (hooksOuter) => {
  QUnit.module('Child', (hooksInner) => {
    hooksOuter.beforeEach(() => {
      // ^ Oops, used "hooksOuter" instead of "hooksInner"!
    });

    QUnit.test('example');
  });
});
```
