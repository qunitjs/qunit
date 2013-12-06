/*jshint node:true, undef:false */
/*globals QUnit:true */
// Run with: $ node test/node-test.js
var QUnit = require("../dist/qunit");

QUnit.log(function(details) {
	if (!details.result) {
		var output = "FAILED: " + (details.message ? details.message + ", " : "");
		if (details.actual) {
			output += "expected: " + details.expected + ", actual: " + details.actual;
		}
		if (details.source) {
			output += ", " + details.source;
		}
		console.log(output);
	}
});

QUnit.test("fail twice with stacktrace", function(assert) {
	/*jshint expr:true */
	assert.equal(true, false);
	assert.equal(true, false, "gotta fail");
	// Throws ReferenceError
	x.y.z;
});

QUnit.load();
