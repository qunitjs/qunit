/* global beginData */
define( [ "qunit" ], function( QUnit ) {

return function() {
	QUnit.module( "AMD autostart" );

	QUnit.test( "Prove the test run started as expected", function( assert ) {
		assert.expect( 1 );
		assert.strictEqual( beginData.totalTests, 1, "Should have expected 1 test" );
	} );
};

} );
