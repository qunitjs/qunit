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

All tests inside a module will be grouped under that module. Tests can be added to a module using the [QUnit.test](./test.md) method. Modules help organize, select, and filter tests to run.

Modules can be nested inside other modules via a [module scope](#module-scope). In the output, tests are generally prefixed by the names of all parent modules. E.g. "Grandparent > Parent > Child > my test".

`QUnit.module.only( name, … )`<br>
`QUnit.module.skip( name, … )`<br>
`QUnit.module.todo( name, … )`<br>
`QUnit.module.if( name, condition, … )`

These methods are aliases for `QUnit.module()` that apply the behaviour of [`QUnit.test.only()`](./test.only.md),  [`QUnit.test.skip()`](./test.skip.md), [`QUnit.test.todo()`](./test.todo.md), or [`QUnit.test.if()`](./test.if.md) to all a module's tests at once.

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

<span id="nested-scope"></span><span id="nested-module-scope"></span>

### Module scope

The module scope can be used to group tests under a common label. These can be nested to create child modules under a common parent module.

The module scope is given a `hooks` object which can be used to add [hooks](#hooks).

| parameter | description |
|-----------|-------------|
| `hooks` (object) | An object for adding hooks. |

Example:

```js
// Fruit > Berries > cowberry.
// Fruit > Berries > cranberry.
// Fruit > Melons > galia.
// Bread > bake.
// Bread > toast.
QUnit.module('Fruit', function (hooks) {
  QUnit.module('Berries', function (hooks) {
    QUnit.test('cowberry', function (assert) {
      assert.true(true);
    });

    QUnit.test('cranberry', function (assert) {
      assert.true(true);
    });
  });

  QUnit.module('Melons', function (hooks) {
    QUnit.test('galia', function (assert) {
      assert.true(true);
    });

    // ...
  });
});

QUnit.module('Bread', function (hooks) {
  QUnit.test('bake', function (assert) {
    assert.true(true);
  });

  QUnit.test('toast', function (assert) {
    assert.true(true);
  });
});
```

### Hooks

You can use hooks to run shared code for every test in a module.  Add hooks via the `hooks` parameter in the [module scope](#module-scope) (as demonstrated below), or via the module [options object](#options-object).

```js
QUnit.module('example', function (hooks) {
  hooks.before(function () {
    // once for all tests
  });

  hooks.beforeEach(function () {
    // before every test
  });

  hooks.afterEach(function () {
    // after every test
  });

  hooks.after(function () {
    // once after all tests are done
  });

  // define tests here...
});
```

Instead of preparing the same fixture code in every test, you can de-duplicate these steps by performing your setup steps in a  `beforeEach()` hook instead:

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

Use [`QUnit.hooks`](./hooks.md) to apply hooks globally to all modules in a project.

<figure>
<a href="{% link lifecycle.md %}"><img src="/resources/qunit-lifecycle-hooks-order.svg" width="338" height="450" alt=""></a>
<figcaption markdown="1">
Learn about execution order in the [Test lifecycle](../../lifecycle.md)
</figcaption>
</figure>

<span id="async-hook-callback"></span>

#### Hook callback

| parameter | description |
|-----------|-------------|
| `assert` (object) | An [Assert](../assert/index.md) object. |

Each hook for a given [QUnit.test](./test.md), has access to the same `assert` object, and the same `this` [test context](../../lifecycle.md#test-context), as the test function.

A hook callback may be an async function, or return a Promise or other then-able. QUnit will automatically wait for your hook's asynchronous work to finish before continuing to execute the tests.

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

See [Test lifecycle § Async hook callback](../../lifecycle.md#example-async-hook-callback) for how to return a Promise without modern async-await syntax.

<p class="note" markdown="1">It is discouraged to dynamically create a [QUnit.test](./test.md) from inside a hook. In order to satisfy the requirement for the `after` hook to only run once and to be the last hook in a module, QUnit may associate dynamically defined tests with the parent module instead, or as global test. It is recommended to define any dynamic tests via [`QUnit.begin()`](../callbacks/QUnit.begin.md) instead.</p>

<span id="hooks-via-module-options"></span>

### Options object

You can use the options object to add [hooks](#hooks).

| name | description |
|-----------|-------------|
| `before` (function) | Runs before the first test. |
| `beforeEach` (function) | Runs before each test. |
| `afterEach` (function) | Runs after each test. |
| `after` (function) | Runs after the last test. |

Any other properties on the module options object are copied into the base [test context](../../lifecycle.md#test-context) for the module, which each test inherits from. See also [Test lifecycle § Example: Set context via options](../../lifecycle.md#example-set-context-via-options).

```js
QUnit.module('example', {
  before () {
    // once for all tests
  },
  beforeEach () {
    // before every test
  },
  afterEach () {
    // after every test
  },
  after () {
    // once after all tests are done
  }
});
```

## Changelog

| [QUnit 2.22](https://github.com/qunitjs/qunit/releases/tag/2.22.0) | Added `QUnit.module.if()` alias.
| [QUnit 2.4](https://github.com/qunitjs/qunit/releases/tag/2.4.0) | Added `QUnit.module.only()`, `QUnit.module.skip()`, and `QUnit.module.todo()` aliases.
| [QUnit 2.0](https://github.com/qunitjs/qunit/releases/tag/2.0.0) | Added `before` and `after` options.<br/>The deprecated `setup` and `teardown` options were removed.
| [QUnit 1.20](https://github.com/qunitjs/qunit/releases/tag/1.20.0) | Introduce `scope` feature.
| [QUnit 1.16](https://github.com/qunitjs/qunit/releases/tag/1.16.0) | Added `beforeEach` and `afterEach` options.<br/>The `setup` and `teardown` options were deprecated in QUnit 1.16 and removed in QUnit 2.0.

## Examples

### Example: Skip a module

Use `QUnit.module.skip()` to treat an entire module's tests as if they used [`QUnit.test.skip`](./test.skip.md). For example, if a module is failing due to a known but unsolved problem.

```js
QUnit.module.skip('Robot', (hooks) => {
  let android;
  hooks.beforeEach(() => {
    android = new Robot();
  });

  QUnit.test('hello', (assert) => {
    assert.strictEqual(android.hello(), 'Hello, my name is AN-2178!');
  });
});
```

Use `QUnit.module.if()`, to conditionally skip an entire module. For example, if these tests are only meant to run in certain environments, operating systems, or when certain optional dependencies are installed.

```js
QUnit.module.if('MyApp', typeof document !== 'undefined', (hooks) => {
  QUnit.test('render', function (assert) {
    assert.strictEqual(MyApp.render(), '<p>Hello world!</p>');
  });
});
```

During development you can programatically focus QUnit to only run tests that you're currently working on, by changing a call to `QUnit.module.only()`. This treats an entire module as if their tests are defined via [`QUnit.test.only`](./test.only.md).

```js
QUnit.module.only('Robot', (hooks) => {
  let android;
  hooks.beforeEach(() => {
    android = new Robot();
  });

  QUnit.test('hello', (assert) => {
    assert.strictEqual(android.hello(), 'Hello, my name is AN-2178!');
  });
});
```

Use `QUnit.module.todo()` to mark a feature that is still under development, and is known to not yet be passing all its tests. This treats an entire module's tests as if they used [`QUnit.test.todo`](./test.todo.md).

```js
QUnit.module.todo('Robot', (hooks) => {
  let android;
  hooks.beforeEach(() => {
    android = new Robot();
  });

  QUnit.test('hello', (assert) => {
    assert.strictEqual(android.hello(), 'Hello');
    // TODO
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

Another way that this might happen is if you have named them differently, or perhaps misspelled one, and are referring to the outer parameter from the inner module. Is is recommended to name hooks parameters the same, as this will naturally refer to the correct and closest one always, thus avoiding any mistake.

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
