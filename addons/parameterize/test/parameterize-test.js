parameterizeFixture.registerModule(
	QUnit,
	"No test cases",
	parameterizeTestData.testCasesNotProvided,
	function(qunit, assert, testName, testCases) {
		var record = recordCalls(qunit, testName, function() {
			qunit.cases(testCases)[testName]("", function(){});
		});

		assert.ok(record.neverCalled());
	}
);

parameterizeFixture.registerModule(
	QUnit,
	"Registering tests",
	parameterizeTestData.standardTestCases,
	function(qunit, assert, testName, testCases) {
		var actualTestCases = [];

		var record = recordCalls(qunit, testName, function() {
			qunit
				.cases(testCases)
				[testName]("", function(testCase){});
		});

		var recordedArguments = record.getArguments();

		assert.equal(recordedArguments.length, testCases.length);
	}
);

parameterizeFixture.registerModule(
	QUnit,
	"Test cases pass",
	parameterizeTestData.standardTestCases,
	function(qunit, assert, testName, testCases) {
		var actualTestCases = [];

		var record = recordCalls(qunit, testName, function() {
			qunit
				.cases(testCases)
				[testName]("", function(testCase){
					// Test callback saves passed testCase object.
					actualTestCases.push(testCase)
				});
		});

		var recordedArguments = record.getArguments();
		for(var i = 0; i < recordedArguments.length; ++i) {
			// execute test callback which is passed as 3-rd argument
			recordedArguments[i][2]();
		}
		assert.deepEqual(actualTestCases, testCases);
	}
);

parameterizeFixture.registerModule(
	QUnit,
	"Assert object pass",
	parameterizeTestData.standardTestCases,
	function(qunit, assert, testName, testCases) {
		var actualAssert = null;

		var record = recordCalls(qunit, testName, function() {
			qunit
				.cases(testCases)
				[testName]("", function(testCase, assert){
					// Save passed assert object
					actualAssert = assert
				});
		});

		var recordedArguments = record.getArguments();
		for(var i = 0; i < recordedArguments.length; ++i) {
			var stubAssert = {};
			// Execute test function which is passed as 3-rd argument
			// and pass stubAssert object as parameter.
			// It forces to call parameterized test function.
			// Assert object should be passed as 2-nd parameter.
			recordedArguments[i][2](stubAssert);

			assert.strictEqual(actualAssert, stubAssert);
		}
	}
);

parameterizeFixture.registerModule(
	QUnit,
	"Expected parameter pass",
	parameterizeTestData.standardTestCases,
	function(qunit, assert, testName, testCases) {
		var expectedParameter = 5;
		var record = recordCalls(qunit, testName, function() {
			qunit
				.cases(testCases)
				[testName]("", expectedParameter, function(testCase){});
		});

		var recordedArguments = record.getArguments();
		for(var i = 0; i < recordedArguments.length; ++i) {
			// Verify expected parameter which is passed as 2-nd argument
			assert.equal(recordedArguments[i][1], expectedParameter);
		}
	}
);

parameterizeFixture.registerModule(
	QUnit,
	"Expected parameter non-specified",
	parameterizeTestData.standardTestCases,
	function(qunit, assert, testName, testCases) {
		var record = recordCalls(qunit, testName, function() {
			qunit
				.cases(testCases)
				[testName]("", function(testCase){});
		});

		var recordedArguments = record.getArguments();
		for(var i = 0; i < recordedArguments.length; ++i) {
			// Verify expected parameter which is passed as 2-nd argument
			assert.ok(typeof([i][1]) === "undefined");
		}
	}
);

parameterizeFixture.registerModule(
	QUnit,
	"Test case title parameter append",
	parameterizeTestData.standardTestCases,
	function(qunit, assert, testName, testCases) {
		var title = "some test title";
		var record = recordCalls(qunit, testName, function() {
			qunit
				.cases(testCases)
				[testName](title, function(testCase){});
		});

		var recordedArguments = record.getArguments();
		for(var i = 0; i < recordedArguments.length; ++i) {
			// Verify expected title which is passed as 1-st argument
			assert.equal(recordedArguments[i][0], title);
		}
	}
);

parameterizeFixture.registerModule(
	QUnit,
	"Test case title parameter append",
	parameterizeTestData.testCasesWithTitles,
	function(qunit, assert, testName, testCases) {
		var title = "Test title";
		var record = recordCalls(qunit, testName, function() {
			qunit
				.cases(testCases)
				[testName](title, function(testCase){});
		});

		var recordedArguments = record.getArguments();
		for(var i = 0; i < recordedArguments.length; ++i) {
			var expectedTitle = title + "[" + testCases[i].title + "]";
			// Verify expected title which is passed as 1-st argument
			assert.equal(recordedArguments[i][0], expectedTitle);
		}
	}
);
