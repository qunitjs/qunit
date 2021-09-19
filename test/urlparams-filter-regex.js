QUnit.config.filter = "/foo|bar/i";

QUnit.module( "QUnit.config.filter with case-insensitive regular expression" );

QUnit.test( "foo test should be run", function( assert ) {
	assert.true( true, "foo test should be run" );
} );

QUnit.test( "boo test should not be run", function( assert ) {
	assert.true( false, "boo test should not be run" );
} );

QUnit.test( "bar test should be run", function( assert ) {
	assert.true( true, "bar test should be run" );
} );

QUnit.test( "baz test should not be run", function( assert ) {
	assert.true( false, "baz test should not be run" );
} );
