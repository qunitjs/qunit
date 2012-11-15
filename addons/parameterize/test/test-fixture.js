var parameterizeFixture = {
	registerModule : function(qunit, moduleNamePrefix, testCases, assertionCallback) {
		var registerTest = function(title, methodName, cases) {
			qunit.test(title, function(assert) {
				assertionCallback(qunit, assert, methodName, cases);
			});
		}

		qunit.module(moduleNamePrefix + "[test() call]");

		for(var i = 0; i < testCases.length; ++i) {
			var testCase = testCases[i];
			registerTest(testCase.title, "test", testCase.cases);
		}

		qunit.module(moduleNamePrefix + "[asyncTest() call]");

		for(var i = 0; i < testCases.length; ++i) {
			var testCase = testCases[i];
			registerTest(testCase.title, "asyncTest", testCase.cases);
		}
	}
};

var parameterizeTestData = {
	testCasesNotProvided : [
		{
			title : "test cases list is undefined",
		},
		{
			title : "test cases list is null",
			cases : null
		},
		{
			title : "test cases list is empty",
			cases : []
		}
	],

	standardTestCases : [
		{
			title : "1 test case",
			cases : [{ a : 1 }]
		},
		{
			title : "3 test cases",
			cases : [{ a : 0 }, { a : 3 }, { a : 10 }]
		},
	],

	testCasesWithTitles : [
		{
			title : "1 test case",
			cases : [{ title : "title0" }]
		},
		{
			title : "3 test cases",
			cases : [{ title : "title1" }, { title : "title2" }, { title : "title3" }]
		},
	]
};
