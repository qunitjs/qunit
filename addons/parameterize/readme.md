Parameterize - A QUnit Addon For Running Parameterized Tests
============================================================

This addon provides ability to specify the list of test cases outside of the test function.
When list of test cases is provided then separated test is added to run per each test case.
Test case is passed to test function as parameter.

It helps to make tests more DRY.

##Usage

```js
QUnit
	.cases(testCasesList)
	.test(title, [expect], callback);
```

####Example

Given test function is:

```js
	function sum(a, b) { return a + b; }
```

Then the following code:

```js
QUnit
	.cases([
		{ a : 2, b : 2, expectedSum : 4 },
		{ a : 5, b : 5, expectedSum : 10 },
		{ a : 40, b : 2, expectedSum : 42 }
	])
	.test("Sum test", function(params) {
		var actualSum = sum(params.a, params.b);
		equal(actualSum, params.expectedSum);
	});
```

is eqivalent to:

```js
QUnit.test("Sum test", function() {
	var actualSum = sum(2, 2);
	equal(actualSum, 4);
});
QUnit.test("Sum test", function() {
	var actualSum = sum(5, 5);
	equal(actualSum, 10);
});
QUnit.test("Sum test", function() {
	var actualSum = sum(40, 2);
	equal(actualSum, 42);
});
```

## Assert parameter

Parameter assert is provided as the second parameter to the test function.

####Example

```js
QUnit
	.cases([
		{ a : 1, b : 1, expectedSum : 2 }
	])
	.test("Sum test", function(params, assert) {
		var actualSum = sum(params.a, params.b);
		assert.equal(actualSum, params.expectedSum);
	});
```

## Title suffix

When special parameter 'title' is specifies in test case
then test case title is added as suffix to the test title.

####Example

The following code:

```js
QUnit
	.cases([
		{ title : "100+100", a : 100, b : 100, expectedSum : 200 },
		{ title : "5+0", a : 5, b : 0, expectedSum : 5 }
	])
	.test("Sum test", function(params) {
		var actualSum = sum(params.a, params.b);
		equal(actualSum, params.expectedSum);
	});
```

is equivalent to:

```js
QUnit.test("Sum test[100+100]", function() {
	var actualSum = sum(100, 100);
	equal(actualSum, 200);
});
QUnit.test("Sum test[5+0]", function() {
	var actualSum = sum(5, 0);
	equal(actualSum, 5);
});
```
