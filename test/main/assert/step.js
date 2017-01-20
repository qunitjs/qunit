QUnit.module( "assert.step" );

QUnit.test( "pushes a failing assertion if no message is given", function( assert ) {
	assert.expect( 2 );

	var originalPushResult = assert.pushResult;
	assert.pushResult = function pushResultStub( resultInfo ) {
		assert.pushResult = originalPushResult;

		assert.notOk( resultInfo.result );
		assert.equal( resultInfo.message, "You must provide a message to assert.step" );
	};

	assert.step();
} );

QUnit.test( "pushes a failing assertion if empty message is given", function( assert ) {
	assert.expect( 2 );

	var originalPushResult = assert.pushResult;
	assert.pushResult = function pushResultStub( resultInfo ) {
		assert.pushResult = originalPushResult;

		assert.notOk( resultInfo.result );
		assert.equal( resultInfo.message, "You must provide a message to assert.step" );
	};

	assert.step( "" );
} );

QUnit.test( "pushes a passing assertion if a message is given", function( assert ) {
	assert.expect( 2 );

	assert.step( "One step" );
	assert.step( "Two step" );
} );

QUnit.module( "assert.verifySteps" );

QUnit.test( "verifies the order and value of steps", function( assert ) {
	assert.expect( 6 );

	assert.step( "One step" );
	assert.step( "Two step" );
	assert.step( "Red step" );
	assert.step( "Blue step" );

	assert.verifySteps( [ "One step", "Two step", "Red step", "Blue step" ] );

	var originalPushResult = assert.pushResult;
	assert.pushResult = function pushResultStub( resultInfo ) {
		assert.pushResult = originalPushResult;

		assert.notOk( resultInfo.result );
	};

	assert.verifySteps( [ "One step", "Red step", "Two step", "Blue step" ] );
} );
