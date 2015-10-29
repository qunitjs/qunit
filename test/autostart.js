/*global times, beginData */

QUnit.start();

QUnit.module( "autostart" );

QUnit.test( "Prove the test run started as expected", function( assert ) {
	assert.expect( 2 );
	assert.ok( times.autostartOff <= times.runStarted );
	assert.strictEqual( beginData.totalTests, 1, "Should have expected 1 test" );
} );
