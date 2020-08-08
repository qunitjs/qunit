( function() {
	var stack = QUnit.stack();

	QUnit.module( "QUnit.stack" );

	// Flag this test as skipped on browsers that doesn't support stack trace
	QUnit[ stack ? "test" : "skip" ]( "returns the proper stack line", function( assert ) {
		assert.true( /(\/|\\)test(\/|\\)main(\/|\\)stack\.js/.test( stack ) );

		stack = QUnit.stack( 2 );
		assert.true( /(\/|\\)dist(\/|\\)qunit\.js/.test( stack ), "can use offset argument to return a different stacktrace line" );
		assert.false( /\/test\/main\/stack\.js/.test( stack ), "stack with offset argument" );
	} );
}() );
