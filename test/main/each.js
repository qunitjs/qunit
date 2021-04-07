QUnit.module( "test.each", function() {
	QUnit.test.each( "test.each", [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], function( assert, a, b, result ) {
		assert.strictEqual( a + b, result );
	} );
	QUnit.test.each( "test.each returning a Promise", [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], function( assert, a, b, expected ) {
		function sum( a, b ) {
			return new Promise( function( resolve ) {
				resolve( a + b );
			} );
		}
		return sum( a, b ).then( function( result ) { assert.strictEqual( result, expected ); } );
	} );
	QUnit.test.each( "test.each 1D", [ 1, [], "some" ], function( assert, value ) {
		assert.true( Boolean( value ) );
	} );
	QUnit.test.each( "test.each fails with non-array input", [ "something", 1, undefined, null, {} ], function( assert, value ) {
		assert.throws( function() {
			QUnit.test.each( "test.each 1D", value, function() { } );
		} );
	} );
} );
QUnit.module( "test.each.skip", function() {
	QUnit.test( "do run", function( assert ) { assert.true( true ); } );
	QUnit.test.each.skip( "test.each.skip", [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], function( assert ) {
		assert.true( false );
	} );
} );
QUnit.module( "test.each.todo", function() {
	QUnit.test.each.todo( "test.each.todo", [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], function( assert ) {
		assert.true( false );
	} );
} );
