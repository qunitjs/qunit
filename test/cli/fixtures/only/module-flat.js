
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
