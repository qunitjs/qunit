QUnit.config.filter = "/foo|bar/i";

QUnit.module( "QUnit.config.filter with case-insensitive regular expression" );

QUnit.test( "foo test should be run", function( assert ) {
	assert.ok( true, "foo test should be run" );
} );

QUnit.test( "boo test should not be run", function( assert ) {
	assert.ok( false, "boo test should not be run" );
} );

QUnit.test( "bar test should be run", function( assert ) {
	assert.ok( true, "bar test should be run" );
} );

QUnit.test( "baz test should not be run", function( assert ) {
	assert.ok( false, "baz test should not be run" );
} );
