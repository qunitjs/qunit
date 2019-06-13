"use strict";

const fs = require( "fs" );
const path = require( "path" );
const { Minimatch } = require( "minimatch" );

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
		const isIgnore = options.ignores.some( ( mm ) => mm.match( prefixedName ) );
		if ( isIgnore ) {
			return;
		}
		if ( stat.isDirectory() ) {
			findFilesInternal( fullName, options, result, prefixedName + "/" );
		} else {
			const isMatch = options.matchers.some( ( mm ) => mm.match( prefixedName ) );
			if ( isMatch ) {
				result.push( prefixedName );
			}
		}
	} );
	return result;
}

function findFiles( baseDir, options ) {
	return findFilesInternal( baseDir, {
		matchers: ( options.match || [] ).map( ( pattern ) => new Minimatch( pattern ) ),
		ignores: ( options.ignore || [] ).map( ( pattern ) => new Minimatch( pattern ) )
	} );
}

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

	const files = findFiles( process.cwd(), { match: globs } );

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
