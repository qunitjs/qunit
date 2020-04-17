var modules = {};

var done = false;

QUnit.testDone( function( details ) {
	if ( done ) {
		return;
	}

	if ( !modules.hasOwnProperty( details.module ) ) {
		modules[ details.module ] = {
			tests: {}
		};
	}

	modules[ details.module ].tests[ details.testId ] = {
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

		assert.deepEqual( modules, {
			"module B > This module should run": {
				tests: {
					"a8c939f5": {
						skipped: false,
						todo: true
					},
					"1b2a6d78": {
						skipped: true,
						todo: false
					},
					"fef3c2f3": {
						skipped: false,
						todo: false
					}
				}
			},
			"module B > This module should also run": {
				tests: {
					"ca35de8a": {
						skipped: false,
						todo: true
					},
					"3d03da8d": {
						skipped: true,
						todo: false
					},
					"20606788": {
						skipped: false,
						todo: false
					}
				}
			},
			"module D should also run": {
				tests: {
					"ebe63500": {
						skipped: false,
						todo: true
					},
					"4b483003": {
						skipped: true,
						todo: false
					},
					"4210bdfe": {
						skipped: false,
						todo: false
					}
				}
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

	QUnit.module.some( "This module should run", function() {
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

	QUnit.module.some( "This module should also run", function() {
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

QUnit.module.some( "module D should also run", function() {
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
