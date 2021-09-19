if ( !location.search ) {
	location.replace( "?hidepassed=true" );
}

QUnit.module( "hidepassed", function() {
	QUnit.test( "passed 1", function( assert ) {
		assert.true( true );
	} );
	QUnit.test( "passed 2", function( assert ) {
		assert.true( true );
	} );
	QUnit.test( "passed 3", function( assert ) {
		assert.true( true );
	} );
	QUnit.skip( "skipped 1", function( assert ) {
		assert.true( false, "can't seem to get this working" );
	} );
	QUnit.test( "passed 4", function( assert ) {

		// We expect 1 rather than 0 because the current test is in progress,
		// and in-progress tests are always rendered.
		// It will become hidden once it passed
		assert.strictEqual( document.getElementById( "qunit-tests" ).children.length, 1 );
	} );
	QUnit.test( "config parsed", function( assert ) {
		assert.strictEqual( QUnit.config.hidepassed, "true" );
	} );
	QUnit.test( "interface", function( assert ) {
		var node = document.getElementById( "qunit-urlconfig-hidepassed" );
		assert.strictEqual( node.nodeName, "INPUT" );
		assert.strictEqual( node.checked, true );
	} );
} );
