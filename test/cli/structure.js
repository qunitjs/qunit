const fs = require( "fs" );
const glob = require( "tiny-glob/sync" );

// This is a meta test to validate structural expectations of our
// tests, such as checking for fixture files that aren't used or
// missing from one of the test targets.
QUnit.module( "structure", () => {

	QUnit.module( "test/main/*.js", () => {
		const files = fs.readdirSync( __dirname + "/../main/" )
			.map( file => `main/${file}` );

		QUnit.test( "files", assert => {
			assert.true( files.length > 5, "found files" );
			assert.deepEqual(
				files.filter( file => file.endsWith( ".js" ) ),
				files,
				"js files"
			);
		} );

		QUnit.test( "test/index.html", assert => {
			const contents = fs.readFileSync( __dirname + "/../index.html", "utf8" );
			files.forEach( file => {
				assert.true( contents.includes( file ), file );
			} );
		} );

		QUnit.test( "Gruntfile#test-on-node", assert => {
			const raw = fs.readFileSync( __dirname + "/../../Gruntfile.js", "utf8" );
			const contents = raw.match( /test-on-node.*?\{.*?\}/s )[ 0 ];

			files.forEach( file => {
				assert.true( contents.includes( file ), file );
			} );
		} );

		QUnit.test( "test/mozjs", assert => {
			const contents = fs.readFileSync( __dirname + "/../mozjs.js", "utf8" );
			files.forEach( file => {
				assert.true( contents.includes( file ), file );
			} );
		} );

		QUnit.test( "test/webWorker-worker.js", assert => {
			const contents = fs.readFileSync( __dirname + "/../webWorker-worker.js", "utf8" );
			files.forEach( file => {
				assert.true( contents.includes( file ), file );
			} );
		} );
	} );

	QUnit.module( "test/**.html", () => {

		// Get a list of the HTML files, including in subdirectories (e.g. "test/reporter-html/").
		// Ignore file names containing "--", which are subresources (e.g. iframes).
		const files = glob( "**/*.html", {
			cwd: __dirname + "/../",
			filesOnly: true
		} )
			.filter( file => !file.includes( "--" ) && !file.includes( "integration/" ) )
			.map( file => `test/${file}` );

		QUnit.test( "files", assert => {
			assert.true( files.length > 5, "found files" );
		} );

		QUnit.test( "grunt-contrib-qunit", assert => {
			const raw = fs.readFileSync( __dirname + "/../../Gruntfile.js", "utf8" );
			const contents = raw.match( /@HTML_FILES.*?\[.*?\]/s )[ 0 ];

			files.forEach( file => {
				assert.true( contents.includes( file ), file );
			} );
		} );
	} );
} );

