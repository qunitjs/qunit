QUnit.module( "test.each", function() {
	QUnit.test.each( "test.each", [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], function( assert, a, b, result ) {
		assert.strictEqual( a + b, result );
	} );
	QUnit.test.each( "test.each 1D", [ 1, [], "some" ], function( assert, value ) {
		assert.true( Boolean( value ) );
	} );
} );
QUnit.module( "test.each.skip", function() {
	QUnit.test( "do run", function( assert ) { assert.true( true ); } );
	QUnit.test.each.skip( "test.each.skip", [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], function( assert, a, b, result ) {
		assert.strictEqual( a + b, -result );
	} );
} );
