QUnit.config.filter = "!foo|bar";

QUnit.module( "QUnit.config.filter" );

QUnit.test( "foo test should be run", function( assert ) {
	assert.ok( true, "foo test should be run" );
} );

QUnit.test( "bar test should be run", function( assert ) {
	assert.ok( true, "bar test should be run" );
} );

QUnit.test( "foo|bar test should not be run", function( assert ) {
	assert.ok( false, "baz test should not be run" );
} );
