QUnit.module( "QUnit.onError", function() {
	QUnit.test( "call pushFailure when inside a test", function( assert ) {
		assert.expect( 2 );

		var original = assert.pushResult;
		var pushed = null;
		assert.pushResult = function( result ) {
			pushed = result;
			assert.pushResult = original;
		};

		var suppressed = QUnit.onError( {
			message: "Error message",
			fileName: "filePath.js",
			lineNumber: 1
		} );

		assert.strictEqual( suppressed, false, "onError should allow other error handlers to run" );
		assert.propEqual( pushed, {
			result: false,
			message: "global failure: Error: Error message",
			source: "filePath.js:1"
		}, "pushed result" );
	} );

	QUnit.test( "use stacktrace argument", function( assert ) {
		assert.expect( 2 );

		var original = assert.pushResult;
		var pushed = null;
		assert.pushResult = function( result ) {
			pushed = result;
			assert.pushResult = original;
		};

		var suppressed = QUnit.onError( {
			message: "Error message",
			fileName: "filePath.js",
			lineNumber: 1,
			stacktrace: "DummyError\nfilePath.js:1 foo()\nfilePath.js:2 bar()"
		} );

		assert.strictEqual( suppressed, false, "onError should allow other error handlers to run" );
		assert.propEqual( pushed, {
			result: false,
			message: "global failure: Error: Error message",
			source: "DummyError\nfilePath.js:1 foo()\nfilePath.js:2 bar()"
		}, "pushed result" );
	} );


	QUnit.test( "ignore failure when ignoreGlobalErrors is enabled", function( assert ) {
		assert.expect( 1 );

		assert.test.pushFailure = function() {
			assert.true( false, "No error should be pushed" );
		};

		assert.test.ignoreGlobalErrors = true;

		var result = QUnit.onError( {
			message: "Error message",
			fileName: "filePath.js",
			lineNumber: 1
		} );

		assert.strictEqual( result, true, "onError should not allow other error handlers to run" );
	} );
} );
