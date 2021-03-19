QUnit.module.only( "test.each.only", function() {
	QUnit.test( "don't run", function( assert ) { assert.true( false ); } );
	QUnit.test.each.only( [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], "test.each.only", function( assert, a, b, result ) {
		assert.strictEqual( a + b, result );
	} );
} );
