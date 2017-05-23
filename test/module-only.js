var tests = {};

var done = false;

QUnit.testDone( function( details ) {
	if ( done ) {
		return;
	}

	tests[ details.testId ] = {
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
		assert.expect( 1 );

		assert.deepEqual( tests, {
			"1fb73641": {
				skipped: false,
				todo: true
			},
			"5fe457c4": {
				skipped: true,
				todo: false
			},
			"75e1bf3f": {
				skipped: false,
				todo: false
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

		QUnit.test( "normal test", function( assert ) {
			assert.ok( true, "this test should run" );
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
