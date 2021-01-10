
QUnit.module( "module A", function() {
	QUnit.test( "test A", function( assert ) {
		assert.true( false, "this test should not run" );
	} );
} );

QUnit.module( "module B", function() {
	QUnit.module( "This module should not run", function() {
		QUnit.test( "normal test", function( assert ) {
			assert.true( false, "this test should not run" );
		} );
	} );

	QUnit.module.only( "Only this module should run", function() {
		QUnit.todo( "a todo test", function( assert ) {
			assert.true( false, "not implemented yet" );
		} );

		QUnit.skip( "implicitly skipped test", function( assert ) {
			assert.true( false, "test should be skipped" );
		} );

		QUnit.test( "normal test", function( assert ) {
			assert.true( true, "this test should run" );
		} );
	} );

	QUnit.module( "This also should not run", function() {
		QUnit.test( "normal test", function( assert ) {
			assert.true( false, "this test should not run" );
		} );
	} );
} );

QUnit.module( "module C", function() {
	QUnit.test( "test C", function( assert ) {
		assert.true( false, "this test should not run" );
	} );
} );

QUnit.module.only( "module D", function() {
	QUnit.test( "test D", function( assert ) {
		assert.true( true, "this test should run as well" );
	} );
} );

QUnit.module.only( "module E", function() {
	QUnit.module( "module F", function() {
		QUnit.test( "test F", function( assert ) {
			assert.true( true, "this test should run as well" );
		} );
	} );

	QUnit.test( "test E", function( assert ) {
		assert.true( true, "this test should run as well" );
	} );
} );

QUnit.module.skip( "module G", function() {
	QUnit.module.only( "module H", function() {
		QUnit.test( "test H", function( assert ) {
			assert.true( false, "this test should not run" );
		} );
	} );

	QUnit.test( "test G", function( assert ) {
		assert.true( false, "this test should not run" );
	} );
} );

QUnit.module.todo( "module I", function() {
	QUnit.test( "test I", function( assert ) {
		assert.true( false, "this test should not run" );
	} );
} );
