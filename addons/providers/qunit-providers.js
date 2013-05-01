QUnit.extend(QUnit, {

	/**
	 * The testWithProvider method accepts a single value, an array
	 * of values, or a function which provides values to test.
	 * @param {String} testName The name of the test to execute
	 * @param {String|Array|Function} data The data to pass to the function
	 * @param {Number} expected The expected number of calls in a test
	 * @param {Function} callback The function to call for the test
	 * @param {boolean} async Flag to set to make the test run asynchronously
	 */
	testWithProvider: function(testName, data, expected, callback, async) {
		var i, args, message,
			runTest = function(args) {
				return function() {
					callback.apply(this, args);
				};
			};

		// If we have a function then run it
		if (typeof data === "function") {
			data = data(this);
		}

		// Deal with different method signature
		if (arguments.length === 3) {
			callback = expected;
			expected = null;
		}

		// Loop data and execute one test per args list
		for (i = 0; i < data.length; i++) {
			args = data[i];

			// Wrap args if needed, allows for simpler syntax
			if (Object.prototype.toString.call(args) !== '[object Array]') {
				args = [args];
			}

			// Run the test
			message = testName + ' with data set #' + String(i) + ' (' + String(args) + ')';
			QUnit.test(message, expected, runTest(args), async);
		}
	}

});
