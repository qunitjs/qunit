// Helper for the "Reproducible builds" job.
//
// Prerequisites:
// * Node.js 12+
// * npm 7.7.0+
// * tar (preinstalled on Linux/macOS)
// * shasum (preinstalled on Linux/macOS)

const cp = require( "child_process" );
const fs = require( "fs" );
const path = require( "path" );
const util = require( "util" );

const utils = require( "./utils.js" );
const execFile = util.promisify( cp.execFile );
const tempDir = path.join( __dirname, "../temp", "reproducible-builds" );
const SRC_REPO = "https://github.com/qunitjs/qunit.git";

/**
 * How many past releases to verify.
 *
 * Note that qunit@<2.16.0 were not fully reproducible.
 *
 * qunit@<=2.14.1 embedded a timestamp in the file header. This would have to be
 * ignored (or replaced with the timestamp found in the files you compare against).
 * In the 2.14.1, timestamps were removed from the output. Also, prior to 2.14.1,
 * the build wrote files to "/dist" instead of "/qunit".
 *
 * qunit@2.15.0 contained some CR (\r) characters in comments from fuzzysort.js,
 * which got normalized to LF (\n) by Git, npm, and the CDN on their own. This was
 * fixed in qunit@2.16.0 by removing the comment in question, and qunit@2.17.0
 * normalizes CRLF during the build.
 */
const VERIFY_COUNT = 2;

async function buildRelease( version, cacheDir = null ) {
	console.log( `... ${version}: checking out the source` );

	const gitDir = path.join( tempDir, `git-${version}` );
	utils.cleanDir( gitDir );

	await execFile( "git", [ "clone", "-q", "-b", version, "--depth=5", SRC_REPO, gitDir ] );

	// Remove any artefacts that were checked into Git
	utils.cleanDir( gitDir + "/qunit/" );

	// Use sync for npm-ci to avoid concurrency bugs with shared cache
	console.log( `... ${version}: installing development dependencies from npm` );
	cp.execFileSync( "npm", [ "ci" ], {
		env: {
			npm_config_cache: cacheDir,
			npm_config_update_notifier: "false",
			PATH: process.env.PATH,
			PUPPETEER_DOWNLOAD_PATH: path.join( cacheDir, "puppeteer_download" )
		},
		cwd: gitDir
	} );

	console.log( `... ${version}: building release` );
	await execFile( "npm", [ "run", "build" ],
		{ env: { PATH: process.env.PATH }, cwd: gitDir }
	);

	console.log( `... ${version}: packing npm package` );
	await execFile( "npm", [ "pack" ],
		{ env: { PATH: process.env.PATH }, cwd: gitDir }
	);

	return {
		js: fs.readFileSync( gitDir + "/qunit/qunit.js", "utf8" ),
		css: fs.readFileSync( gitDir + "/qunit/qunit.css", "utf8" ),
		tgz: cp.execFileSync(
			"shasum", [ "-a", "256", "-b", `qunit-${version}.tgz` ],
			{ encoding: "utf8", cwd: gitDir }
		)
	};
}

const Reproducible = {
	async fetch() {

		// Keep the stuff that matters in memory. Below, we will run unaudited npm dev deps
		// as part of build commands, which can modify anything on disk.
		const releases = {};

		{
			console.log( "Setting up temp directory..." );

			// This can take a while when running it locally (not CI),
			// as it first need to remove any old builds.
			utils.cleanDir( tempDir );
		}
		{
			console.log( "Fetching releases from jQuery CDN..." );
			const cdnIndexUrl = "https://releases.jquery.com/resources/cdn.json";
			const data = JSON.parse( await utils.download( cdnIndexUrl ) );

			for ( const release of data.qunit.all.slice( 0, VERIFY_COUNT ) ) {
				releases[ release.version ] = {
					cdn: {
						js: await utils.download( `https://code.jquery.com/${release.filename}` ),
						css: await utils.download( `https://code.jquery.com/${release.theme}` )
					}
				};
			}
		}
		{
			console.log( "Fetching releases from npmjs.org..." );
			const npmIndexUrl = "https://registry.npmjs.org/qunit";
			const data = JSON.parse( await utils.download( npmIndexUrl ) );

			for ( const version of Object.keys( data.versions ).slice( -VERIFY_COUNT ) ) {
				if ( !releases[ version ] ) {
					releases[ version ] = {};
				}

				const tarball = data.versions[ version ].dist.tarball;
				const tarFile = path.join( tempDir, path.basename( tarball ) );
				await utils.downloadFile( tarball, tarFile );

				releases[ version ].npm = {
					js: cp.execFileSync(
						"tar", [ "-xOf", tarFile, "package/qunit/qunit.js" ],
						{ encoding: "utf8" }
					),
					css: cp.execFileSync(
						"tar", [ "-xOf", tarFile, "package/qunit/qunit.css" ],
						{ encoding: "utf8" }
					),
					tgz: cp.execFileSync(
						"shasum", [ "-a", "256", "-b", path.basename( tarball ) ],
						{ encoding: "utf8", cwd: tempDir }
					)
				};
			}
		}
		{
			console.log( "Reproducing release builds..." );

			const cacheDir = path.join( tempDir, "cache" );
			utils.cleanDir( cacheDir );

			// Start the builds in parallel and await results.
			// Let the first error propagate and ignore others (avoids "Unhandled rejection" later).
			const buildPromises = [];
			for ( const version in releases ) {
				releases[ version ].buildPromise = buildRelease( version, cacheDir );
				buildPromises.push( releases[ version ].buildPromise );
			}
			await Promise.all( buildPromises );

			const diffs = [];
			for ( const version in releases ) {
				const release = releases[ version ];
				const build = await release.buildPromise;

				// For qunit@2.15.0, normalize CRLF to match what Git and npm did during upload.
				if ( version === "2.15.0" ) {
					build.js = utils.normalizeEOL( build.js );
				}

				let verified = true;
				for ( const distro in release ) {
					for ( const file in release[ distro ] ) {
						if ( release[ distro ][ file ] !== build[ file ] ) {
							verified = false;
							console.error(
								`QUnit ${version} ${file} from ${distro} differs from build`
							);
							diffs.push( [
								{ name: `qunit-${version}-build.${file}`,
									contents: build[ file ] },
								{ name: `qunit-${version}-${distro}.${file}`,
									contents: release[ distro ][ file ] }
							] );
						}
					}
				}

				if ( verified ) {
					console.log( `QUnit ${version} is reproducible and matches distributions!` );
				}
			}

			diffs.forEach( diff => {
				const fromFile = path.join( tempDir, diff[ 0 ].name );
				const toFile = path.join( tempDir, diff[ 1 ].name );
				fs.writeFileSync( fromFile, utils.verboseNonPrintable( diff[ 0 ].contents ) );
				fs.writeFileSync( toFile, utils.verboseNonPrintable( diff[ 1 ].contents ) );
				process.stdout.write(
					utils.getDiff( fromFile, toFile, { ignoreWhitespace: false } )
				);
			} );
			if ( diffs.length ) {
				throw new Error( "One or more distributions differ from the reproduced build" );
			}
		}
	}
};

( async function main() {
	await Reproducible.fetch();
}() ).catch( e => {
	console.error( e.toString() );
	process.exit( 1 );
} );
