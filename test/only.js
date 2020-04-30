QUnit.module( "QUnit.only", function( hooks ) {
	let testsRun = 0;

	hooks.after( function( assert ) {
		assert.strictEqual( testsRun, 2 );
	} );

	QUnit.test( "implicitly skipped test", function( assert ) {
		assert.ok( false, "test should be skipped" );
	} );

	QUnit.only( "run this test", function( assert ) {
		testsRun += 1;
		assert.ok( true, "only this test should run" );
	} );

	QUnit.test( "another implicitly skipped test", function( assert ) {
		assert.ok( false, "test should be skipped" );
	} );

	QUnit.only( "all tests with only run", function( assert ) {
		testsRun += 1;
		assert.ok( true, "this test should run as well" );
	} );
} );
