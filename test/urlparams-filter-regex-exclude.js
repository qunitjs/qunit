QUnit.config.filter = "!/Foo|bar/";

QUnit.module( "QUnit.config.filter with excluding, case-sensitive regular expression" );

QUnit.test( "foo test should be run", function( assert ) {
	assert.true( true, "foo test should be run" );
} );

QUnit.test( "Foo test should not be run", function( assert ) {
	assert.true( false, "Foo test should not be run" );
} );

QUnit.test( "Bar test should be run", function( assert ) {
	assert.true( true, "Bar test should be run" );
} );

QUnit.test( "bar test should not be run", function( assert ) {
	assert.true( false, "bar test should not be run" );
} );
