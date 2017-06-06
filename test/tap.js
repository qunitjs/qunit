/* globals console:true */

var storedResults = [];
var originalPrint = QUnit.reporter.print;
QUnit.reporter.print = function( output ) {
	storedResults.push( output );
};

QUnit.config.reorder = false;

QUnit.reporter( "tap" );

QUnit.module( "print function" );

QUnit[ console && console.log ? "test" : "skip" ]( "prints to console.log", function( assert ) {
	var results = [];

	// Duck punch console.log
	this.originalLog = console.log;
	console.log = function( arg ) {
		results.push( arg );
	};

	originalPrint( "foo", "bar" );
	originalPrint( "baz" );

	assert.strictEqual( results.length, 2 );

	assert.strictEqual( results[ 0 ], "foo", "calls console.log fn" );
	assert.strictEqual( results[ 1 ], "baz" );

	console.log = this.originalLog;
} );

QUnit.module( "tap reporter - samples" );

QUnit.test( "this test will pass", function( assert ) {
	assert.ok( true );
	assert.equal( 1, 1 );
} );

QUnit.test( "async tests that pass", function( assert ) {
	assert.ok( true );
	var done = assert.async();

	setTimeout( function() {
		assert.ok( true );
		done();
	}, 13 );
} );

QUnit.module( "tap reporter - samples #2" );

QUnit.test( "this test will pass", function( assert ) {
	assert.ok( true );
	assert.equal( 1, 1 );
} );

QUnit.test( "async tests that pass", function( assert ) {
	assert.ok( true );
	var done = assert.async();

	setTimeout( function() {
		assert.ok( true );
		done();
	}, 13 );
} );

var once = true;
var expected = [
	"TAP version 13",
	"# module: print function",
	"ok 1 - prints to console.log",
	"# module: tap reporter - samples",
	"ok 2 - this test will pass",
	"ok 3 - async tests that pass",
	"# module: tap reporter - samples #2",
	"ok 4 - this test will pass",
	"ok 5 - async tests that pass",
	"",
	"1..5",
	"# tests 5",
	"# pass 5"
].join( "\n" );

QUnit.done( function() {
	if ( once ) {
		once = false;
		QUnit.module( "tap reporter" );
		QUnit.test( "final tests", function( assert ) {

			// Remove the current module
			storedResults.pop();
			assert.equal( storedResults.join( "\n" ), expected );
		} );
	}
} );
