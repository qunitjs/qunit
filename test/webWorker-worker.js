/* global importScripts */
/* eslint-env es6 */
importScripts(
	"../qunit/qunit.js",

	"main/test.js",
	"main/each.js",
	"main/assert.js",
	"main/assert-step.js",
	"main/assert-timeout.js",
	"main/async.js",
	"main/promise.js",
	"main/dump.js",
	"main/modules.js",
	"main/deepEqual.js",
	"main/stack.js",
	"main/utilities.js",
	"main/onError.js",
	"main/onUncaughtException.js"
);

QUnit.on( "runEnd", ( data ) => {
	postMessage( data );
} );

QUnit.start();
