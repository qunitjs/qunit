QUnit.module( "QUnit.onError", function() {
	QUnit.test( "Should call pushFailure when inside a test", function( assert ) {
		assert.expect( 3 );

		QUnit.config.current.pushFailure = function( message, source ) {
			assert.strictEqual( message, "Error message", "Message is correct" );
			assert.strictEqual( source, "filePath.js:1", "Source is correct" );
		};

		var result = QUnit.onError( {
			message: "Error message",
			fileName: "filePath.js",
			lineNumber: 1
		} );

		assert.strictEqual( result, false, "onError should allow other error handlers to run" );
	} );

	QUnit.test( "Should use stacktrace argument when it is present", function( assert ) {
		assert.expect( 3 );

		QUnit.config.current.pushFailure = function( message, source ) {
			assert.strictEqual( message, "Error message", "Message is correct" );
			assert.strictEqual(
				source,
				"DummyError\nfilePath.js:1 foo()\nfilePath.js:2 bar()",
				"Source is correct"
			);
		};

		var result = QUnit.onError( {
			message: "Error message",
			fileName: "filePath.js",
			lineNumber: 1,
			stacktrace: "DummyError\nfilePath.js:1 foo()\nfilePath.js:2 bar()"
		} );

		assert.strictEqual( result, false, "onError should allow other error handlers to run" );
	} );


	QUnit.test( "Shouldn't push failure if ignoreGlobalErrors is enabled", function( assert ) {
		assert.expect( 1 );

		QUnit.config.current.pushFailure = function() {
			assert.true( false, "No error should be pushed" );
		};

		QUnit.config.current.ignoreGlobalErrors = true;

		var result = QUnit.onError( {
			message: "Error message",
			fileName: "filePath.js",
			lineNumber: 1
		} );

		assert.strictEqual( result, true, "onError should not allow other error handlers to run" );
	} );
} );
