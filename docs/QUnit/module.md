---
layout: page-api
title: QUnit.module()
excerpt: Group related tests under a common label.
groups:
  - main
redirect_from:
  - "/QUnit.module/"
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
| [`options`](#options-object) (object) | Set hook callbacks to run before or after test execution. |
| [`nested`](#nested-scope) (function) | A scope to create nested modules and/or set hooks functionally. |

All tests inside a module will be grouped under that module. The test names will be preceded by the module name in the test results. Tests can be added to a module using the [QUnit.test](./test.md) method.

You can use modules to organize, select, and filter tests to run. See [§ Organizing your tests](#organizing-your-tests).

Modules can be nested inside other modules. In the output, tests are generally prefixed by the names of all parent modules. E.g. "Grantparent > Parent > Child > my test". See [§ Nested module scope](#nested-module-scope).

The `QUnit.module.only()`, `QUnit.module.skip()`, and `QUnit.module.todo()` methods are aliases for `QUnit.module()` that apply the behaviour of [`QUnit.test.only()`](./test.only.md), [`QUnit.test.skip()`](./test.skip.md) or [`QUnit.test.todo()`](./test.todo.md) to all a module's tests at once.

### Options object

You can use the options object to set hook callbacks to prepare fixtures, or run other setup and
teardown logic. These hooks can run around individual tests, or around a whole module.

| name | description |
|-----------|-------------|
| `before` (function) | Runs before the first test. |
| `beforeEach` (function) | Runs before each test. |
| `afterEach` (function) | Runs after each test. |
| `after` (function) | Runs after the last test. |

`QUnit.module()`'s hooks can automatically handle the asynchronous resolution of a Promise on your behalf if you return a `then`able Promise as the result of your callback function.

**Note**: If additional tests are defined after the module's queue has emptied, it will not run the `after` hook again.

Each [QUnit.test](./test.md) has its own test context object, accessible via its `this` variable. Properties on the module options object are copied over to the test context object at the start of each test. Such properties can also be changed from the hook callbacks. See [§ Using the test context](#using-the-test-context).

### Nested scope

The nested callback can be used to create nested modules to run under a commmon label within the parent module.

The scope is also given a `hooks` object which can be used to set hook options procedurally rather than
declaratively.

| name | description |
|-----------|-------------|
| `hooks` (object) | An object with methods for adding hook callbacks. |

QUnit will run tests on the parent module before those of nested ones, even if lexically declared earlier in the code. Additionally, any hook callbacks on a parent module will wrap the hooks on a nested module. In other words, `before` and `beforeEach` callbacks will form a [queue][] while the `afterEach` and `after` callbacks will form a [stack][].

[queue]: https://en.wikipedia.org/wiki/Queue_%28abstract_data_type%29
[stack]: https://en.wikipedia.org/wiki/Stack_%28abstract_data_type%29

## Changelog

| [QUnit 2.4](https://github.com/qunitjs/qunit/releases/tag/2.4.0) | The `QUnit.module.only()`, `QUnit.module.skip()`, and `QUnit.module.todo()` aliases were introduced.
| [QUnit 2.0](https://github.com/qunitjs/qunit/releases/tag/2.0.0) | The `before` and `after` options were introduced.
| [QUnit 1.20](https://github.com/qunitjs/qunit/releases/tag/1.20.0) | The `nested` scope feature was introduced.
| [QUnit 1.16](https://github.com/qunitjs/qunit/releases/tag/1.16.0) | The `beforeEach` and `afterEach` options were introduced.<br/>The `setup` and `teardown` options were deprecated in QUnit 1.16 and removed in QUnit 2.0.

## Examples

### Organizing your tests

If `QUnit.module` is defined without a `nested` callback argument, all subsequently defined tests will be grouped into the module until another module is defined.

```js
QUnit.module( "Group A" );

QUnit.test( "basic test example 1", function( assert ) {
  assert.true( true, "this is fine" );
});
QUnit.test( "basic test example 2", function( assert ) {
  assert.true( true, "this is also fine" );
});

QUnit.module( "Group B" );

QUnit.test( "basic test example 3", function( assert ) {
  assert.true( true, "this is fine" );
});
QUnit.test( "basic test example 4", function( assert ) {
  assert.true( true, "this is also fine" );
});
```

Using modern syntax:

```js
const { test } = QUnit;

QUnit.module( "Group A" );

test( "basic test example", assert => {
  assert.true( true, "this is fine" );
});
test( "basic test example 2", assert => {
  assert.true( true, "this is also fine" );
});

QUnit.module( "Group B" );

test( "basic test example 3", assert => {
  assert.true( true, "this is fine" );
});
test( "basic test example 4", assert => {
  assert.true( true, "this is also fine" );
});
```

### Declaring hook options

```js
QUnit.module( "module A", {
  before: function() {
    // prepare something once for all tests
  },
  beforeEach: function() {
    // prepare something before each test
  },
  afterEach: function() {
    // clean up after each test
  },
  after: function() {
    // clean up once after all tests are done
  }
});
```

### Nested module scope

```js
const { test } = QUnit;

QUnit.module( "Group A", hooks => {

  test( "basic test example", assert => {
    assert.true( true, "this is fine" );
  });

  test( "basic test example 2", assert => {
    assert.true( true, "this is also fine" );
  });
});

QUnit.module( "Group B", hooks => {

  test( "basic test example 3", assert => {
    assert.true( true, "this is fine" );
  });

  test( "basic test example 4", assert => {
    assert.true( true, "this is also fine" );
  });
});
```

### Hooks on nested modules

Use `before`/`beforeEach` hooks are queued for nested modules. `after`/`afterEach` hooks are stacked on nested modules.

```js
const { test } = QUnit;

QUnit.module( "My Group", hooks => {

  // It is valid to call the same hook methods more than once.
  hooks.beforeEach( assert => {
    assert.ok( true, "beforeEach called" );
  });

  hooks.afterEach( assert => {
    assert.ok( true, "afterEach called" );
  });

  test( "with hooks", assert => {
    // 1 x beforeEach
    // 1 x afterEach
    assert.expect( 2 );
  });

  QUnit.module( "Nested Group", hooks => {

    // This will run after the parent module's beforeEach hook
    hooks.beforeEach( assert => {
      assert.ok( true, "nested beforeEach called" );
    });

    // This will run before the parent module's afterEach
    hooks.afterEach( assert => {
      assert.ok( true, "nested afterEach called" );
    });

    test( "with nested hooks", assert => {
      // 2 x beforeEach (parent, current)
      // 2 x afterEach (current, parent)
      assert.expect( 4 );
    });
  });
});
```

### Using the test context

The test context object is exposed to hook callbacks.

```js
QUnit.module( "Machine Maker", {
  beforeEach: function() {
    this.maker = new Maker();
    this.parts = [ "wheels", "motor", "chassis" ];
  }
});

QUnit.test( "makes a robot", function( assert ) {
  this.parts.push( "arduino" );
  assert.equal( this.maker.build( this.parts ), "robot" );
  assert.deepEqual( this.maker.log, [ "robot" ] );
});

QUnit.test( "makes a car", function( assert ) {
  assert.equal( this.maker.build( this.parts ), "car" );
  this.maker.duplicate();
  assert.deepEqual( this.maker.log, [ "car", "car" ] );
});
```

The test context is also available when using the nested scope. Beware that use of the `this` binding is not available
in arrow functions.

```js
const { test } = QUnit;

QUnit.module( "Machine Maker", hooks => {
  hooks.beforeEach( function() {
    this.maker = new Maker();
    this.parts = [ "wheels", "motor", "chassis" ];
  });

  test( "makes a robot", function( assert ) {
    this.parts.push( "arduino" );
    assert.equal( this.maker.build( this.parts ), "robot" );
    assert.deepEqual( this.maker.log, [ "robot" ] );
  });

  test( "makes a car", function( assert ) {
    assert.equal( this.maker.build( this.parts ), "car" );
    this.maker.duplicate();
    assert.deepEqual( this.maker.log, [ "car", "car" ] );
  });
});
```

It might be more convenient to use JavaScript's own lexical scope instead:

```js
const { test } = QUnit;

QUnit.module( "Machine Maker", hooks => {
  let maker;
  let parts;
  hooks.beforeEach( () => {
    maker = new Maker();
    parts = [ "wheels", "motor", "chassis" ];
  });

  test( "makes a robot", assert => {
    parts.push( "arduino" );
    assert.equal( maker.build( parts ), "robot" );
    assert.deepEqual( maker.log, [ "robot" ] );
  });

  test( "makes a car", assert => {
    assert.equal( maker.build( parts ), "car" );
    maker.duplicate();
    assert.deepEqual( maker.log, [ "car", "car" ] );
  });
});
```

### Module hook with Promise

An example of handling an asynchronous `then`able Promise result in hooks. This example uses an [ES6 Promise][] interface that is fulfilled after connecting to or disconnecting from database.

[ES6 Promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

```js
QUnit.module( "Database connection", {
  before: function() {
    return new Promise( function( resolve, reject ) {
      DB.connect( function( err ) {
        if ( err ) {
          reject( err );
        } else {
          resolve();
        }
      });
    });
  },
  after: function() {
    return new Promise( function( resolve, reject ) {
      DB.disconnect( function( err ) {
        if ( err ) {
          reject( err );
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
QUnit.module( "Robot", hooks => {
  // ...
});

// Only execute this module when developing the feature,
// skipping tests from other modules.
QUnit.module.only( "Android", hooks => {
  let android;
  hooks.beforeEach( () => {
    android = new Android();
  });

  QUnit.test( "Say hello", assert => {
    assert.strictEqual( android.hello(), "Hello, my name is AN-2178!" );
  });

  QUnit.test( "Basic conversation", assert => {
    android.loadConversationData( {
      "Hi": "Hello",
      "What's your name?": "My name is AN-2178.",
      "Nice to meet you!": "Nice to meet you too!",
      "...": "..."
    });

    assert.strictEqual(
      android.answer( "What's your name?" ),
      "My name is AN-2178."
    );
  });

  // ...
});
```

Use `QUnit.module.skip()` to treat an entire module's tests as if they used [`QUnit.test.skip`](./test.skip.md) instead of [`QUnit.test`](./test.md).

```js
QUnit.module( "Robot", hooks => {
  // ...
});

// Skip this module's tests.
// For example if the android tests are failing due to unsolved problems.
QUnit.module.skip( "Android", hooks => {
  let android;
  hooks.beforeEach( () => {
    android = new Android();
  });

  QUnit.test( "Say hello", assert => {
    assert.strictEqual( android.hello(), "Hello, my name is AN-2178!" );
  });

  QUnit.test( "Basic conversation", assert => {
    // ...
    assert.strictEqual(
      android.answer( "Nice to meet you!" ),
      "Nice to meet you too!"
    );
  });

  // ...
});
```

Use `QUnit.module.todo()` to denote a feature that is still under development, and is known to not yet be passing all its tests. This treats an entire module's tests as if they used [`QUnit.test.todo`](./test.todo.md) instead of [`QUnit.test`](./test.md).

```js
QUnit.module.todo( "Robot", hooks => {
  let robot;
  hooks.beforeEach( () => {
    robot = new Robot();
  });

  QUnit.test( "Say", assert => {
    // Currently, it returns undefined
    assert.strictEqual( robot.say(), "I'm Robot FN-2187" );
  });

  QUnit.test( "Move arm", assert => {
    // Move the arm to point (75, 80). Currently, each throws a NotImplementedError
    robot.moveArmTo( 75, 80 );
    assert.deepEqual( robot.getPosition(), { x: 75, y: 80 } );
  });

  // ...
});
```

