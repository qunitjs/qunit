QUnit.module( "test.each", function() {
	QUnit.test.each( [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], "test.each", function( assert, a, b, result ) {
		assert.strictEqual( a + b, result );
	} );
} );
QUnit.module( "test.each.skip", function() {
	QUnit.test( "do run", function( assert ) { assert.true( true ); } );
	QUnit.test.each.skip( [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], "test.each.skip", function( assert, a, b, result ) {
		assert.strictEqual( a + b, -result );
	} );
} );
