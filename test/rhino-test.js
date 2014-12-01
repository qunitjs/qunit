/*jshint node:true, undef:false */
/*globals QUnit:true */
// Run with: $ rhino -require test/rhino-test.js
var QUnit = require( "../dist/qunit" ).QUnit;

QUnit.testStart(function( details ) {
	var output = "- ";
	if ( details.module ) {
		output += details.module + ": ";
	}
	print( output + details.name );
});

QUnit.module( "Rhino" );

QUnit.log(function( details ) {
	if ( !details.result ) {
		var output = "FAILED: " + ( details.message ? details.message + ", " : "" );
		if ( details.actual ) {
			output += "expected: " + details.expected + ", actual: " + details.actual;
		}
		if ( details.source ) {
			output += ", " + details.source;
		}
		print( output );
	}
});

QUnit.test( "fail twice with stacktrace", function( assert ) {
	/*jshint expr:true */
	assert.equal( true, false );
	assert.equal( true, false, "gotta fail" );
	// Throws ReferenceError
	x.y.z;
});

QUnit.load();
