// Helper for reviewing build artefacts against a past release.
//
// See also RELEASE.md.

/* eslint-env node */

const cp = require( "child_process" );
const fs = require( "fs" );
const https = require( "https" );
const path = require( "path" );
const readline = require( "readline" );

function getDiff( from, to ) {

	// macOS 10.15+ comes with GNU diff (2.8)
	// https://unix.stackexchange.com/a/338960/37512
	// https://stackoverflow.com/a/41770560/319266
	const gnuDiffVersion = cp.execFileSync( "diff", [ "--version" ], { encoding: "utf8" } );
	const versionStr = /diff.* (\d+\.\d+)/.exec( gnuDiffVersion );
	const isOld = ( versionStr && Number( versionStr[ 1 ] ) < 3.4 );

	try {
		cp.execFileSync( "diff", [
			"--text",
			"--unified",
			...( isOld ? [] : [ "--color=always" ] ),
			from,
			to
		], { encoding: "utf8" } );
	} catch ( e ) {

		// Expected, `diff` command yields non-zero exit status if files differ
		return e.stdout;
	}
	throw new Error( `Unable to diff between ${from} and ${to}` );
}

async function confirm( text ) {
	const rl = readline.createInterface( { input: process.stdin, output: process.stdout } );
	await new Promise( ( resolve, reject ) => {
		rl.question( `${text} (y/N)> `, ( answer ) => {
			rl.close();
			if ( String( answer ).toLowerCase() === "y" ) {
				resolve();
			} else {
				reject( new Error( "Audit aborted" ) );
			}
		} );
	} );
}

async function download( url, dest ) {
	const fileStr = fs.createWriteStream( dest );
	await new Promise( ( resolve, reject ) => {
		https.get( url, ( resp ) => {
			resp.pipe( fileStr );
			fileStr.on( "finish", () => fileStr.close( resolve ) );
		} ).on( "error", ( err ) => reject( err ) );
	} );
}

const ReleaseAssets = {
	async audit( prevVersion ) {
		if ( typeof prevVersion !== "string" || !/^\d+\.\d+\.\d+$/.test( prevVersion ) ) {
			throw new Error( "Invalid or missing version argument" );
		}
		{
			const file = "package.json";
			console.log( `Auditing ${file}...` );

			const prevContent = cp.execFileSync( "git", [
				"show",
				`${prevVersion}:package.json`
			], { encoding: "utf8" } );
			const tempPrevPath = path.join( __dirname, "../temp", file );
			fs.writeFileSync( tempPrevPath, prevContent );

			const currentPath = path.join( __dirname, "..", file );
			process.stdout.write( getDiff( tempPrevPath, currentPath ) );
			await confirm( `Accept ${file}?` );
		}
		{
			const file = "qunit.js";
			console.log( `Auditing ${file}...` );

			const prevUrl = `https://code.jquery.com/qunit/qunit-${prevVersion}.js`;
			const tempPrevPath = path.join( __dirname, "../temp", file );
			await download( prevUrl, tempPrevPath );

			const currentPath = path.join( __dirname, "../qunit", file );
			process.stdout.write( getDiff( tempPrevPath, currentPath ) );
			await confirm( `Accept ${file}?` );
		}
		{
			const file = "qunit.css";
			console.log( `Auditing ${file}...` );

			const prevUrl = `https://code.jquery.com/qunit/qunit-${prevVersion}.css`;
			const tempPrevPath = path.join( __dirname, "../temp", file );
			await download( prevUrl, tempPrevPath );

			const currentPath = path.join( __dirname, "../qunit", file );
			process.stdout.write( getDiff( tempPrevPath, currentPath ) );
			await confirm( `Accept ${file}?` );
		}
	}
};

const prevVersion = process.argv[ 2 ];

( async function main() {
	await ReleaseAssets.audit( prevVersion );
}() ).catch( e => {
	console.error( e.toString() );
	process.exit( 1 );
} );
