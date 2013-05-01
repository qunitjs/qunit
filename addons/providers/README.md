Providers - A QUnit addon for implementing data providers in tests
================================

This addon for QUnit adds a `QUnit.testWithProvider` method, allowing tests
to be run multiple times with data sets provided as parameters to the test.


### Usage ###

```js
QUnit.testWithProvider(testName, data, expected, callback, async)
```

Where:
 - `testName`: The title of the unit being tested
 - `data`: An array of argument lists to pass to the callback, or a function that generates an array
 - `expected`: Number of assertions in the test
 - `callback`: The function used to run the test and any assertions
 - `async`: Flag to set if the test should be run asynchronously

### Example ###

```js
// Uses an array of argument lists
QUnit.testWithProvider('Sample addition', [[1, 2, 3], [2, 3, 5]], function(a, b, sum) {
	QUnit.equal(addNumbers(a, b), sum, 'Two numbers were added together');
});

// For callbacks with an arity of 1, you can pass a flat list
QUnit.testWithProvider('Sample absolute value', [-1, -2, -3], function(num) {
	QUnit.equal(absolute(num), Math.abs(num), 'The absolute value of the number is returned');
});

// For dynamic data sources, use a function
var provider = function() {
		// some operations
		return data;
	};
QUnit.testWithProvider('Sample with a function', provider, function(val1, val2) {
	// Additional assertions with this data source
});
```

For more examples, refer to the unit tests.
