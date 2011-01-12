if (typeof require != "undefined") {
	// should change export to module.exports = QUnit
	QUnit = require("../qunit/qunit.js").QUnit;
	print = console.log;
} else {
	load("../qunit/qunit.js");
}

(function() {

    QUnit.init();
    QUnit.config.blocking = true;
    QUnit.config.updateRate = 0;

    var current_test_assertions = [];
    QUnit.testDone = function(result) {
		if (result.failed) {
		    print("FAIL - " + result.name);
		    for (var i = 0; i < current_test_assertions.length; i++) {
				print("    " + current_test_assertions[i]);
			}
		} else {
		    print("PASS - " + result.name);
		}
		current_test_assertions = [];
    };

	QUnit.log = function(details) {
		var type = (typeof details.expected !== "undefined") ? "EQ" : "OK";
		var outcome = details.result ? "PASS" : "FAIL";
		var response = "";
		if (!details.result && typeof details.expected !== "undefined") {
			response = "Expected: " + details.expected + ", Actual: " + details.actual;
		}
		current_test_assertions.push([outcome, type, details.message || "", response].join("|"));
    };

    QUnit.done = function(result) {
		print("----------------------------------------");
		print(" PASS: " + result.passed + "  FAIL: " + result.failed + "  TOTAL: " + result.total);
		print(" Finished in " + result.runtime + " milliseconds.");
		print("----------------------------------------");
    };

})();

// run the tests
if (typeof require != "undefined") {
	fs = require("fs");
	eval("with (QUnit) {" + fs.readFileSync("test.js", "utf-8") + "}");
	eval("with (QUnit) {" + fs.readFileSync("same.js", "utf-8") + "}");
} else {
	load("test.js");
	load("same.js");
}

QUnit.start();
