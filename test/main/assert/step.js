QUnit.module( "assert.step" );

QUnit.test( "pushes a failing assertion if no message is given", function( assert ) {
	assert.expect( 3 );

	var originalPushResult = assert.pushResult;
	assert.pushResult = function pushResultStub( resultInfo ) {
		assert.pushResult = originalPushResult;

		assert.notOk( resultInfo.result );
		assert.equal( resultInfo.message, "You must provide a message to assert.step" );
	};

	assert.step();

	assert.verifySteps( [ undefined ] );
} );

QUnit.test( "pushes a failing assertion if empty message is given", function( assert ) {
	assert.expect( 3 );

	var originalPushResult = assert.pushResult;
	assert.pushResult = function pushResultStub( resultInfo ) {
		assert.pushResult = originalPushResult;

		assert.notOk( resultInfo.result );
		assert.equal( resultInfo.message, "You must provide a message to assert.step" );
	};

	assert.step( "" );

	assert.verifySteps( [ "" ] );
} );

QUnit.test( "pushes a failing assertion if a non string message is given", function( assert ) {
	assert.expect( 7 );

	var count = 0;
	var originalPushResult = assert.pushResult;

	assert.pushResult = function pushResultStub( resultInfo ) {
		assert.pushResult = originalPushResult;

		count += 1;

		assert.notOk( resultInfo.result );
		assert.equal( resultInfo.message, "You must provide a string value to assert.step" );

		if ( count < 3 ) {
			assert.pushResult = pushResultStub;
		}
	};

	assert.step( 1 );
	assert.step( null );
	assert.step( false );

	assert.verifySteps( [ 1, null, false ] );
} );

QUnit.test( "pushes a passing assertion if a message is given", function( assert ) {
	assert.expect( 3 );

	assert.step( "One step" );
	assert.step( "Two step" );

	assert.verifySteps( [ "One step", "Two step" ] );
} );

QUnit.module( "assert.verifySteps" );

QUnit.test( "verifies the order and value of steps", function( assert ) {
	assert.expect( 10 );

	assert.step( "One step" );
	assert.step( "Two step" );
	assert.step( "Red step" );
	assert.step( "Blue step" );

	assert.verifySteps( [ "One step", "Two step", "Red step", "Blue step" ] );

	assert.step( "One step" );
	assert.step( "Two step" );
	assert.step( "Red step" );
	assert.step( "Blue step" );

	var originalPushResult = assert.pushResult;
	assert.pushResult = function pushResultStub( resultInfo ) {
		assert.pushResult = originalPushResult;

		assert.notOk( resultInfo.result );
	};

	assert.verifySteps( [ "One step", "Red step", "Two step", "Blue step" ] );
} );

QUnit.test( "verifies the order and value of failed steps", function( assert ) {
	assert.expect( 3 );

	var originalPushResult = assert.pushResult;

	assert.step( "One step" );

	assert.pushResult = function noop() {};
	assert.step();
	assert.step( "" );
	assert.pushResult = originalPushResult;

	assert.step( "Two step" );

	assert.verifySteps( [ "One step", undefined, "", "Two step" ] );
} );

QUnit.test( "resets the step list after verification", function( assert ) {
	assert.expect( 4 );

	assert.step( "one" );
	assert.verifySteps( [ "one" ] );

	assert.step( "two" );
	assert.verifySteps( [ "two" ] );
} );

QUnit.test( "errors if not called when `assert.step` is used", function( assert ) {
	assert.expect( 2 );
	assert.step( "one" );

	var originalPushFailure = QUnit.config.current.pushFailure;
	QUnit.config.current.pushFailure = function pushFailureStub( message ) {
		QUnit.config.current.pushFailure = originalPushFailure;

		assert.equal( message, "Expected assert.verifySteps() to be called before end of test after using assert.step(). Unverified steps: one" );
	};
} );

// Testing to ensure steps array is not passed by reference: https://github.com/qunitjs/qunit/issues/1266
QUnit.module( "assert.verifySteps value reference", function() {

	var loggedAssertions = {};

	QUnit.log( function( details ) {

		if ( details.message === "verification-assertion" ) {
			loggedAssertions[ details.message ] = details;
		}

	} );

	QUnit.test( "passing test to see if steps array is passed by reference to logging function", function( assert ) {
		assert.step( "step one" );
		assert.step( "step two" );

		assert.verifySteps( [ "step one", "step two" ], "verification-assertion" );
	} );

	QUnit.test( "steps array should not be reset in logging function", function( assert ) {
		const result = loggedAssertions[ "verification-assertion" ].actual;
		assert.deepEqual( result, [ "step one", "step two" ] );
	} );

} );
