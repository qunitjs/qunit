"use strict";

const path = require( "path" );
const cp = require( "child_process" );
const reEscape = /([\\{}()|.?*+\-^$[\]])/g;

// Apply light normalization to CLI output to allow strict string
// comparison across Node versions and OS platforms against the
// expected output in fixtures/.
function normalize( actual ) {
	const dir = path.join( __dirname, "..", "..", ".." );
	const reDir = new RegExp( dir.replace( reEscape, "\\$1" ), "g" );
	const reSep = new RegExp( path.sep.replace( reEscape, "\\$1" ), "g" );

	return actual
		.replace( reDir, "/qunit" )

		// Replace backslashes (\) in stack traces on Windows to POSIX
		.replace( reSep, "/" )

		// Convert "at processModule (/qunit/qunit/qunit.js:1:2)" to "at processModule (/qunit/qunit/qunit.js)"
		.replace( /(\/qunit\/qunit\/qunit\.js):\d+:\d+\)/g, "$1)" )

		// Convert "at /qunit/qunit/qunit.js:1:2" to "at /qunit/qunit/qunit.js"
		.replace( /( {2}at \/qunit\/qunit\/qunit\.js):\d+:\d+/g, "$1" )

		// Strip inferred names for anonymous test closures (as Node 10 did),
		// to match the output of Node 12+.
		// Convert "at QUnit.done (/qunit/test/foo.js:1:2)" to "at /qunit/test/foo.js:1:2"
		.replace( /\b(at )\S+ \((\/qunit\/test\/[^:]+:\d+:\d+)\)/g, "$1$2" )

		// convert sourcemap'ed traces from Node 14 and earlier to the
		// standard format used by Node 15+.
		// https://github.com/nodejs/node/commit/15804e0b3f
		// https://github.com/nodejs/node/pull/37252
		// Convert "at foo (/min.js:1)\n -> /src.js:2" to "at foo (/src.js:2)"
		.replace( /\b(at [^(]+\s\()[^)]+(\))\n\s+-> ([^\n]+)/g, "$1$3$2" )

		// CJS-style internal traces:
		// Convert "at load (internal/modules/cjs/loader.js:7)" to "at internal"
		//
		// ESM-style internal traces from Node 14+:
		// Convert "at wrap (node:internal/modules/cjs/loader:1)" to "at internal"
		.replace( / {2}at .+\([^/)][^)]*\)/g, "  at internal" )

		// Strip frames from indirect nyc dependencies that are specific
		// to code coverage jobs:
		// Convert "at load (/qunit/node_modules/append-transform/index.js:6" to "at internal"
		.replace( / {2}at .+\/.*node_modules\/append-transform\/.*\)/g, "  at internal" )

		// merge successive lines after initial frame
		.replace( /(\n\s+at internal)+/g, "$1" )

		// merge successive line with initial frame
		.replace( /(at internal)\n\s+at internal/g, "$1" );
}

/**
 * Executes the provided command from within the fixtures directory.
 *
 * The `options` and `hook` parameters are used by test/cli/watch.js to
 * control the stdio stream.
 *
 * @param {Array} command
 * @param {Object} [options]
 * @param {Array} [options.stdio]
 * @param {Object} [options.env]
 * @param {Function} [hook]
 */
module.exports.execute = async function execute( command, options = {}, hook ) {
	options.cwd = path.join( __dirname, "..", "fixtures" );

	// Inherit no environment by default
	// Without this, tests may fail from inheriting FORCE_COLOR=1
	options.env = options.env || {};

	// Avoid Windows-specific issue where otherwise 'foo/bar' is seen as a directory
	// named "'foo/" (including the single quote).
	options.windowsVerbatimArguments = true;

	let cmd = command[ 0 ];
	const args = command.slice( 1 );
	if ( cmd === "qunit" ) {
		cmd = "../../../bin/qunit.js";
		args.unshift( cmd );
		cmd = process.execPath;
	}
	if ( cmd === "node" ) {
		cmd = process.execPath;
	}

	const spawned = cp.spawn( cmd, args, options );

	if ( hook ) {
		hook( spawned );
	}

	const result = {
		code: null,
		stdout: "",
		stderr: ""
	};
	spawned.stdout.on( "data", data => {
		result.stdout += data;
	} );
	spawned.stderr.on( "data", data => {
		result.stderr += data;
	} );
	const execPromise = new Promise( ( resolve, reject ) => {
		spawned.on( "error", error => {
			reject( error );
		} );
		spawned.on( "exit", ( exitCode, _signal ) => {
			result.code = exitCode;
			const stderr = normalize( String( result.stderr ).trimEnd() );
			if ( exitCode !== 0 ) {
				reject( new Error( "Error code " + exitCode + "\n" + ( stderr || result.stdout ) ) );
			} else {
				resolve();
			}
		} );
	} );

	try {
		await execPromise;
		result.stdout = normalize( String( result.stdout ).trimEnd() );
		result.stderr = String( result.stderr ).trimEnd();
		return result;
	} catch ( e ) {
		e.pid = result.pid;
		e.code = result.code;
		e.stdout = normalize( String( result.stdout ).trimEnd() );
		e.stderr = normalize( String( result.stderr ).trimEnd() );
		throw e;
	}
};

module.exports.normalize = normalize;

// Very loose command formatter.
// Not for the purpose of execution, but for the purpose
// of formatting the string key in fixtures/ files.
module.exports.prettyPrintCommand = function prettyPrintCommand( command ) {
	return command.map( arg => {

		// Quote spaces and stars
		return /[ *]/.test( arg ) ? `'${ arg }'` : arg;
	} ).join( " " );
};
