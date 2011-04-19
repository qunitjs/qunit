/* 
 * QUnit Qt+WebKit powered headless test runner using Phantomjs
 * 
 * Phantomjs installation: http://code.google.com/p/phantomjs/wiki/BuildInstructions
 * 
 * Run with:
 *  phantomjs test.js [url-of-your-qunit-testsuite]
 *  
 * E.g.
 * 	phantomjs test.js http://localhost/qunit/test
 */

function addLogging(done) {
	var module;
	QUnit.moduleStart = function(context) {
		module = context.name;
	}
	var current_test_assertions = [];
	QUnit.testDone = function(result) {
		var name = module + ": " + result.name;
		if (result.failed) {
			console.log("\u001B[31m✖ " + name);
			for (var i = 0; i < current_test_assertions.length; i++) {
				console.log("    " + current_test_assertions[i]);
			}
			console.log("\u001B[39m");
		}
		current_test_assertions = [];
	};
  
	QUnit.log = function(details) {
		if (details.result) {
			return;
		}
		var response = details.message || "";
		if (details.expected) {
			if (response) {
				response += ", ";
			}
			response = "expected: " + details.expected + ", but was: " + details.actual;
		}
		current_test_assertions.push("Failed assertion: " + response);
	};
  
	QUnit.done = function(result) {
		console.log("Took " + result.runtime + "ms to run " + result.total + " tests. \u001B[32m✔ " + result.passed + "\u001B[39m \u001B[31m✖ " + result.failed + "\u001B[39m ");
		done(result.failed > 0 ? 1 : 0);
	};
}

if (phantom.state.length === 0) {
	phantom.state = Date.now().toString();
	phantom.open(phantom.args[0]);
} else {
	if (phantom.loadStatus === 'success') {
		addLogging(function(returnCode) {
			phantom.exit(returnCode);
		});
	} else {
		console.log(phantom.loadStatus + ' to load the address: ' + phantom.args[0]);
		phantom.exit(1);
	}
}
