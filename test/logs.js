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

QUnit.begin(function( args ) {
	totalTests = args.totalTests;
	begin++;
});

QUnit.done(function() {
});

QUnit.moduleStart(function( context ) {
	moduleStart++;
	moduleContext = context;
});

QUnit.moduleDone(function( context ) {
	moduleDone++;
	moduleDoneContext = context;
});

QUnit.testStart(function( context ) {
	testStart++;
	testContext = context;
});

QUnit.testDone(function( context ) {
	testDone++;
	testDoneContext = context;
});

QUnit.log(function( context ) {
	log++;
	logContext = context;
});
QUnit.module( "logs1" );

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
		module: "logs1",
		result: true,
		message: "log runtime was a reasonable number",
		actual: true,
		expected: true,
		testId: "646e9e25"
	}, "log context after equal(actual, expected, message)" );

	assert.equal( "foo", "foo" );

	delete logContext.runtime;
	assert.deepEqual( logContext, {
		name: "test1",
		module: "logs1",
		result: true,
		message: undefined,
		actual: "foo",
		expected: "foo",
		testId: "646e9e25"
	}, "log context after equal(actual, expected)" );

	assert.ok( true, "ok(true, message)" );

	delete logContext.runtime;
	assert.deepEqual( logContext, {
		module: "logs1",
		name: "test1",
		result: true,
		message: "ok(true, message)",
		actual: true,
		expected: true,
		testId: "646e9e25"
	}, "log context after ok(true, message)" );

	assert.strictEqual( testDoneContext, undefined, "testDone context" );
	assert.deepEqual( testContext, {
		module: "logs1",
		name: "test1",
		testId: "646e9e25"
	}, "test context" );

	assert.strictEqual( moduleDoneContext, undefined, "moduleDone context" );
	assert.deepEqual( moduleContext, {
		name: "logs1"
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
	assert.deepEqual( testDoneContext, {
		module: "logs1",
		name: "test1",
		failed: 0,
		passed: 17,
		total: 17,
		testId: "646e9e25",
		skipped: false
	}, "testDone context" );
	assert.deepEqual( testContext, {
		module: "logs1",
		name: "test2",
		testId: "646e9e26"
	}, "test context" );

	assert.strictEqual( moduleDoneContext, undefined, "moduleDone context" );
	assert.deepEqual( moduleContext, {
		name: "logs1"
	}, "module context" );
	assert.equal( log, 28, "QUnit.log calls" );
});

QUnit.module( "logs2" );

QUnit.test( "test1", function( assert ) {
	assert.expect( 10 );
	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 2, "QUnit.moduleStart calls" );
	assert.equal( testStart, 3, "QUnit.testStart calls" );
	assert.equal( testDone, 2, "QUnit.testDone calls" );
	assert.equal( moduleDone, 1, "QUnit.moduleDone calls" );

	assert.deepEqual( testContext, {
		module: "logs2",
		name: "test1",
		testId: "9954d966"
	}, "test context" );

	assert.equal(
		moduleDoneContext.runtime >= 0 && moduleDoneContext.runtime < 5000,
		true,
		"module runtime was a reasonable number"
	);
	delete moduleDoneContext.runtime;

	assert.deepEqual( moduleDoneContext, {
		name: "logs1",
		failed: 0,
		passed: 29,
		total: 29
	}, "moduleDone context" );
	assert.deepEqual( moduleContext, {
		name: "logs2"
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
		module: "logs2",
		name: "test2",
		testId: "9954d967"
	}, "test context" );
	assert.deepEqual( moduleContext, {
		name: "logs2"
	}, "module context" );

	assert.equal( log, 46, "QUnit.log calls" );
});

QUnit.skip( "a skipped test" );

QUnit.test( "test the log for the skipped test", function( assert ) {
	assert.expect( 1 );

	delete testDoneContext.runtime;
	delete testDoneContext.duration;

	assert.deepEqual( testDoneContext, {
		assertions: [],
		module: "logs2",
		name: "a skipped test",
		failed: 0,
		passed: 0,
		total: 0,
		skipped: true,
		testId: "3e797d3a"
	}, "testDone context" );
});

testAutorun = true;

QUnit.done(function() {

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

QUnit.module( "deprecated log methods" );

QUnit.test( "QUnit.reset()", function( assert ) {

	// Skip non-browsers
	if ( typeof window === "undefined" || !window.document ) {
		assert.expect( 0 );
		return;
	}

	var myFixture = document.getElementById( "qunit-fixture" );

	myFixture.innerHTML = "<em>something different from QUnit.config.fixture</em>";

	QUnit.reset();

	assert.strictEqual( myFixture.innerHTML, QUnit.config.fixture, "restores #qunit-fixture" );
});
