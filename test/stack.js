/* globals polluteGlobal: true */

// No pollution
QUnit.test( "globals", function( assert ) {
	QUnit.config.noglobals = true;
	polluteGlobal = 1;
	assert.expect( 0 );
});

// Failing test
QUnit.test( "failing", function( assert ) {
	assert.equal( "foo", "bar" );
});

// No assertions fail
QUnit.test( "no assertions", function() {
	// nothing
});

// start error inside of a test context
QUnit.test( "QUnit.start()", function() {
	QUnit.start();
});

// Died on test
QUnit.test( "dies on test", function() {
	throw new Error( "foo" );
});

// beforeEach/afterEach fail
QUnit.module( "beforeEach/afterEach fail", {
	beforeEach: function() {
		throw new Error( "foo" );
	},
	afterEach: function() {
		throw new Error( "bar" );
	}
});
QUnit.test( "module fails", function() {
	// ...
});

QUnit.module( "globals" );

// start error outside of a test context
setTimeout(function() {
	QUnit.start();
}, 0 );

// pushFailure outside of a test context
setTimeout(function() {
	QUnit.pushFailure( true );
}, 0 );

// Assertion outside of a test context
setTimeout(function() {
	QUnit.ok( true );
}, 0 );

// Trigger window.onerror
setTimeout(function() {
	throw new Error( "foo" );
}, 0 );
