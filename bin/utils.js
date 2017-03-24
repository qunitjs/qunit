"use strict";

const walkSync = require( "walk-sync" );
const existsStat = require( "exists-stat" );

function getFilesFromArgs( args ) {
	let globs = args.slice();

	// Default to files in the test directory
	if ( !globs.length ) {
		globs.push( "test/**/*.js" );
	}

	// For each of the potential globs, we check if it is a directory path and
	// update it so that it matches the JS files in that directory.
	globs = globs.map( glob => {
		const stat = existsStat( glob );

		if ( stat && stat.isDirectory() ) {
			return `${glob}/**/*.js`;
		} else {
			return glob;
		}
	} );

	const files = walkSync( process.cwd(), { globs } );

	if ( !files.length ) {
		error( "No files were found matching: " + args.join( ", " ) );
	}

	return files;
}

function error( message ) {
	console.error( message );
	process.exit( 1 );
}

function capitalize( string ) {
	return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
}

module.exports = {
	capitalize,
	error,
	getFilesFromArgs
};
