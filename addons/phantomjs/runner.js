/*
 * QtWebKit-powered headless test runner using PhantomJS
 *
 * PhantomJS binaries: http://phantomjs.org/download.html
 * Requires PhantomJS 1.6+ (1.7+ recommended)
 *
 * Run with:
 *   phantomjs runner.js [url-of-your-qunit-testsuite]
 *
 * e.g.
 *   phantomjs runner.js http://localhost/qunit/test/index.html
 */

/*global phantom:false, require:false, console:false, window:false, QUnit:false */

(function() {
	"use strict";

	var url, page, timeout,
		args = require( "system" ).args;

	// arg[0]: scriptName, args[1...]: arguments
	if (args.length < 2 || args.length > 3) {
		console.error( "Usage:\n  phantomjs runner.js [url-of-your-qunit-testsuite] [timeout-in-seconds]" );
		phantom.exit(1);
	}

	url = args[1];
	page = require( "webpage" ).create();
	if (args[2] !== undefined) {
		timeout = parseInt(args[2], 10);
	}

	// Route `console.log()` calls from within the Page context to the main Phantom context (i.e. current `this`)
	page.onConsoleMessage = function(msg) {
		// Test for jQuery.mockjax logging values to exclude
		// https://github.com/appendto/jquery-mockjax
		if ( /MOCK\ GET/.test( msg ) ) {
			return;
		}

		console.log(msg);
	};

	page.onInitialized = function() {
		page.evaluate(addLogging);
		page.evaluate( colorizer );
	};

	page.onCallback = function(message) {
		var result,
			failed;

		if (message) {
			if (message.name === "QUnit.done" ) {
				result = message.data;
				failed = !result || result.failed;

				phantom.exit(failed ? 1 : 0);
			}
		}
	};

	page.open(url, function(status) {
		if (status !== "success" ) {
			console.error( "Unable to access network: " + status );
			phantom.exit(1);
		} else {
			// Cannot do this verification with the "DOMContentLoaded" handler because it
			// will be too late to attach it if a page does not have any script tags.
			var qunitMissing = page.evaluate(function() { return (typeof QUnit === "undefined" || !QUnit); });
			if (qunitMissing) {
				console.error( "The `QUnit` object is not present on this page." );
				phantom.exit(1);
			}

			// Set a timeout on the test running, otherwise tests with async problems will hang forever
			if (typeof timeout === "number" ) {
				setTimeout(function() {
					console.error( "The specified timeout of " + timeout + " seconds has expired. Aborting..." );
					phantom.exit(1);
				}, timeout * 1000);
			}

			// Do nothing... the callback mechanism will handle everything!
		}
	});

	function colorizer() {
		window.ANSI = {
			colorMap: {
				"red": "\u001b[31m",
				"redBold": "\u001b[1m\u001b[31m",
				"green": "\u001b[32m",
				"greenBold": "\u001b[1m\u001b[32m",
				"blue": "\u001b[34m",
				"blueBold": "\u001b[1m\u001b[34m",
				"end": "\u001b[0m"
			},
			highlightMap: {
				"red": "\u001b[41m \u001b[37m", // change 37 to 30 for black text
				"green": "\u001b[42m \u001b[30m",
				"blue": "\u001b[44m \u001b[37m",
				"end": "\u001b[0m"
			},
			highlightText: function ( text, color ) {
				var colorCode = this.highlightMap[ color ],
						colorEnd = this.highlightMap.end;

				return colorCode + text + colorEnd;
			},
			colorizeText: function ( text, color ) {
				var colorCode = this.colorMap[ color ],
						colorEnd = this.colorMap.end;

				return colorCode + text + colorEnd;
			}
		};

	}

	function addLogging() {
		window.document.addEventListener( "DOMContentLoaded", function() {
			var currentTestAssertions = [];

			QUnit.log(function(details) {
				var response;

				// Ignore passing assertions
				if (details.result) {
					return;
				}

				response = details.message || "";

				if (typeof details.expected !== "undefined" ) {
					if (response) {
						response += ", ";
					}

					response += "expected: " + details.expected + ", but was: " + details.actual;
				}

				if (details.source) {
					response += "\n" + details.source;
				}

				currentTestAssertions.push( ANSI.colorizeText( "Failed assertion: ", "red" ) + details.message );
			});

			QUnit.moduleStart( function ( details ) {
				console.log( "---------------" );
				console.log( "Running QUnit Tests for: " + ANSI.colorizeText( details.name, "blueBold") );
				console.log( "---------------" );
			});

			QUnit.testDone(function(result) {
				var i,
					len,
					name = result.module + ": " + result.name;

				if (result.failed) {
					console.log( ANSI.highlightText( String.fromCharCode( "0x2717" ) + " Test failed: ", "red" ) + " " + name );

					for (i = 0, len = currentTestAssertions.length; i < len; i++) {
						console.log("    " + String.fromCharCode( "0x21B3" ) + "  " + currentTestAssertions[i]);
					}
				} else {
					console.log( ANSI.highlightText( String.fromCharCode( "0x2713" ) + " Test passed: ", "green" ) + " " + name );
				}

				currentTestAssertions.length = 0;
			});

			QUnit.done(function(result) {
				console.log( "---------------" );
				console.log("Took " + result.runtime +  "ms to run " + result.total + " tests. " + ANSI.colorizeText( result.passed + " passed", "green" ) + ", " + ANSI.colorizeText( result.failed + " failed", "red" ) + "." );
				console.log( "---------------" );

				if (typeof window.callPhantom === "function" ) {
					window.callPhantom({
						"name": "QUnit.done",
						"data": result
					});
				}
			});
		}, false);
	}
})();
