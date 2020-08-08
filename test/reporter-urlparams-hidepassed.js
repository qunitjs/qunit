if ( !location.search ) {
	location.replace( "?hidepassed=true" );
}

QUnit.module( "urlParams hidepassed module", function() {
	QUnit.test( "passed", function( assert ) {
		assert.true( true );
	} );
	QUnit.test( "passed", function( assert ) {
		assert.true( true );
	} );
	QUnit.test( "passed", function( assert ) {
		assert.true( true );
	} );
	QUnit.test( "passed", function( assert ) {
		assert.true( true );
	} );
	QUnit.test( "passed", function( assert ) {
		assert.true( true );
	} );
	QUnit.test( "passed", function( assert ) {
		assert.true( true );
	} );
	QUnit.skip( "skipped", function( assert ) {
		assert.true( false, "can't seem to get this working" );
	} );

	QUnit.test( "passed", function( assert ) {

		// we have to set it to 1 because there is currently one item being rendered, this one as it is in progress
		assert.strictEqual( document.getElementById( "qunit-tests" ).children.length, 1 );
	} );
} );
