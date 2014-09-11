/*global asyncDelay, times, beginData */

QUnit.start();

QUnit.module( "autostart" );

QUnit.test( "Prove the test run started as expected", function( assert ) {
	assert.expect( 4 );
	assert.ok( times.autostartOff <= times.pageLoaded );
	assert.ok( times.pageLoaded <= times.runStarted );
	assert.ok( times.autostartOff + asyncDelay <= times.runStarted );
	assert.strictEqual( beginData.totalTests, 1, "Should have expected 1 test" );
});
