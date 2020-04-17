QUnit.module( "QUnit.some", function( hooks ) {

	let testsRun = 0;

	hooks.after( function( assert ) {
		assert.strictEqual( testsRun, 2 );
	} );


	QUnit.test( "implicitly skipped test", function( assert ) {
		assert.ok( false, "test should be skipped" );
	} );

	QUnit.some( "run this test", function( assert ) {
		testsRun += 1;
		assert.ok( true, "this test should run" );
	} );

	QUnit.some( "run this test as well", function( assert ) {
		testsRun += 1;
		assert.ok( true, "this test should run as well" );
	} );

	QUnit.test( "another implicitly skipped test", function( assert ) {
		assert.ok( false, "test should be skipped" );
	} );
} );
