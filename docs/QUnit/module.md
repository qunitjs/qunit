---
layout: default
title: module
description: Group related tests under a single label.
categories:
  - main
---

## `QUnit.module( name [, hooks] [, nested ] )`

Group related tests under a single label.

| parameter | description |
|-----------|-------------|
| `name` (string) | Label for this group of tests. |
| `hooks` (object) | Callbacks to run during test execution. |
| `nested` (function) | A callback used for nested modules. |

#### hooks properties: `{ before, beforeEach, afterEach, after }`

| name | description |
|-----------|-------------|
| `before` (function) | Runs before the first test. |
| `beforeEach` (function) | Runs before each test. |
| `afterEach` (function) | Runs after each test. |
| `after` (function) | Runs after the last test. |

> Note: If additional tests are defined after the module's queue has emptied, it will not run the `after` hook again.

#### Nested module: `nested( hooks )`

A callback which groups tests and nested modules to run under the current module label.

| name | description |
|-----------|-------------|
| `hooks` (object) | An object with functions to define `before`/`beforeEach`/`afterEach`/`after` hooks. |

### Description

You can use the module name to organize, select, and filter tests to run.

All tests inside a module callback function will be grouped into that module. The test names will all be preceded by the module name in the test results. Other modules can be nested inside this callback function, where their tests' names will be labeled by their names recursively prefixed by their parent modules.

If `QUnit.module` is defined without a `nested` callback argument, all subsequently defined tests will be grouped into the module until another module is defined.

Modules with test group functions allow you to define nested modules, and QUnit will run tests on the parent module before going deep on the nested ones, even if they're declared first. Additionally, any hook callbacks on a parent module will wrap the hooks on a nested module. In other words, `before` and `beforeEach` callbacks will form a [queue][] while the `afterEach` and `after` callbacks will form a [stack][].

[queue]: https://en.wikipedia.org/wiki/Queue_%28abstract_data_type%29
[stack]: https://en.wikipedia.org/wiki/Stack_%28abstract_data_type%29

You can specify code to run before and after tests using the hooks argument, and also to create properties that will be shared on the testing context. Any additional properties on the `hooks` object will be added to that context. The `hooks` argument is still optional if you call `QUnit.module` with a callback argument.

The module's callback is invoked with the test environment as its `this` context, with the environment's properties copied to the module's tests, hooks, and nested modules. Note that changes on tests' `this` are not preserved between sibling tests, where `this` will be reset to the initial value for each test.

`QUnit.module()`'s hooks can automatically handle the asynchronous resolution of a Promise on your behalf if you return a `then`able Promise as the result of your callback function.

## Exclusive tests

When you are debugging your code, you will often need to _only_ run a subset of tests. You can append `only` to `QUnit.module` to specify which module you want to run.

Note that if more than one module was defined using `QUnit.module.only()`, only the first one will run.

It works the same way `QUnit.only()` does for tests.

## Inclusive tests

As the codebase becomes bigger and bigger, you may sometimes find some tests, related to a feature, are temporarily broken for some reasons. Instead of commenting that chunk of tests until you found the culprit, you can easily append `skip` to the broken module to skip all its child suites and tests.

If the child suites and tests contain some `todo` or `only` tests, `QUnit` will mark those as skipped as if they were defined using `QUnit.skip()`.

### Under development tests

When a module is still under development (in a "todo" state), you can use `QUnit.module.todo` to easily mark it as `todo`.

Using this method will mark all underlying tests as `todo` as if they were defined using `QUnit.todo` except for tests defined using `QUnit.skip()` which will be left intact. Those tests will pass as long as one failing assertion is present.

If all assertions pass, then the tests will fail signaling that `QUnit.module.todo` should be replaced by `QUnit.module`.

### Examples

Use the `QUnit.module()` function to group tests together:

```js
QUnit.module( "group a" );
QUnit.test( "a basic test example", function( assert ) {
  assert.ok( true, "this test is fine" );
});
QUnit.test( "a basic test example 2", function( assert ) {
  assert.ok( true, "this test is fine" );
});

QUnit.module( "group b" );
QUnit.test( "a basic test example 3", function( assert ) {
  assert.ok( true, "this test is fine" );
});
QUnit.test( "a basic test example 4", function( assert ) {
  assert.ok( true, "this test is fine" );
});
```

Using modern syntax:

```js
const { test } = QUnit;
QUnit.module( "group a" );

test( "a basic test example", t => {
  t.ok( true, "this test is fine" );
});
test( "a basic test example 2", t => {
  t.ok( true, "this test is fine" );
});

QUnit.module( "group b" );
test( "a basic test example 3", t => {
  t.ok( true, "this test is fine" );
});
test( "a basic test example 4", t => {
  t.ok( true, "this test is fine" );
});
```

---

Use the `QUnit.module()` function to group tests together:

```js
QUnit.module( "module a", function() {
  QUnit.test( "a basic test example", function( assert ) {
    assert.ok( true, "this test is fine" );
  });
});

QUnit.module( "module b", function() {
  QUnit.test( "a basic test example 2", function( assert ) {
    assert.ok( true, "this test is fine" );
  });

  QUnit.module( "nested module b.1", function() {

    // This test will be prefixed with the following module label:
    // "module b > nested module b.1"
    QUnit.test( "a basic test example 3", function( assert ) {
      assert.ok( true, "this test is fine" );
    });
  });
});
```

Using modern syntax:

