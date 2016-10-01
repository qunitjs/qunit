var lastTest = "",
	mockStorage = require( "./storage.js" );

mockStorage.setItem( "qunit-test-Storage #1-Should be run first", 1 );
QUnit.config.storage = mockStorage;

QUnit.module( "Storage #1", function() {
	QUnit.test( "Passing test", function( assert ) {
		assert.strictEqual( lastTest, "Should be run first", "test is run second" );
		mockStorage.setItem( "qunit-test-Storage #1-Passing test", true );
	} );

	QUnit.test( "Removes passing tests from storage", function( assert ) {
		assert.strictEqual( mockStorage.getItem( "qunit-test-Storage #1-Passing test" ), null );
	} );

	// Verifies test reordering by storage values
	QUnit.test( "Should be run first", function( assert ) {
		assert.strictEqual( lastTest, "" );
		lastTest = "Should be run first";
	} );
} );

QUnit.done( function() {
	mockStorage.setItem( "qunit-test-should-remove", true );
	mockStorage.setItem( "should-not-remove", true );
	mockStorage.setItem( "qunit-test-should-also-remove", true );
} );
