// regular expression (case-insensitive)
QUnit.config.filter = "/foo|bar/i";

QUnit.module( "filter" );

QUnit.test( "foo test", function( assert ) {
	assert.true( true );
} );

QUnit.test( "FOO test", function( assert ) {
	assert.true( true );
} );

QUnit.test( "boo test", function( assert ) {
	assert.true( false, "boo does not match" );
} );

QUnit.test( "bar test", function( assert ) {
	assert.true( true );
} );

QUnit.test( "baz test", function( assert ) {
	assert.true( false, "baz does not match" );
} );
