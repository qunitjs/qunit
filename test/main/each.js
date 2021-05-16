QUnit.module( "test.each", function() {
	QUnit.test.each( "test.each", [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], function( assert, data ) {
		assert.strictEqual( data[ 0 ] + data[ 1 ], data[ 2 ] );
	} );
	QUnit.test.each( "test.each returning a Promise", [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], function( assert, data ) {
		function sum( a, b ) {
			return new Promise( function( resolve ) {
				resolve( a + b );
			} );
		}
		return sum( data[ 0 ], data[ 1 ] ).then( function( result ) { assert.strictEqual( result, data[ 2 ] ); } );
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
QUnit.module( "test.skip.each", function() {
	QUnit.test( "do run", function( assert ) { assert.true( true ); } );
	QUnit.test.skip.each( "test.skip.each", [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], function( assert ) {
		assert.true( false );
	} );
} );
QUnit.module( "test.todo.each", function() {
	QUnit.test.todo.each( "test.todo.each", [ [ 1, 2, 3 ], [ 1, 1, 2 ] ], function( assert ) {
		assert.true( false );
	} );
} );
