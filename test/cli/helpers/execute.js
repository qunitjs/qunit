"use strict";

const path = require( "path" );
const exec = require( "execa" ).shell;
const reEscape = /([\\{}()|.?*+\-^$[\]])/g;

// Apply light normalization to CLI output to allow strict string
// comparison across Node versions and OS platforms against the
// expected output in fixtures/.
function normalize( actual ) {
	const dir = path.join( __dirname, "..", "..", ".." );
	const reDir = new RegExp( dir.replace( reEscape, "\\$1" ), "g" );

	return actual
		.replace( reDir, "/qunit" )
		.replace( /(\/qunit\/qunit\/qunit\.js):\d+:\d+\)/g, "$1)" )

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

// Executes the provided command from within the fixtures directory
// The execaOptions parameter is used by test/cli/watch.js to
// control the stdio stream.
module.exports = async function execute( command, execaOptions, hook ) {
	const cwd = process.cwd();
	process.chdir( path.join( __dirname, "..", "fixtures" ) );

	command = command.replace( /(^| )qunit\b/, "$1../../../bin/qunit.js" );
	const execution = exec( command, execaOptions );
	if ( hook ) {
		hook( execution );
	}

	process.chdir( cwd );

	try {
		const result = await execution;
		result.stdout = normalize( String( result.stdout ).trimEnd() );
		return result;
	} catch ( e ) {
		e.stdout = normalize( String( e.stdout ).trimEnd() );
		throw e;
	}
};

module.exports.normalize = normalize;
