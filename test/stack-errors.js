/* globals polluteGlobal: true */

// No pollution
QUnit.test( "globals", function( assert ) {
	QUnit.config.noglobals = true;
	polluteGlobal = 1;
	assert.expect( 0 );
} );

// Failing test
QUnit.test( "failing", function( assert ) {
	assert.equal( "foo", "bar" );
} );

// No assertions fail
QUnit.test( "no assertions", function() { } );

// Start error inside of a test context
QUnit.test( "QUnit.start()", function() {
	QUnit.start();
} );

// Died on test
QUnit.test( "dies on test", function() {
	throw new Error( "foo" );
} );

// Test beforeEach die
QUnit.module( "beforeEach fail", {
	beforeEach: function() {
		throw new Error( "foo" );
	}
} );
QUnit.test( "module fails", function() { } );

// Test afterEach die
QUnit.module( "afterEach fail", {
	afterEach: function() {
		throw new Error( "bar" );
	}
} );
QUnit.test( "module fails", function() { } );

// Test assert.async post-resolution assertions fail
QUnit.module( "assertions fail after assert.async flows are resolved" );

QUnit.test( "assert.ok", function( assert ) {
	assert.async()();
	assert.ok( true, "This assertion should pass but have a failure logged before it" );
} );

QUnit.test( "assert.equal", function( assert ) {
	assert.async()();
	assert.equal( 1, 1, "This assertion should pass but have a failure logged before it" );
} );

QUnit.test( "assert.throws", function( assert ) {
	assert.async()();
	assert.throws( function() {
		throw new Error( "foo" );
	}, "This assertion should pass but have a failure logged before it" );
} );

QUnit.module( "globals" );

// Start error outside of a test context
setTimeout( function() {
	QUnit.start();
}, 0 );

// Test pushFailure outside of a test context
setTimeout( function() {
	QUnit.pushFailure( true );
}, 0 );

// Assertion outside of a test context
setTimeout( function() {
	QUnit.ok( true );
}, 0 );

// Trigger window.onerror
setTimeout( function() {
	throw new Error( "foo" );
}, 0 );

// DEPRECATED: To be removed in QUnit 2.0.0
// Trigger warnings by replacing the logging callbacks
QUnit.begin = function() {};
QUnit.done = function() {};
QUnit.log = function() {};
QUnit.testStart = function() {};
QUnit.testDone = function() {};
QUnit.moduleStart = function() {};
QUnit.moduleDone = function() {};
