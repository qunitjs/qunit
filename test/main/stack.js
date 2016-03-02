( function() {
	var stack = QUnit.stack();

	QUnit.module( "QUnit.stack" );

	// Flag this test as skipped on browsers that doesn't support stack trace
	QUnit[ stack ? "test" : "skip" ]( "returns the proper stack line", function( assert ) {
		assert.ok( /(\/|\\)test(\/|\\)main(\/|\\)stack\.js/.test( stack ) );

		stack = QUnit.stack( 2 );
		assert.ok( stack, "can use offset argument to return a different stacktrace line" );
		assert.notOk( /\/test\/main\/stack\.js/.test( stack ), "stack with offset argument" );
	} );
}() );
