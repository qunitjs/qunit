// NOTE: Adds 1 assertion
function createMockPromise( assert ) {

	// Return a mock self-fulfilling Promise ("thenable")
	var thenable = {
		then: function( fulfilledCallback /*, rejectedCallback */ ) {
			assert.strictEqual( this, thenable, "`then` was invoked with the Promise as the " +
				"context" );
			setTimeout( function() {
				return fulfilledCallback.call( thenable, {} );
			}, 13 );
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
