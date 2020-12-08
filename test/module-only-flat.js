
QUnit.config.reorder = false;
var tests = [];
var done = false;

QUnit.testDone( function( details ) {
	if ( done ) {
		return;
	}

	tests.push( {
		name: details.name,
		module: details.module,
		skipped: details.skipped,
		todo: details.todo
	} );
} );

QUnit.done( function() {
	if ( done ) {
		return;
	}

	done = true;

	QUnit.test.only( "Compare stats", function( assert ) {
		assert.expect( 1 );

		assert.deepEqual( tests, [
			{
				name: "test B",
				module: "Tests > module B",
				skipped: false,
				todo: true
			},
			{
				name: "test C",
				module: "Tests > module B",
				skipped: true,
				todo: false
			},
			{
				name: "test D",
				module: "Tests > module B",
				skipped: false,
				todo: false
			}
		] );
	} );
} );

// use one big outer module so that the last "done" comparison can be made independently
QUnit.module( "Tests", function() {

	QUnit.module( "module A" );
	QUnit.test( "test A", function( assert ) {
		assert.true( false, "this test should not run" );
	} );

	QUnit.module.only( "module B" );
	QUnit.todo( "test B", function( assert ) {
		assert.true( false, "not implemented yet" );
	} );
	QUnit.skip( "test C", function( assert ) {
		assert.true( false, "test should be skipped" );
	} );
	QUnit.test( "test D", function( assert ) {
		assert.true( true, "this test should run" );
	} );

	QUnit.module( "module C" );
	QUnit.todo( "test E", function( assert ) {
		assert.true( false, "not implemented yet" );
	} );
	QUnit.skip( "test F", function( assert ) {
		assert.true( false, "test should be skipped" );
	} );
	QUnit.test( "test G", function( assert ) {
		assert.true( false, "this test should not run" );
	} );

} );