```js
const { test } = QUnit;
QUnit.module( "module a", () => {
  test( "a basic test example", t => {
    t.ok( true, "this test is fine" );
  });
});

QUnit.module( "module b", () => {
  test( "a basic test example 2", t => {
    t.ok( true, "this test is fine" );
  });

  QUnit.module( "nested module b.1", () => {

    // This test will be prefixed with the following module label:
    // "module b > nested module b.1"
    test( "a basic test example 3", t => {
      t.ok( true, "this test is fine" );
    });
  });
});
```

---

A sample for using the before, beforeEach, afterEach, and after callbacks

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

---

Hooks share the same context as their respective test

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
  assert.deepEqual( this.maker.made, [ "robot" ] );
});

QUnit.test( "makes a car", function( assert ) {
  assert.equal( this.maker.build( this.parts ), "car" );
  this.maker.duplicate();
  assert.deepEqual( this.maker.made, [ "car", "car" ] );
});
```

---

`before`/`beforeEach` hooks queue on nested modules. `after`/`afterEach` hooks stack on nested modules.

```js
QUnit.module( "grouped tests argument hooks", function( hooks ) {

  // You can invoke the hooks methods more than once.
  hooks.beforeEach( function( assert ) {
    assert.ok( true, "beforeEach called" );
  } );

  hooks.afterEach( function( assert ) {
    assert.ok( true, "afterEach called" );
  } );

  QUnit.test( "call hooks", function( assert ) {
    assert.expect( 2 );
  } );

  QUnit.module( "stacked hooks", function( hooks ) {

    // This will run after the parent module's beforeEach hook
    hooks.beforeEach( function( assert ) {
      assert.ok( true, "nested beforeEach called" );
    } );

    // This will run before the parent module's afterEach
    hooks.afterEach( function( assert ) {
      assert.ok( true, "nested afterEach called" );
    } );

    QUnit.test( "call hooks", function( assert ) {
      assert.expect( 4 );
    } );
  } );
} );
```

---

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
      } );
    } );
  },
  after: function() {
    return new Promise( function( resolve, reject ) {
      DB.disconnect( function( err ) {
        if ( err ) {
          reject( err );
        } else {
          resolve();
        }
      } );
    } );
  }
} );
```

---

Only run a subset of tests:

```js
QUnit.module( "Robot", function() {
  // ...
} );

// Currenly working on implementing features related to androids
QUnit.module.only( "Android", function( hooks ) {
  hooks.beforeEach( function() {
    this.adnroid = new Android();
  } );

  QUnit.test( "Say hello", function( assert ) {
    assert.strictEqual( this.android.hello(), "Hello, my name is AN-2178!" );
  } );

  QUnit.test( "Basic conversation", function( assert ) {
    this.android.loadConversationData( {
      "Hi": "Hello",
      "What's your name?": "My name is AN-2178.",
      "Nice to meet you!": "Nice to meet you too!",
      "...": "..."
    } );

    assert.strictEqual(
      this.android.answer( "What's your name?" ), "My name is AN-2178."
    );
  } );

  // ...
} );
```

Skipping temporarily broken module:

```js
QUnit.module( "Robot", function() {
  // ...
} );

// Tests related to androids are failling due to unkown cause.
// Skipping them for now.
QUnit.module.skip( "Android", function( hooks ) {
  hooks.beforeEach( function() {
    this.android = new Android();
  } );

  QUnit.test( "Say hello", function( assert ) {
    assert.strictEqual( this.android.hello(), "Hello, my name is AN-2178!" );
  } );

  QUnit.test( "Basic conversation", function( assert ) {
    // ...
    assert.strictEqual(
      this.android.answer( "Nice to meet you!" ), "Nice to meet you too!"
    );
  } );

  QUnit.test( "Move left arm", function ( assert ) {
    // Move the left arm of the android to point (10, 50)
    this.android.moveLeftArmTo( 10, 50 );

    assert.deepEqual( this.android.getLeftArmPosition(), { x: 10, y: 50 } );
  } );

  QUnit.test( "Move right arm", function ( assert ) {
    // Move the right arm of the android to point (15, 45)
    this.android.moveRightArmTo( 15, 45 );

    assert.deepEqual( this.android.getRightArmPosition(), { x: 15, y: 45 } );
  } );

  QUnit.test( "Grab things", function ( assert ) {
    // Move the arm of the android to point (10, 50)
    this.android.grabThingAt( 25, 5 );

    assert.deepEqual( this.android.getPosition(), { x: 25, y: 5 } );
    assert.ok( this.android.isGrabbing() );
  } );

  QUnit.test( "Can walk", function ( assert ) {
    assert.ok( this.android.canWalk() );
  } );

  QUnit.test( "Can speak", function ( assert ) {
    assert.ok( this.android.canSpeak() );
  } );

  // ...
} );
```

---

Using `QUnit.module.todo()` to denote code that is still under development.

```js
QUnit.module.todo( "Robot", function( hooks ) {
  hooks.beforeEach( function() {
    this.robot = new Robot();
  } );

  QUnit.test( "Say", function( assert ) {
    // Currently, it returns undefined
    assert.strictEqual( this.robot.say(), "I'm Robot FN-2187" );
  } );

  QUnit.test( "Move arm", function ( assert ) {
    // Move the arm to point (75, 80). Currently, it throws a NotImplementedError
    assert.throws( function() {
      this.robot.moveArmTo(75, 80);
    }, /Not yet implemented/ );

    assert.throws( function() {
      assert.deepEqual( this.robot.getPosition(), { x: 75, y: 80 } );
    }, /Not yet implemented/ );
  } );

  // ...
} );
```
