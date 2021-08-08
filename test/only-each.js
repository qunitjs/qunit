QUnit.module.only( "test.each.only", function() {
	QUnit.test( "don't run", function( assert ) { assert.true( false ); } );
	QUnit.test.only.each( "test.each.only", [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], function( assert, data ) {
		assert.strictEqual( data[ 0 ] + data[ 1 ], data[ 2 ] );
	} );
	QUnit.test.only.each( "test.each.only 1D", [ 1, [], "some" ], function( assert, value ) {
		assert.true( Boolean( value ) );
	} );
} );
