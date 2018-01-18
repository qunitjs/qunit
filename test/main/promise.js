// NOTE: Adds 1 assertion
function createMockPromise( assert, reject, value ) {
	if ( arguments.length < 3 ) {
		value = {};
	}

	// Return a mock self-fulfilling Promise ("thenable")
	var thenable = {
		then: function( fulfilledCallback, rejectedCallback ) {
			assert.strictEqual( this, thenable, "`then` was invoked with the Promise as the " +
				"context" );
			setTimeout( function() {
				return reject ?
					rejectedCallback.call( thenable, value ) :
					fulfilledCallback.call( thenable, value );
			} );
		}
	};
	return thenable;
}

QUnit.module( "Module with Promise-aware before", {
	before: function( assert ) {
		assert.ok( true );
		return {};
	}
} );

QUnit.test( "non-Promise", function( assert ) {
	assert.expect( 1 );
} );

QUnit.module( "Module with Promise-aware before", {
	before: function( assert ) {

		// Adds 1 assertion
		return createMockPromise( assert );
	}
} );

QUnit.test( "fulfilled Promise", function( assert ) {
	assert.expect( 1 );
} );

QUnit.module( "Module with Promise-aware beforeEach", {
	beforeEach: function( assert ) {
		assert.ok( true );
		return {};
	}
} );

QUnit.test( "non-Promise", function( assert ) {
	assert.expect( 1 );
} );

QUnit.module( "Module with Promise-aware beforeEach", {
	beforeEach: function( assert ) {

		// Adds 1 assertion
		return createMockPromise( assert );
	}
} );

QUnit.test( "fulfilled Promise", function( assert ) {
	assert.expect( 1 );
} );

QUnit.module( "Module with Promise-aware afterEach", {
	afterEach: function( assert ) {
		assert.ok( true );
		return {};
	}
} );

QUnit.test( "non-Promise", function( assert ) {
	assert.expect( 1 );
} );

QUnit.module( "Module with Promise-aware afterEach", {
	afterEach: function( assert ) {

		// Adds 1 assertion
		return createMockPromise( assert );
	}
} );

QUnit.test( "fulfilled Promise", function( assert ) {
	assert.expect( 1 );
} );

QUnit.module( "Module with Promise-aware after", {
	after: function( assert ) {
		assert.ok( true );
		return {};
	}
} );

QUnit.test( "non-Promise", function( assert ) {
	assert.expect( 1 );
} );

QUnit.module( "Module with Promise-aware after", {
	after: function( assert ) {

		// Adds 1 assertion
		return createMockPromise( assert );
	}
} );

QUnit.test( "fulfilled Promise", function( assert ) {
	assert.expect( 1 );
} );

QUnit.module( "Module with Promise-aware everything", {
	before: function( assert ) {
		return createMockPromise( assert );
	},
	beforeEach: function( assert ) {
		return createMockPromise( assert );
	},
	afterEach: function( assert ) {
		return createMockPromise( assert );
	},
	after: function( assert ) {
		return createMockPromise( assert );
	}
} );

QUnit.test( "fullfilled Promise", function( assert ) {
	assert.expect( 5 );
	return createMockPromise( assert );
} );

QUnit.module( "Promise-aware return values without beforeEach/afterEach" );

QUnit.test( "non-Promise", function( assert ) {
	assert.expect( 0 );
	return {};
} );

QUnit.test( "fulfilled Promise", function( assert ) {
	assert.expect( 1 );

	// Adds 1 assertion
	return createMockPromise( assert );
} );

QUnit.test( "fulfilled Promise with non-Promise async assertion", function( assert ) {
	assert.expect( 2 );

	var done = assert.async();
	setTimeout( function() {
		assert.ok( true );
		done();
	}, 100 );

	// Adds 1 assertion
	return createMockPromise( assert );
} );

QUnit.module( "Promise-aware return values with rejections", {
	afterEach: function( assert ) {
		assert.test.pushFailure = this.pushFailure;
	}
} );

QUnit.test( "rejected Promise with undefined value", function( assert ) {
	assert.expect( 2 );

	this.pushFailure = assert.test.pushFailure;
	assert.test.pushFailure = function( message ) {
		assert.strictEqual(
			message,
			"Promise rejected during \"rejected Promise with undefined value\": undefined"
		);
	};

	return createMockPromise( assert, true, undefined );
} );

QUnit.test( "rejected Promise with error value", function( assert ) {
	assert.expect( 2 );

	this.pushFailure = assert.test.pushFailure;
	assert.test.pushFailure = function( message ) {
		assert.strictEqual(
			message,
			"Promise rejected during \"rejected Promise with error value\": this is an error"
		);
	};

	return createMockPromise( assert, true, new Error( "this is an error" ) );
} );

QUnit.test( "rejected Promise with string value", function( assert ) {
	assert.expect( 2 );

	this.pushFailure = assert.test.pushFailure;
	assert.test.pushFailure = function( message ) {
		assert.strictEqual(
			message,
			"Promise rejected during \"rejected Promise with string value\": this is an error"
		);
	};

	return createMockPromise( assert, true, "this is an error" );
} );

QUnit.test( "rejected Promise with async lock", function( assert ) {
	assert.expect( 2 );

	assert.async(); // Important! We don't explicitly release the async lock

	this.pushFailure = assert.test.pushFailure;
	assert.test.pushFailure = function( message ) {
		assert.strictEqual(
			message,
			"Promise rejected during \"rejected Promise with async lock\": this is an error"
		);
	};

	return createMockPromise( assert, true, "this is an error" );
} );
