Step - A QUnit addon for testing execution order
================================

This addon for QUnit adds a `step` method that allows you to assert
the proper sequence in which the code should execute.

### Usage ###

```js
assert.step(expected, message);
```

Where:
 - `expected`: The expected step number (assertion sequence index)
 - `message`: Optional message, same as for other assertions

### Example ###

```js
test("example test", function (assert) {
  function x() {
    assert.step(2, "function y should be called first");
  }
  function y() {
    assert.step(1);
  }
  y();
  x();
});
```

For more examples, refer to the unit tests.