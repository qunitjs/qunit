QUnit.config.module = "Foo";

QUnit.module( "Foo" );

QUnit.test( "Foo test should be run", function( assert ) {
	assert.true( true, "Foo test should be run" );
} );

QUnit.module( "foo" );

QUnit.test( "foo test should be run", function( assert ) {
	assert.true( true, "foo test should be run" );
} );

QUnit.module( "Bar" );

QUnit.test( "Bar test should not be run", function( assert ) {
	assert.true( false, "Bar test should not be run" );
} );

QUnit.module( "Foo Bar" );

QUnit.test( "Foo Bar test should not be run", function( assert ) {
	assert.true( false, "Foo Bar test should not be run" );
} );

QUnit.module( "Foo", function() {
	QUnit.module( "Bar", function() {
		QUnit.test( "Bar submodule test should run", function( assert ) {
			assert.true( true, "Bar submodule test should run" );
		} );
	} );

	QUnit.module( "Boo", function() {
		QUnit.test( "Boo submodule test should run", function( assert ) {
			assert.true( true, "Boo submodule test should run" );
		} );
	} );
} );

QUnit.module( "Bar", function() {
	QUnit.module( "Foo", function() {
		QUnit.test( "Foo submodule test should not run", function( assert ) {
			assert.true( false, "Foo submodule test should not run" );
		} );
	} );

	QUnit.module( "Boo", function() {
		QUnit.test( "Boo submodule test should not run", function( assert ) {
			assert.true( false, "Boo submodule test should not run" );
		} );
	} );
} );
