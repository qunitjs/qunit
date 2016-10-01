var mockStorage = require( "./storage.js" );

QUnit.module( "Storage #2", function() {
	QUnit.test( "clears all qunit-test-* items after a successful run", function( assert ) {
		assert.strictEqual(
			mockStorage.getItem( "should-not-remove" ),
			true,
			"state was persisted from last test"
		);
		assert.strictEqual(
			mockStorage.getItem( "qunit-test-should-remove" ),
			null,
			"removed first test"
		);
		assert.strictEqual(
			mockStorage.getItem( "qunit-test-should-also-remove" ),
			null,
			"removed second test"
		);
	} );
} );
