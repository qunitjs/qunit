var tests = {};

var testsStats = {
	failed: 0, skipped: 0, todo: 0
};

var assertionsStats = {
	passed: 0, failed: 0
};

var done = false;

QUnit.testDone( function( details ) {
	if ( done ) {
		return;
	}

	assertionsStats.passed += details.passed;
	assertionsStats.failed += details.failed;

	if ( details.skipped ) {
		testsStats.skipped++;
	}

	if ( details.todo ) {
		testsStats.todo++;
	}

	if ( details.failed > 0 && !details.todo ) {
		testsStats.failed++;
	}

	tests[ details.testId ] = {
		name: details.name,
		module: details.module,
		skipped: details.skipped,
		todo: details.todo
	};
} );

QUnit.done( function() {
	if ( done ) {
		return;
	}

	done = true;

	QUnit.test( "Compare stats", function( assert ) {
		assert.expect( 3 );

		assert.deepEqual( testsStats, { failed: 0, skipped: 2, todo: 2 } );
		assert.deepEqual( assertionsStats, { failed: 2, passed: 1 } );
		assert.deepEqual( tests, {
			"1fb73641": {
				name: "a todo test",
				module: "module B > Only this module should run",
				skipped: false,
				todo: true
			},
			"5fe457c4": {
				name: "implicitly skipped test",
				module: "module B > Only this module should run",
				skipped: true,
				todo: false
			},
			"947dcda7": {
				name: "another implicitly skipped test",
				module: "module B > Only this module should run",
				skipped: true,
				todo: false
			},
			"75e1bf3f": {
				name: "normal test",
				module: "module B > Only this module should run",
				skipped: false,
				todo: false
			},
			"13aa3b63": {
				name: "another todo test",
				module: "module B > Only this module should run",
				skipped: false,
				todo: true
			}
		} );
	} );
} );

QUnit.module( "module A", function() {
	QUnit.test( "test A", function( assert ) {
		assert.ok( false, "this test should not run" );
	} );
} );

QUnit.module( "module B", function() {
	QUnit.module( "This module should not run", function() {
		QUnit.test( "normal test", function( assert ) {
			assert.ok( false, "this test should not run" );
		} );
	} );

	QUnit.module.only( "Only this module should run", function() {
		QUnit.todo( "a todo test", function( assert ) {
			assert.ok( false, "not implemented yet" );
		} );

		QUnit.skip( "implicitly skipped test", function( assert ) {
			assert.ok( false, "test should be skipped" );
		} );

		QUnit.skip( "another implicitly skipped test", function( assert ) {
			assert.ok( false, "test should be skipped" );
		} );

		QUnit.test( "normal test", function( assert ) {
			assert.ok( true, "this test should run" );
		} );

		QUnit.todo( "another todo test", function( assert ) {
			assert.ok( false, "not implemented yet" );
		} );
	} );

	QUnit.module( "This also should not run", function() {
		QUnit.test( "normal test", function( assert ) {
			assert.ok( false, "this test should not run" );
		} );
	} );
} );

QUnit.module( "module C", function() {
	QUnit.test( "test C", function( assert ) {
		assert.ok( false, "this test should not run" );
	} );
} );
