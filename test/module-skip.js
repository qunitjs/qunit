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
			"1d56e5b5": {
				skipped: false,
				todo: false
			},
			"d40f1738": {
				skipped: true,
				todo: false
			},
			"acdd0267": {
				skipped: true,
				todo: false
			},
			"8b1c454f": {
				skipped: true,
				todo: false
			}
		} );
	} );
} );

QUnit.module( "Parent module", function() {
	QUnit.module( "A normal module", function() {
		QUnit.test( "normal test", function( assert ) {
			assert.ok( true, "this test should run" );
		} );
	} );

	QUnit.module.skip( "This module will be skipped", function() {
		QUnit.test( "test will be treated as a skipped test", function( assert ) {
			assert.ok( false, "this test should not run" );
		} );

		QUnit.todo( "a todo test that should be skipped", function( assert ) {
			assert.ok( false, "this test should not run" );
		} );

		QUnit.skip( "a normal skipped test", function( assert ) {
			assert.ok( false, "this test should not run" );
		} );
	} );
} );
