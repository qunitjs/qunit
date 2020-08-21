"use strict";

const fs = require( "fs" );
const path = require( "path" );
const picomatch = require( "picomatch" );

function existsStat() {
	try {
		return fs.statSync.apply( fs, arguments );
	} catch ( e ) {
		return null;
	}
}


function getIgnoreList( baseDir ) {
	const gitFilePath = path.join( baseDir, ".gitignore" );
	if ( fs.existsSync( gitFilePath ) ) {
		const gitIgnore = fs.readFileSync( gitFilePath, "utf-8" );
		return gitIgnore.trim().split( "\n" );
	}
	return [];
}

function findFilesInternal( dir, options, result = [], prefix = "" ) {
	fs.readdirSync( dir ).forEach( ( name ) => {
		const fullName = path.join( dir, name );
		const stat = existsStat( fullName );
		if ( !stat ) {
			return;
		}
		const prefixedName = prefix + name;
		const isIgnore = options.ignores( prefixedName );

		if ( isIgnore ) {
			return;
		}
		if ( stat.isDirectory() ) {
			findFilesInternal( fullName, options, result, prefixedName + "/" );
		} else {
			const isMatch = options.matchers( prefixedName );
			if ( isMatch ) {
				result.push( prefixedName );
			}
		}
	} );
	return result;
}

function findFiles( baseDir, options ) {
	return findFilesInternal( baseDir, {
		matchers: picomatch( options.match || [] ),
		ignores: picomatch( options.ignore || [] )
	} );
}

function getFilesFromArgs( args ) {
	const globs = args.slice();

	// Default to files in the test directory
	if ( !globs.length ) {
		globs.push( "test/**/*.js" );
	}

	const files = [];
	const filteredGlobs = [];

	// For each of the potential globs, we check if it is a directory path and
	// update it so that it matches the JS files in that directory.
	globs.forEach( glob => {
		const stat = existsStat( glob );

		if ( stat && stat.isFile() ) {

			// Remember known files to avoid (slow) directory-wide glob scanning.
			// https://github.com/qunitjs/qunit/pull/1385
			files.push( glob );
		} else if ( stat && stat.isDirectory() ) {
			filteredGlobs.push( `${glob}/**/*.js` );
		} else {
			filteredGlobs.push( glob );
		}
	} );

	if ( filteredGlobs.length ) {
		files.push.apply( files, findFiles( process.cwd(), { match: filteredGlobs } ) );
	}

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
	findFiles,
	capitalize,
	error,
	getFilesFromArgs,
	getIgnoreList
};
