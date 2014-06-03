// TODO disable reordering for this suite!

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
	logContext;

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
	assert.expect( 16 );

	assert.equal( typeof totalTests, "number", "QUnit.begin should pass total amount of tests to callback" );
	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 1, "QUnit.moduleStart calls" );
	assert.equal( testStart, 1, "QUnit.testStart calls" );
	assert.equal( testDone, 0, "QUnit.testDone calls" );
	assert.equal( moduleDone, 0, "QUnit.moduleDone calls" );
	assert.deepEqual( logContext, {
		name: "test1",
		module: "logs1",
		result: true,
		message: "QUnit.moduleDone calls",
		actual: 0,
		expected: 0
	}, "log context after equal(actual, expected, message)" );

	assert.equal( "foo", "foo" );
	assert.deepEqual( logContext, {
		name: "test1",
		module: "logs1",
		result: true,
		message: undefined,
		actual: "foo",
		expected: "foo"
	}, "log context after equal(actual, expected)" );

	assert.ok( true, "ok(true, message)" );
	assert.deepEqual( logContext, {
		module: "logs1",
		name: "test1",
		result: true,
		message: "ok(true, message)",
		actual: true,
		expected: true
	}, "log context after ok(true, message)" );

	assert.strictEqual( testDoneContext, undefined, "testDone context" );
	assert.deepEqual( testContext, {
		module: "logs1",
		name: "test1"
	}, "test context" );
	assert.strictEqual( moduleDoneContext, undefined, "moduleDone context" );
	assert.deepEqual( moduleContext, {
		name: "logs1"
	}, "module context" );

	assert.equal( log, 15, "QUnit.log calls" );
});

QUnit.test( "test2", function( assert ) {
	assert.expect( 11 );
	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 1, "QUnit.moduleStart calls" );
	assert.equal( testStart, 2, "QUnit.testStart calls" );
	assert.equal( testDone, 1, "QUnit.testDone calls" );
	assert.equal( moduleDone, 0, "QUnit.moduleDone calls" );

	assert.equal( typeof testDoneContext.runtime, "number", "testDone context: runtime" );
	delete testDoneContext.runtime;
	// DEPRECATED: remove this delete when removing the duration property
	delete testDoneContext.duration;
	assert.deepEqual( testDoneContext, {
		module: "logs1",
		name: "test1",
		failed: 0,
		passed: 16,
		total: 16
	}, "testDone context" );
	assert.deepEqual( testContext, {
		module: "logs1",
		name: "test2"
	}, "test context" );
	assert.strictEqual( moduleDoneContext, undefined, "moduleDone context" );
	assert.deepEqual( moduleContext, {
		name: "logs1"
	}, "module context" );

	assert.equal( log, 26, "QUnit.log calls" );
});

QUnit.module( "logs2" );

QUnit.test( "test1", function( assert ) {
	assert.expect( 9 );
	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 2, "QUnit.moduleStart calls" );
	assert.equal( testStart, 3, "QUnit.testStart calls" );
	assert.equal( testDone, 2, "QUnit.testDone calls" );
	assert.equal( moduleDone, 1, "QUnit.moduleDone calls" );

	assert.deepEqual( testContext, {
		module: "logs2",
		name: "test1"
	}, "test context" );
	assert.deepEqual( moduleDoneContext, {
		name: "logs1",
		failed: 0,
		passed: 27,
		total: 27
	}, "moduleDone context" );
	assert.deepEqual( moduleContext, {
		name: "logs2"
	}, "module context" );

	assert.equal( log, 35, "QUnit.log calls" );
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
		name: "test2"
	}, "test context" );
	assert.deepEqual( moduleContext, {
		name: "logs2"
	}, "module context" );

	assert.equal( log, 43, "QUnit.log calls" );
});

var testAutorun = true;

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
