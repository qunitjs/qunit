QUnit.module( "urlParams performance mark module", function() {
	QUnit.test( "shouldn't fail if performance marks are cleared ", function( assert ) {
		performance.clearMarks();

		assert.true( true );
	} );
} );
