// case-insensitive string that looks like a regex but isn't, inverted
QUnit.config.filter = "!foo|bar";

QUnit.module( "filter" );

QUnit.test( "foo test", function( assert ) {
	assert.true( true );
} );

QUnit.test( "bar test", function( assert ) {
	assert.true( true );
} );

QUnit.test( "foo|bar test", function( assert ) {
	assert.true( false, "'foo|bar' is excluded" );
} );
