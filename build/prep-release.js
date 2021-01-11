// Helper for the QUnit release preparation commit.
//
// See also RELEASE.md.
//
// Inspired by <https://github.com/jquery/jquery-release>.

/* eslint-env node */

const fs = require( "fs" );
const path = require( "path" );
const util = require( "util" );
const cp = require( "child_process" );
const gitAuthors = require( "grunt-git-authors" );

const Repo = {
	async prep( version ) {
		if ( typeof version !== "string" || !/^\d+\.\d+\.\d+$/.test( version ) ) {
			throw new Error( "Invalid or missing version argument" );
		}
		{
			const file = "History.md";
			console.log( `Updating ${file}...` );

			const filePath = path.join( __dirname, "..", file );
			const oldContent = fs.readFileSync( filePath, "utf8" );
			const oldVersion = require( "../package.json" ).version.replace( /-.*$/, "" );

			const changeFilter = [
				/^\* Release \d+\./,
				/^\* Build: /,
				/^\* Docs: /,
				/^\* Tests: /
			];
			let changes = cp.execFileSync( "git", [
				"log",
				"--format=* %s. (%aN)",
				"--no-merges",
				`${oldVersion}...HEAD`
			], { encoding: "utf8" } );

			changes = changes
				.trim()
				.split( "\n" )
				.filter( line => !changeFilter.some( filter => filter.test( line ) ) )
				.map( line => {
					return {
						component: line.replace( /^\* ([^:]+):.*$/, "$1" ),
						line
					};
				} )
				.sort()
				.map( change => change.line )
				.join( "\n" );

			const today = new Date().toISOString().slice( 0, 10 );
			const newSection = `\n${version} / ${today}
				==================

				### Added

				### Changed

				### Deprecated

				### Fixed

				### Removed

				`.replace( /^[ \t]*/gm, "" );

			fs.writeFileSync( filePath, newSection + changes + oldContent );
		}
		{
			const file = "package.json";
			console.log( `Updating ${file}...` );
			const filePath = path.join( __dirname, "..", file );
			const json = fs.readFileSync( filePath, "utf8" );
			const packageIndentation = json.match( /\n([\t\s]+)/ )[ 1 ];
			const data = JSON.parse( json );

			data.version = `${version}-pre`;

			fs.writeFileSync(
				filePath,
				JSON.stringify( data, null, packageIndentation ) + "\n"
			);
		}
		{
			const file = "AUTHORS.txt";
			console.log( `Updating ${file}...` );
			const updateAuthors = util.promisify( gitAuthors.updateAuthors );
			await updateAuthors( {
				dir: path.dirname( __dirname ),
				filename: file,
				banner: "Authors ordered by first contribution"
			} );
		}
	}
};

const version = process.argv[ 2 ];

( async function main() {
	await Repo.prep( version );
}() ).catch( e => {
	console.error( e.toString() );
	process.exit( 1 );
} );
