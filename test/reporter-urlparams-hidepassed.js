if ( !location.search ) {
	location.replace( "?hidepassed=true" );
}

QUnit.module( "urlParams hidepassed module", function() {
	QUnit.test( "passed", function( assert ) {
		assert.ok( true );
	} );
	QUnit.test( "passed", function( assert ) {
		assert.ok( true );
	} );
	QUnit.test( "passed", function( assert ) {
		assert.ok( true );
	} );
	QUnit.test( "passed", function( assert ) {
		assert.ok( true );
	} );
	QUnit.test( "passed", function( assert ) {
		assert.ok( true );
	} );
	QUnit.test( "passed", function( assert ) {
		assert.ok( true );
	} );

	QUnit.test( "passed", function( assert ) {

		// we have to set it to 1 becuase there is currently one item being rendered, this one as it is in progress
		assert.strictEqual( document.getElementById( "qunit-tests" ).children.length, 1 );
	} );
} );
