var begin = 0,
	moduleStart = 0,
	moduleDone = 0,
	testStart = 0,
	testDone = 0,
	log = 0,
	totalTests,
	moduleContext,
	moduleDoneContext,
	testContext,
	testDoneContext,
	logContext,
	testAutorun;

QUnit.on( "runStart", function( args ) {
	totalTests = args.tests.length;
	begin++;
});

QUnit.on( "runEnd", function() {
});

QUnit.on( "suiteStart", function( context ) {
	moduleStart++;
	moduleContext = context;
});

QUnit.on( "suiteEnd", function( context ) {
	moduleDone++;
	moduleDoneContext = context;
});

QUnit.on( "testStart", function( context ) {
	testStart++;
	testContext = context;
});

QUnit.on( "testEnd", function( context ) {
	testDone++;
	testDoneContext = context;
});

QUnit.on( "assert", function( context ) {
	log++;
	logContext = context;
});

QUnit.module( "events1" );

QUnit.test( "test1", function( assert ) {
	assert.expect( 17 );

	assert.equal(
		typeof totalTests,
		"number",
		"QUnit.begin should pass total amount of tests to callback"
	);

	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 1, "QUnit.moduleStart calls" );
	assert.equal( testStart, 1, "QUnit.testStart calls" );
	assert.equal( testDone, 0, "QUnit.testDone calls" );
	assert.equal( moduleDone, 0, "QUnit.moduleDone calls" );

	assert.equal(
		logContext.runtime >= 0 && logContext.runtime < 50,
		true,
		"log runtime was a reasonable number"
	);

	delete logContext.runtime;
	assert.deepEqual( logContext, {
		name: "test1",
		module: "events1",
		result: true,
		message: "log runtime was a reasonable number",
		actual: true,
		expected: true,
		negative: false,
		testId: "8af1b77b"
	}, "log context after equal(actual, expected, message)" );

	assert.equal( "foo", "foo" );

	delete logContext.runtime;
	assert.deepEqual( logContext, {
		name: "test1",
		module: "events1",
		result: true,
		message: undefined,
		actual: "foo",
		expected: "foo",
		negative: false,
		testId: "8af1b77b"
	}, "log context after equal(actual, expected)" );

	assert.ok( true, "ok(true, message)" );

	delete logContext.runtime;
	assert.deepEqual( logContext, {
		module: "events1",
		name: "test1",
		result: true,
		message: "ok(true, message)",
		actual: true,
		expected: true,
		negative: false,
		testId: "8af1b77b"
	}, "log context after ok(true, message)" );

	assert.strictEqual( testDoneContext, undefined, "testDone context" );
	assert.deepEqual( testContext, {
		suiteName: "events1",
		testName: "test1",
		testId: "8af1b77b"
	}, "test context" );

	assert.strictEqual( moduleDoneContext, undefined, "moduleDone context" );
	assert.deepEqual( moduleContext, {
		name: "events1",
		tests: [
			{
				"testName": "test1",
				"suiteName": "events1",
				"testId": "8af1b77b"
			},
			{
				"testName": "test2",
				"suiteName": "events1",
				"testId": "8af1b77c"
			}
		],
		childSuites: []
	}, "module context" );

	assert.equal( log, 16, "QUnit.log calls" );
});

QUnit.test( "test2", function( assert ) {
	assert.expect( 12 );
	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 1, "QUnit.moduleStart calls" );
	assert.equal( testStart, 2, "QUnit.testStart calls" );
	assert.equal( testDone, 1, "QUnit.testDone calls" );
	assert.equal( moduleDone, 0, "QUnit.moduleDone calls" );

	assert.equal(
		testDoneContext.runtime >= 0 && testDoneContext.runtime < 1000,
		true,
		"test runtime was a reasonable number"
	);

	assert.ok( testDoneContext.assertions instanceof Array, "testDone context: assertions" );

	// TODO: more tests for testDoneContext.assertions

	delete testDoneContext.runtime;

	// DEPRECATED: remove this delete when removing the duration property
	delete testDoneContext.duration;

	// Delete testDoneContext.assertions so we can easily jump to next assertion
	delete testDoneContext.assertions;
	delete testDoneContext.source;
	assert.deepEqual( testDoneContext, {
		suiteName: "events1",
		status: "passed",
		testName: "test1",
		failed: 0,
		passed: 17,
		total: 17,
		errors: [],
		skipped: false,
		testId: "8af1b77b"
	}, "testDone context" );
	assert.deepEqual( testContext, {
		suiteName: "events1",
		testName: "test2",
		testId: "8af1b77c"
	}, "test context" );

	assert.strictEqual( moduleDoneContext, undefined, "moduleDone context" );
	assert.deepEqual( moduleContext, {
		name: "events1",
		tests: [
			{
				"testName": "test1",
				"suiteName": "events1",
				"testId": "8af1b77b"
			},
			{
				"testName": "test2",
				"suiteName": "events1",
				"testId": "8af1b77c"
			}
		],
		childSuites: []
	}, "module context" );
	assert.equal( log, 28, "QUnit.log calls" );
});

