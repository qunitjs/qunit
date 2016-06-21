QUnit.config.reorder = false;

var totalTests, moduleContext, moduleDoneContext, testContext, testDoneContext, logContext,
	testAutorun, beginModules,
	module1Test1, module1Test2, module2Test1, module2Test2, module2Test3, module2Test4,
	begin = 0,
	moduleStart = 0,
	moduleDone = 0,
	testStart = 0,
	testDone = 0,
	log = 0,
	module1Context = {
		name: "logs1",
		tests: [
			( module1Test1 = {
				"name": "test1",
				"testId": "646e9e25"
			} ),
			( module1Test2 = {
				"name": "test2",
				"testId": "646e9e26"
			} )
		]
	},
	module2Context = {
		name: "logs2",
		tests: [
			( module2Test1 = {
				"name": "test1",
				"testId": "9954d966"
			} ),
			( module2Test2 = {
				"name": "test2",
				"testId": "9954d967"
			} ),
			( module2Test3 = {
				"name": "a skipped test",
				"testId": "3e797d3a"
			} ),
			( module2Test4 = {
				"name": "test the log for the skipped test",
				"testId": "d3266148"
			} )
		]
	};

QUnit.begin( function( args ) {
	totalTests = args.totalTests;
	beginModules = args.modules;
	begin++;
} );

QUnit.moduleStart( function( context ) {
	moduleStart++;
	moduleContext = context;
} );

QUnit.moduleDone( function( context ) {
	moduleDone++;
	moduleDoneContext = context;
} );

QUnit.testStart( function( context ) {
	testStart++;
	testContext = context;
} );

QUnit.testDone( function( context ) {
	testDone++;
	testDoneContext = context;
} );

QUnit.log( function( context ) {
	log++;
	logContext = context;
} );

QUnit.module( module1Context.name );

QUnit.test( module1Test1.name, function( assert ) {
	assert.expect( 18 );

	assert.equal(
		typeof totalTests,
		"number",
		"QUnit.begin should pass total amount of tests to callback"
	);

	while ( beginModules.length > 2 ) {
		beginModules.pop();
	}

	assert.deepEqual(
		beginModules,
		[ module1Context, module2Context ],
		"QUnit.begin details registered modules and their respective tests"
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
		name: module1Test1.name,
		module: module1Context.name,
		result: true,
		message: "log runtime was a reasonable number",
		actual: true,
		expected: true,
		negative: false,
		testId: module1Test1.testId
	}, "log context after equal(actual, expected, message)" );

	assert.equal( "foo", "foo" );

	delete logContext.runtime;
	assert.deepEqual( logContext, {
		name: module1Test1.name,
		module: module1Context.name,
		result: true,
		message: undefined,
		actual: "foo",
		expected: "foo",
		negative: false,
		testId: module1Test1.testId
	}, "log context after equal(actual, expected)" );

	assert.ok( true, "ok(true, message)" );

	delete logContext.runtime;
	assert.deepEqual( logContext, {
		module: module1Context.name,
		name: module1Test1.name,
		result: true,
		message: "ok(true, message)",
		actual: true,
		expected: true,
		negative: false,
		testId: module1Test1.testId
	}, "log context after ok(true, message)" );

	assert.strictEqual( testDoneContext, undefined, "testDone context" );
	assert.deepEqual( testContext, {
		module: module1Context.name,
		name: module1Test1.name,
		testId: module1Test1.testId
	}, "test context" );

	assert.strictEqual( moduleDoneContext, undefined, "moduleDone context" );
	assert.deepEqual( moduleContext, module1Context, "module context" );

	assert.equal( log, 17, "QUnit.log calls" );
} );

QUnit.test( module1Test2.name, function( assert ) {
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

	// Delete testDoneContext.assertions so we can easily jump to next assertion
	delete testDoneContext.assertions;

	// Delete testDoneContext.source
	delete testDoneContext.source;

	assert.deepEqual( testDoneContext, {
		module: module1Context.name,
		name: module1Test1.name,
		failed: 0,
		passed: 18,
		total: 18,
		testId: module1Test1.testId,
		skipped: false
	}, "testDone context" );
	assert.deepEqual( testContext, {
		module: module1Context.name,
		name: module1Test2.name,
		testId: module1Test2.testId
	}, "test context" );

	assert.strictEqual( moduleDoneContext, undefined, "moduleDone context" );
	assert.deepEqual( moduleContext, module1Context, "module context" );
	assert.equal( log, 29, "QUnit.log calls" );
} );

QUnit.module( module2Context.name );

QUnit.test( module2Test1.name, function( assert ) {
	assert.expect( 10 );
	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 2, "QUnit.moduleStart calls" );
	assert.equal( testStart, 3, "QUnit.testStart calls" );
	assert.equal( testDone, 2, "QUnit.testDone calls" );
	assert.equal( moduleDone, 1, "QUnit.moduleDone calls" );

	assert.deepEqual( testContext, {
		module: module2Context.name,
		name: module2Test1.name,
		testId: module2Test1.testId
	}, "test context" );

	assert.equal(
		moduleDoneContext.runtime >= 0 && moduleDoneContext.runtime < 5000,
		true,
		"module runtime was a reasonable number"
	);
	delete moduleDoneContext.runtime;

	assert.deepEqual( moduleDoneContext, {
		name: module1Context.name,
		tests: module1Context.tests,
		failed: 0,
		passed: 30,
		total: 30
	}, "moduleDone context" );
	assert.deepEqual( moduleContext, module2Context, "module context" );

	assert.equal( log, 39, "QUnit.log calls" );
} );

QUnit.test( module2Test2.name, function( assert ) {
	assert.expect( 8 );
	assert.equal( begin, 1, "QUnit.begin calls" );
	assert.equal( moduleStart, 2, "QUnit.moduleStart calls" );
	assert.equal( testStart, 4, "QUnit.testStart calls" );
	assert.equal( testDone, 3, "QUnit.testDone calls" );
	assert.equal( moduleDone, 1, "QUnit.moduleDone calls" );

	assert.deepEqual( testContext, {
		module: module2Context.name,
		name: module2Test2.name,
		testId: module2Test2.testId
	}, "test context" );
	assert.deepEqual( moduleContext, module2Context, "module context" );

	assert.equal( log, 47, "QUnit.log calls" );
} );

QUnit.skip( module2Test3.name );

QUnit.test( module2Test4.name, function( assert ) {
	assert.expect( 1 );

	delete testDoneContext.source;

	assert.deepEqual( testDoneContext, {
		assertions: [],
		module: module2Context.name,
		name: module2Test3.name,
		failed: 0,
		passed: 0,
		total: 0,
		skipped: true,
		testId: module2Test3.testId,
		runtime: 0
	}, "testDone context" );
} );

testAutorun = true;

QUnit.done( function() {

	if ( !testAutorun ) {
		return;
	}

	testAutorun = false;

	moduleStart = moduleDone = 0;

	// Since these tests run *after* done, and as such
	// QUnit is not able to know whether more tests are coming
	// the module starts/ends after each test.
	QUnit.module( "autorun" );

	setTimeout( function() {
		QUnit.test( "first", function( assert ) {
			assert.equal( moduleStart, 1, "test started" );
			assert.equal( moduleDone, 0, "test in progress" );
		} );

		QUnit.test( "second", function( assert ) {
			assert.equal( moduleStart, 2, "test started" );
			assert.equal( moduleDone, 1, "test in progress" );
		} );
	}, 5000 );
} );
