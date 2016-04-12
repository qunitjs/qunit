/* global beginData */
define( [ "qunit" ], function( QUnit ) {

return function() {
	QUnit.module( "AMD autostart", {
		after: function( assert ) {
			assert.ok( true, "after hook ran" );
		}
	} );

	QUnit.test( "Prove the test run started as expected", function( assert ) {
		assert.expect( 2 );
		assert.strictEqual( beginData.totalTests, 1, "Should have expected 1 test" );
	} );

	setTimeout( function() {
		QUnit.test( "Async-loaded tests should not run after hook again", function( assert ) {
			assert.expect( 0 );
		} );
	}, 5000 );
};

} );
