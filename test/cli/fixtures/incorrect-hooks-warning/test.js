QUnit.module( "module providing hooks", function( hooks ) {
	QUnit.module( "module not providing hooks", function() {
		// eslint-disable-next-line qunit/no-hooks-from-ancestor-modules
		hooks.beforeEach( function() {} );
		QUnit.test( "has a test", function( assert ) {
			assert.true( true );
		} );
	} );
} );
