Close-Enough - A QUnit addon for testing number approximations
================================

This addon for QUnit adds `close` and `notClose` assertion methods to test that
numbers are close enough (or different enough) from an expected number, with
a specified accuracy.

### Usage ###

```js
assert.close(actual, expected, maxDifference, message);
assert.notClose(actual, expected, minDifference, message);
```

Where:
 - `maxDifference`: the maximum inclusive difference allowed between the `actual` and `expected` numbers
 - `minDifference`: the minimum exclusive difference allowed between the `actual` and `expected` numbers
 - `actual`, `expected`, `message`: The usual

### Example ###
```js
test('Example unit test', function(assert) {
	assert.close(3.141, Math.PI, 0.001);
	assert.notClose(3.1, Math.PI, 0.001);
```

For more examples, refer to the unit tests.