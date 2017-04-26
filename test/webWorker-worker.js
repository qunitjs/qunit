/* global importScripts */
importScripts(
	"../dist/qunit.js",
	"main/test.js",
	"main/assert.js",
	"main/assert/step.js",
	"main/async.js",
	"main/promise.js",
	"main/dump.js",
	"main/modules.js",
	"main/deepEqual.js",
	"main/stack.js"
);

QUnit.on( "runEnd", ( data ) => {
	postMessage( data );
} );

QUnit.start();
