// This worker script gets run via test/webWorker.html

/* global importScripts */
/* eslint-env es6 */
importScripts(
	"../qunit/qunit.js",

	// Sync with test/index.html
	"main/assert.js",
	"main/assert-step.js",
	"main/assert-timeout.js",
	"main/async.js",
	"main/deepEqual.js",
	"main/dump.js",
	"main/each.js",
	"main/modules.js",
	"main/onError.js",
	"main/onUncaughtException.js",
	"main/promise.js",
	"main/setTimeout.js",
	"main/stack.js",
	"main/test.js",
	"main/utilities.js"
);

QUnit.on( "runEnd", ( data ) => {
	postMessage( data );
} );

QUnit.start();
