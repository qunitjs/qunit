// run with
// node test/node-test.js
var QUnit = require("../qunit/qunit");
QUnit.log(function(details) {
	if (!details.result) {
		console.log("FAILED: " + details.message + ", expected: " + details.expected + ", actual: " + details.actual);
	}
});
QUnit.test("yo", function() {
	QUnit.equal(true, false, "gotta fail");
});