QUnit.module( "events2" );

QUnit.test( "test1", function( assert ) {
	assert.expect( 10 );
	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 2, "QUnit.moduleStart calls" );
	assert.equal( testStart, 3, "QUnit.testStart calls" );
	assert.equal( testDone, 2, "QUnit.testDone calls" );
	assert.equal( moduleDone, 1, "QUnit.moduleDone calls" );

	assert.deepEqual( testContext, {
		suiteName: "events2",
		testName: "test1",
		testId: "bfd7f2bc"
	}, "test context" );

	assert.equal(
		moduleDoneContext.runtime >= 0 && moduleDoneContext.runtime < 5000,
		true,
		"module runtime was a reasonable number"
	);
	delete moduleDoneContext.runtime;

	assert.deepEqual( moduleDoneContext, {
		name: "events1",
		tests: [
			{
				"suiteName": "events1",
				"testName": "test1",
				"testId": "8af1b77b"
			},
			{
				"suiteName": "events1",
				"testName": "test2",
				"testId": "8af1b77c"
			}
		],
		childSuites: [],
		status: {
			failed: 0,
			passed: 29,
			skipped: 0
		}
	}, "moduleDone context" );
	assert.deepEqual( moduleContext, {
		name: "events2",
		tests: [
			{
				"suiteName": "events2",
				"testName": "test1",
				"testId": "bfd7f2bc"
			},
			{
				"suiteName": "events2",
				"testName": "test2",
				"testId": "bfd7f2bd"
			},
			{
				"suiteName": "events2",
				"testName": "a skipped test",
				"testId": "f80e84a4"
			},
			{
				"suiteName": "events2",
				"testName": "test the log for the skipped test",
				"testId": "9550bd9e"
			}
		],
		childSuites: []
	}, "module context" );

	assert.equal( log, 38, "QUnit.log calls" );
});

QUnit.test( "test2", function( assert ) {
	assert.expect( 8 );
	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 2, "QUnit.moduleStart calls" );
	assert.equal( testStart, 4, "QUnit.testStart calls" );
	assert.equal( testDone, 3, "QUnit.testDone calls" );
	assert.equal( moduleDone, 1, "QUnit.moduleDone calls" );

	assert.deepEqual( testContext, {
		suiteName: "events2",
		testName: "test2",
		testId: "bfd7f2bd"
	}, "test context" );
	assert.deepEqual( moduleContext, {
		name: "events2",
		tests: [
			{
				"suiteName": "events2",
				"testName": "test1",
				"testId": "bfd7f2bc"
			},
			{
				"suiteName": "events2",
				"testName": "test2",
				"testId": "bfd7f2bd"
			},
			{
				"suiteName": "events2",
				"testName": "a skipped test",
				"testId": "f80e84a4"
			},
			{
				"suiteName": "events2",
				"testName": "test the log for the skipped test",
				"testId": "9550bd9e"
			}
		],
		childSuites: []
	}, "module context" );

	assert.equal( log, 46, "QUnit.log calls" );
});

QUnit.skip( "a skipped test" );

QUnit.test( "test the log for the skipped test", function( assert ) {
	assert.expect( 1 );

	delete testDoneContext.runtime;
	delete testDoneContext.duration;
	delete testDoneContext.source;

	assert.deepEqual( testDoneContext, {
		assertions: [],
		suiteName: "events2",
		testName: "a skipped test",
		failed: 0,
		passed: 0,
		total: 0,
		errors: [],
		status: "skipped",
		skipped: true,
		testId: "f80e84a4"
	}, "testDone context" );
});

QUnit.module( "duplicate listeners" );

QUnit.test( "are filtered out", function( assert ) {
	assert.expect( 4 );

	var arr = [];
	function assertPusher() {
		arr.push("x");
	}

	QUnit.on( "assert", assertPusher );
	assert.equal( arr.length, 0 );
	assert.equal( arr.length, 1 );
	QUnit.on( "assert", assertPusher );
	assert.equal( arr.length, 2 );
	assert.equal( arr.length, 3 );
});

QUnit.module( "custom events" );

QUnit.test( "are not possible", function( assert ) {
	assert.expect( 2 );
	assert.equal( QUnit.off, undefined, "QUnit.off should not be defined" );
	assert.equal( QUnit.emit, undefined, "QUnit.emit should not be defined" );
});

testAutorun = true;

QUnit.on( "runEnd", function() {
	if ( !testAutorun ) {
		return;
	}

	testAutorun = false;

	moduleStart = moduleDone = 0;

	// Since these tests run *after* done, and as such
	// QUnit is not able to know whether more tests are coming
	// the module starts/ends after each test.
	QUnit.module( "autorun" );

	setTimeout(function() {
		QUnit.test( "first", function( assert ) {
			assert.equal( moduleStart, 1, "test started" );
			assert.equal( moduleDone, 0, "test in progress" );
		});

		QUnit.test( "second", function( assert ) {
			assert.equal( moduleStart, 2, "test started" );
			assert.equal( moduleDone, 1, "test in progress" );
		});
	}, 5000 );
});
