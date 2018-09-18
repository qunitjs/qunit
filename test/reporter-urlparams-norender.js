if ( !location.search ) {
	location.replace( "?norender=passed,skipped" );
}

// Don't change this module name without also changing the module parameter when loading this suite
QUnit.module( "urlParams norender module", function() {
	QUnit.skip( "Skip", function() {} );
	QUnit.skip( "Skip", function() {} );

	QUnit.test( "Should set norender correctly", function( assert ) {
		assert.strictEqual( QUnit.config.norender, "passed,skipped" );
	} );

	QUnit.test( "Ensure that no tests were rendered", function( assert ) {

		// we have to set it to 1 becuase there is currently one item being rendered, this one as it is in progress
		assert.strictEqual( document.querySelector( "#qunit-tests" ).children.length, 1 );
	} );
} );
