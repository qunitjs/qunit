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
			"efa6d5f5": {
				skipped: false,
				todo: false
			},
			"d394a378": {
				skipped: false,
				todo: true
			},
			"ffd66a5e": {
				skipped: true,
				todo: false
			},
			"951df7ad": {
				skipped: false,
				todo: true
			}
		} );
	} );
} );

QUnit.module( "parent module", function() {
	QUnit.module( "a normal module", function() {
		QUnit.test( "normal test", function( assert ) {
			assert.ok( true, "this test should run" );
		} );
	} );

	QUnit.module.todo( "a todo module", function() {
		QUnit.todo( "a todo test", function( assert ) {
			assert.ok( false, "not implemented yet" );
		} );

		QUnit.skip( "a skipped test that will be left intact", function( assert ) {
			assert.ok( false, "not implemented yet" );
		} );

		QUnit.test( "a normal test that will be treated as a todo", function( assert ) {
			assert.ok( false, "not implemented yet" );
		} );
	} );
} );
