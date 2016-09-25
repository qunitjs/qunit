( function() {

QUnit.module( "Error recovery" );

QUnit.test( "QUnit.failTest() pushes failure and resumes tests", function( assert ) {
	assert.expect( 1 );

	// Intentionally NOT using the callback-- failTest should
	// restart the test runner.
	assert.async();

	var expectedMessage = "This is a failure message";

	// Duck-punch test's pushFailure method to avoid real test failure report
	assert.test.pushFailure = function( message ) {
		assert.strictEqual( message, expectedMessage );
	};

	setTimeout( function() {
		QUnit.failTest( expectedMessage );
	}, 13 );
} );

}() );
