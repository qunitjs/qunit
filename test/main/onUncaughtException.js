QUnit.module( "QUnit.onUncaughtException", function() {
	QUnit.test( "inside a test", function( assert ) {
		assert.expect( 1 );

		var original = assert.pushResult;
		var pushed = null;
		assert.pushResult = function( result ) {
			pushed = result;
		};

		var error = new TypeError( "Message here" );
		error.stack = "filePath.js:1";
		QUnit.onUncaughtException( error );

		assert.pushResult = original;

		assert.propEqual( pushed, {
			result: false,
			message: "global failure: TypeError: Message here",
			source: "filePath.js:1"
		}, "pushed result" );
	} );

	// The "outside a test" scenario is not covered by explicitly calling onUncaughtException().
	// Instead, this is covered by the more standalone CLI test cases.
	//
	// It didn't seem worth the mess to test this since all onUncaughtException() does is
	// increment numbers and call emit(). We'd have to both observe those happening in a
	// private space, and then subsequently reverse the side-effects, in order to still
	// have this test "pass".
} );
