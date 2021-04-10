if ( !location.search ) {
	location.replace( "?hidepassed=true" );
}

QUnit.module( "urlParams hidepassed module", function() {
	QUnit.test( "passed 1", function( assert ) {
		assert.true( true );
	} );
	QUnit.test( "passed 2", function( assert ) {
		assert.true( true );
	} );
	QUnit.test( "passed 3", function( assert ) {
		assert.true( true );
	} );
	QUnit.test( "passed 4", function( assert ) {
		assert.true( true );
	} );
	QUnit.test( "passed 5", function( assert ) {
		assert.true( true );
	} );
	QUnit.test( "passed 6", function( assert ) {
		assert.true( true );
	} );
	QUnit.skip( "skipped 1", function( assert ) {
		assert.true( false, "can't seem to get this working" );
	} );

	QUnit.test( "passed 7", function( assert ) {

		// we have to set it to 1 because there is currently one item being rendered, this one as it is in progress
		assert.strictEqual( document.getElementById( "qunit-tests" ).children.length, 1 );
	} );
} );
