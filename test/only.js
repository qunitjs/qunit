QUnit.module( "QUnit.only" );

QUnit.test( "implicitly skipped test", function( assert ) {
	assert.ok( false, "test should be skipped" );
} );

QUnit.only( "only run this test", function( assert ) {
	assert.ok( true, "only this test should run" );
} );

QUnit.test( "another implicitly skipped test", function( assert ) {
	assert.ok( false, "test should be skipped" );
} );

QUnit.only( "ignore the subsequent calls to only", function( assert ) {
	assert.ok( false, "this test should be skipped" );
} );
