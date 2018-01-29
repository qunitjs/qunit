QUnit.module( "assert.timeout", function() {
	QUnit.test( "pushes a failure if test times out when using async", function( assert ) {
		assert.timeout( 10 );
		assert.expect( 1 );

		var originalPushFailure = QUnit.config.current.pushFailure;
		QUnit.config.current.pushFailure = function pushFailureStub( message ) {
			QUnit.config.current.pushFailure = originalPushFailure;

			assert.equal( message, "Test took longer than 10ms; test timed out." );
		};

		assert.async();
	} );

	QUnit.test( "pushes a failure if test times out when using a promise", function( assert ) {
		assert.timeout( 10 );
		assert.expect( 1 );

		var originalPushFailure = QUnit.config.current.pushFailure;
		QUnit.config.current.pushFailure = function pushFailureStub( message ) {
			QUnit.config.current.pushFailure = originalPushFailure;

			assert.equal( message, "Test took longer than 10ms; test timed out." );
		};

		// Return a "thenable" to serve as a mock Promise
		return {
			then: function() {}
		};
	} );

	QUnit.test( "does not push a failure if test is synchronous", function( assert ) {
		assert.timeout( 1 );

		var wait = Date.now() + 10;
		while ( Date.now() < wait ) {} // eslint-disable-line no-empty

		assert.ok( true );
	} );

	QUnit.test( "throws an error if a non-numeric value is passed as duration", function( assert ) {
		assert.throws( function() {
			assert.timeout( null );
		}, /You must pass a number as the duration to assert.timeout/ );
	} );

	QUnit.module( "a value of zero", function() {
		function stubPushFailure( assert ) {
			var originalPushFailure = QUnit.config.current.pushFailure;
			QUnit.config.current.pushFailure = function pushFailureStub( message ) {
				QUnit.config.current.pushFailure = originalPushFailure;

				assert.equal(
					message,
					"Test did not finish synchronously even though assert.timeout( 0 ) was used."
				);
			};
		}

		QUnit.test( "does not fail a synchronous test using assert.async", function( assert ) {
			assert.timeout( 0 );
			var done = assert.async();
			assert.ok( true );
			done();
		} );

		QUnit.test( "fails a test using assert.async and a setTimeout of 0", function( assert ) {
			assert.timeout( 0 );
			assert.expect( 1 );

			stubPushFailure( assert );

			var done = assert.async();
			setTimeout( done, 0 );
		} );

		if ( typeof Promise !== "undefined" ) {
			QUnit.test( "fails a test returning an immediately resolved Promise", function( assert ) {
				assert.timeout( 0 );
				assert.expect( 1 );

				stubPushFailure( assert );

				return Promise.resolve();
			} );

			QUnit.test( "fails a test using assert.async and an immediately resolved Promise", function( assert ) {
				assert.timeout( 0 );
				assert.expect( 1 );

				stubPushFailure( assert );

				var done = assert.async();
				Promise.resolve().then( done );
			} );
		}
	} );
} );


