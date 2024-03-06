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
`QUnit.module( name, nested )`<br>
`QUnit.module( name, options )`<br>
`QUnit.module( name, options, nested )`

Group related tests under a common label.

| parameter | description |
|-----------|-------------|
| `name` (string) | Label for this group of tests. |
| [`options`](#options-object) (object) | Set hook callbacks. |
| [`nested`](#nested-scope) (function) | A scope to create nested modules and/or add hooks functionally. |

All tests inside a module will be grouped under that module. Tests can be added to a module using the [QUnit.test](./test.md) method. Modules help organize, select, and filter tests to run. See [§ Organizing your tests](#organizing-your-tests).

Modules can be nested inside other modules. In the output, tests are generally prefixed by the names of all parent modules. E.g. "Grandparent > Parent > Child > my test". See [§ Nested module scope](#nested-module-scope).

The `QUnit.module.only()`, `QUnit.module.skip()`, and `QUnit.module.todo()` methods are aliases for `QUnit.module()` that apply the behaviour of [`QUnit.test.only()`](./test.only.md), [`QUnit.test.skip()`](./test.skip.md) or [`QUnit.test.todo()`](./test.todo.md) to all a module's tests at once.

### Hooks

You can use hooks to prepare fixtures, or run other setup and teardown logic. Hooks can run around individual tests, or around a whole module.

* `before`: Run a callback before the first test.
* `beforeEach`: Run a callback before each test.
* `afterEach`: Run a callback after each test.
* `after`: Run a callback after the last test.

You can add hooks via the `hooks` parameter of a [scoped module](#nested-scope), or in the module [`options`](#options-object) object, or globally for all tests via [QUnit.hooks](./hooks.md).

Hooks that are added to a module, will also apply to tests in any nested modules.

Hooks that run _before_ a test, are ordered from outer-most to inner-most, in the order that they are added. This means that a test will first run any global beforeEach hooks, then the hooks of parent modules, and finally the hooks added to the immediate module the test is a part of. Hooks that run _after_ a test, are ordered from inner-most to outer-most, in the reverse order. In other words, `before` and `beforeEach` callbacks form a [queue][], while `afterEach` and `after` form a [stack][].

[queue]: https://en.wikipedia.org/wiki/Queue_%28abstract_data_type%29
[stack]: https://en.wikipedia.org/wiki/Stack_%28abstract_data_type%29

#### Hook callback

A hook callback may be an async function, and may return a Promise or any other then-able. QUnit will automatically wait for your hook's asynchronous work to finish before continuing to execute the tests.

Each hook has access to the same `assert` object, and test context via `this`, as the [QUnit.test](./test.md) that the hook is running for. Example: [§ Using the test context](#using-the-test-context).

| parameter | description |
|-----------|-------------|
| `assert` (object) | An [Assert](../assert/index.md) object. |

<p class="note" markdown="1">It is discouraged to dynamically create a new [QUnit.test](./test.md) from within a hook. In order to satisfy the requirement for the `after` hook to only run once and to be the last hook in a module, QUnit may associate dynamically defined tests with the parent module instead, or as global test. It is recommended to define any dynamic tests via [`QUnit.begin()`](../callbacks/QUnit.begin.md).</p>

### Options object

You can use the options object to add [hooks](#hooks).

| name | description |
|-----------|-------------|
| `before` (function) | Runs before the first test. |
| `beforeEach` (function) | Runs before each test. |
| `afterEach` (function) | Runs after each test. |
| `after` (function) | Runs after the last test. |

Properties on the module options object are copied over to the test context object at the start of each test. Such properties can also be changed from the hook callbacks. See [§ Using the test context](#using-the-test-context).

Example: [§ Declaring module options](#declaring-module-options).

### Nested scope

Modules can be nested to group tests under a common label within a parent module.

The module scope is given a `hooks` object which can be used to procedurally add [hooks](#hooks).

| parameter | description |
|-----------|-------------|
| `hooks` (object) | An object for adding hooks. |

Example: [§ Nested module scope](#nested-module-scope).

## Changelog

| [QUnit 2.4](https://github.com/qunitjs/qunit/releases/tag/2.4.0) | The `QUnit.module.only()`, `QUnit.module.skip()`, and `QUnit.module.todo()` aliases were introduced.
| [QUnit 2.0](https://github.com/qunitjs/qunit/releases/tag/2.0.0) | The `before` and `after` options were introduced.
| [QUnit 1.20](https://github.com/qunitjs/qunit/releases/tag/1.20.0) | The `nested` scope feature was introduced.
| [QUnit 1.16](https://github.com/qunitjs/qunit/releases/tag/1.16.0) | The `beforeEach` and `afterEach` options were introduced.<br/>The `setup` and `teardown` options were deprecated in QUnit 1.16 and removed in QUnit 2.0.

## Examples

### Organizing your tests

If `QUnit.module` is called without a `nested` callback argument, all subsequently defined tests will be grouped into that module until another module is defined.

```js
QUnit.module('Group A');

QUnit.test('basic test example 1', function (assert) {
  assert.true(true, 'this is fine');
});
QUnit.test('basic test example 2', function (assert) {
  assert.true(true, 'this is also fine');
});

QUnit.module('Group B');

QUnit.test('basic test example 3', function (assert) {
  assert.true(true, 'this is fine');
});
QUnit.test('basic test example 4', function (assert) {
  assert.true(true, 'this is also fine');
});
```

Using modern syntax:

```js
const { test } = QUnit;

QUnit.module('Group A');

test('basic test example', assert => {
  assert.true(true, 'this is fine');
});
test('basic test example 2', assert => {
  assert.true(true, 'this is also fine');
});

QUnit.module('Group B');

test('basic test example 3', assert => {
  assert.true(true, 'this is fine');
});
test('basic test example 4', assert => {
  assert.true(true, 'this is also fine');
});
```

### Declaring module options

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

### Nested module scope

```js
const { test } = QUnit;

QUnit.module('Group A', hooks => {
  test('basic test example', assert => {
    assert.true(true, 'this is fine');
  });

  test('basic test example 2', assert => {
    assert.true(true, 'this is also fine');
  });
});

QUnit.module('Group B', hooks => {
  test('basic test example 3', assert => {
    assert.true(true, 'this is fine');
  });

  test('basic test example 4', assert => {
    assert.true(true, 'this is also fine');
  });
});
```

### Hooks on nested modules

Use `before`/`beforeEach` hooks are queued for nested modules. `after`/`afterEach` hooks are stacked on nested modules.

```js
const { test } = QUnit;

QUnit.module('My Group', hooks => {
  // It is valid to call the same hook methods more than once.
  hooks.beforeEach(assert => {
    assert.ok(true, 'beforeEach called');
  });

  hooks.afterEach(assert => {
    assert.ok(true, 'afterEach called');
  });

  test('with hooks', assert => {
    // 1 x beforeEach
    // 1 x afterEach
    assert.expect(2);
  });

  QUnit.module('Nested Group', hooks => {
    // This will run after the parent module's beforeEach hook
    hooks.beforeEach(assert => {
      assert.ok(true, 'nested beforeEach called');
    });

    // This will run before the parent module's afterEach
    hooks.afterEach(assert => {
      assert.ok(true, 'nested afterEach called');
    });

    test('with nested hooks', assert => {
      // 2 x beforeEach (parent, current)
      // 2 x afterEach (current, parent)
      assert.expect(4);
    });
  });
});
```

### Using the test context

The test context object is exposed to hook callbacks.

```js
QUnit.module('Machine Maker', {
  beforeEach: function () {
    this.maker = new Maker();
    this.parts = ['wheels', 'motor', 'chassis'];
  }
});

QUnit.test('makes a robot', function (assert) {
  this.parts.push('arduino');
  assert.equal(this.maker.build(this.parts), 'robot');
  assert.deepEqual(this.maker.log, ['robot']);
});

QUnit.test('makes a car', function (assert) {
  assert.equal(this.maker.build(this.parts), 'car');
  this.maker.duplicate();
  assert.deepEqual(this.maker.log, ['car', 'car']);
});
```

The test context is also available when using the nested scope. Beware that use of the `this` binding is not available
in arrow functions.

```js
const { test } = QUnit;

QUnit.module('Machine Maker', hooks => {
  hooks.beforeEach(function () {
    this.maker = new Maker();
    this.parts = ['wheels', 'motor', 'chassis'];
  });

  test('makes a robot', function (assert) {
    this.parts.push('arduino');
    assert.equal(this.maker.build(this.parts), 'robot');
    assert.deepEqual(this.maker.log, ['robot']);
  });

  test('makes a car', function (assert) {
    assert.equal(this.maker.build(this.parts), 'car');
    this.maker.duplicate();
    assert.deepEqual(this.maker.log, ['car', 'car']);
  });
});
```

It might be more convenient to use JavaScript's own lexical scope instead:

```js
const { test } = QUnit;

QUnit.module('Machine Maker', hooks => {
  let maker;
  let parts;
  hooks.beforeEach(() => {
    maker = new Maker();
    parts = ['wheels', 'motor', 'chassis'];
  });

  test('makes a robot', assert => {
    parts.push('arduino');
    assert.equal(maker.build(parts), 'robot');
    assert.deepEqual(maker.log, ['robot']);
  });

  test('makes a car', assert => {
    assert.equal(maker.build(parts), 'car');
    maker.duplicate();
    assert.deepEqual(maker.log, ['car', 'car']);
  });
});
```

### Module hook with Promise

An example of handling an asynchronous `then`able Promise result in hooks. This example uses an [ES6 Promise][] interface that is fulfilled after connecting to or disconnecting from database.

[ES6 Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

```js
QUnit.module('Database connection', {
  before: function () {
    return new Promise(function (resolve, reject) {
      DB.connect(function (err) {
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
      DB.disconnect(function (err) {
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

### Only run a subset of tests

Use `QUnit.module.only()` to treat an entire module's tests as if they used [`QUnit.test.only`](./test.only.md) instead of [`QUnit.test`](./test.md).

```js
QUnit.module('Robot', hooks => {
  // ...
});

// Only execute this module when developing the feature,
// skipping tests from other modules.
QUnit.module.only('Android', hooks => {
  let android;
  hooks.beforeEach(() => {
    android = new Android();
  });

  QUnit.test('Say hello', assert => {
    assert.strictEqual(android.hello(), 'Hello, my name is AN-2178!');
  });

  QUnit.test('Basic conversation', assert => {
    android.loadConversationData({
      Hi: 'Hello',
      "What's your name?": 'My name is AN-2178.',
      'Nice to meet you!': 'Nice to meet you too!',
      '...': '...'
    });

    assert.strictEqual(
      android.answer("What's your name?"),
      'My name is AN-2178.'
    );
  });

  // ...
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

  QUnit.test('Say hello', assert => {
    assert.strictEqual(android.hello(), 'Hello, my name is AN-2178!');
  });

  QUnit.test('Basic conversation', assert => {
    // ...
    assert.strictEqual(
      android.answer('Nice to meet you!'),
      'Nice to meet you too!'
    );
  });

  // ...
});
```

Use `QUnit.module.todo()` to denote a feature that is still under development, and is known to not yet be passing all its tests. This treats an entire module's tests as if they used [`QUnit.test.todo`](./test.todo.md) instead of [`QUnit.test`](./test.md).

```js
QUnit.module.todo('Robot', hooks => {
  let robot;
  hooks.beforeEach(() => {
    robot = new Robot();
  });

  QUnit.test('Say', assert => {
    // Currently, it returns undefined
    assert.strictEqual(robot.say(), "I'm Robot FN-2187");
  });

  QUnit.test('Move arm', assert => {
    // Move the arm to point (75, 80). Currently, each throws a NotImplementedError
    robot.moveArmTo(75, 80);
    assert.deepEqual(robot.getPosition(), { x: 75, y: 80 });
  });

  // ...
});
```
