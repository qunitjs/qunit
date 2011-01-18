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
		    print("\u001B[31m✖ " + result.name);
		    for (var i = 0; i < current_test_assertions.length; i++) {
				print("    " + current_test_assertions[i]);
			}
			print("\u001B[39m");
		} else {
		    print("✔ " + result.name);
		}
		current_test_assertions = [];
    };

	QUnit.log = function(details) {
		if (details.result)
			return;
		var response = details.message || "";
		if (typeof details.expected !== "undefined") {
			if (response) {
				response += ", ";
			}
			response = "expected: " + details.expected + ", but was: " + details.actual;
		}
		current_test_assertions.push("Failed assertion: " + response);
    };

    QUnit.done = function(result) {
		print("------------------------------------");
		print(" PASS: " + result.passed + "  FAIL: " + result.failed + "  TOTAL: " + result.total);
		print(" Finished in " + result.runtime + " milliseconds.");
		print("------------------------------------");
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
