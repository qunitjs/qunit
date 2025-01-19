---
layout: page-api
title: assert.expect()
excerpt: Specify how many assertions are expected in a test.
groups:
  - assert
redirect_from:
  - "/assert/expect/"
  - "/expect/"
version_added: "1.0.0"
---

`expect( amount )`

Specify how many assertions are expected in a test.

| name | description |
|------|-------------|
| `amount` | Number of expected assertions in this test |

This is most commonly used as `assert.expect(0)`, which indicates that a test may pass without making any assertions. This means the test is only used to verify that the code runs to completion, without any uncaught errors. This is is essentially the inverse of [`assert.throws()`](./throws.md).

This can also be used to explicitly require a certain number of assertions to be recorded in a given test. If afterwards the number of assertions does not match the expected count, the test will fail.

It is recommended to test asynchronous code with the [`assert.verifySteps()`](./verifySteps.md) or [`assert.async()`](./async.md) methods instead. If you're using these stricter methods already, consider removing the `assert.expect()` call. See also the [require-expect "never-except-zero"](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/require-expect.md) rule of the [eslint-plugin-qunit](https://www.npmjs.com/package/eslint-plugin-qunit) package.

## Changelog

| UNRELEASED | `assert.expect()` now counts [`assert.verifySteps()`](./verifySteps.md) as one assertion. Steps no longer count separately.

## Migration guide

If you use `assert.expect()` in combination with `assert.step()` and [`assert.verifySteps()`](../assert/verifySteps.md) in the same test, you previously counted both the steps and the verification of the steps. In QUnit 3.0 this changes to count `assert.verifySteps()` as one assertion instead ([#1226](https://github.com/qunitjs/qunit/issues/1226)).

Before, on QUnit 2.x without [QUnit.config.countStepsAsOne](../config/countStepsAsOne.md):

```js
QUnit.test('example', async function (assert) {
  assert.expect(6);

  MyVoice.on('noun', function (word) {
    assert.step(word); // 1, 2, 3, 4
  });
  var song = await MyVoice.sing('My Favorite Things', { lines: 1 });

  assert.true(song.finished, 'finished'); // 5
  assert.verifySteps([ // 6
    'Raindrops',
    'roses',
    'whiskers',
    'kittens'
  ]);
});
```

After:

```js
QUnit.test('example', async function (assert) {
  assert.expect(2);

  MyVoice.on('noun', function (word) {
    assert.step(word);
  });
  var song = await MyVoice.sing('My Favorite Things', { lines: 1 });

  assert.true(song.finished, 'finished'); // 1
  assert.verifySteps([ // 2
    'Raindrops',
    'roses',
    'whiskers',
    'kittens'
  ]);
});
```

## Examples

### Example: No assertions

A test without any assertions:

```js
QUnit.test('example', function (assert) {
  assert.expect(0);

  var android = new Robot();
  android.up(2);
  android.down(2);
  android.left();
  android.right();
  android.left();
  android.right();
  android.attack();
  android.jump();
});
```

### Example: Custom assert

If you use a generic assertion library that throws when an expectation is not met, you can use `assert.expect(0)` if there are no other assertions needed in the test.

```js
QUnit.test('example', function (assert) {
  assert.expect(0);

  var android = new Robot(database);
  android.run();

  database.assertNoOpenConnections();
});
```

### Example: Explicit count

Fail the test if the test did not complete an exact assertion count.

It is recommended to test callback code with [`assert.verifySteps()`](./verifySteps.md) instead, as replacement for relying on `assert.expect()`. See also the [require-expect "never-except-zero"](https://github.com/platinumazure/eslint-plugin-qunit/blob/main/docs/rules/require-expect.md) rule of the [eslint-plugin-qunit](https://www.npmjs.com/package/eslint-plugin-qunit) package.

```js
QUnit.test('example', function (assert) {
  assert.expect(2);

  function calc (x, operation) {
    return operation(x);
  }

  let result = calc(2, function (x) {
    assert.true(true, 'calc() calls operation function');
    return x * x;
  });

  assert.strictEqual(result, 4, '2 squared equals 4');
});
```
