
QUnit.module( "assert" );

function CustomError( message ) {
	this.message = message;
}

CustomError.prototype.toString = function() {
	return this.message;
};

QUnit.test( "throws", function( assert ) {
	assert.expect( 1 );

	assert.throws(
		function() {
			throw new CustomError( "some error description" );
		},
		err => {
			return err instanceof CustomError && /description/.test( err );
		},
		"custom validation function"
	);
} );

QUnit.module( "failing assertions", {
	beforeEach: function( assert ) {
		var originalPushResult = assert.pushResult;
		assert.pushResult = function( resultInfo ) {

			// Inverts the result so we can test failing assertions
			resultInfo.result = !resultInfo.result;
			originalPushResult( resultInfo );
		};
	}
} );

QUnit.test( "throws", function( assert ) {
	assert.throws(
		function() {
			throw "foo";
		},
		() => false,
		"throws fail when expected function returns false"
	);
} );
