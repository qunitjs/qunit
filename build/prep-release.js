/* eslint-env node */
// Helper to prepare QUnit releases.
//
// This is inspired by <https://github.com/jquery/jquery-release>
// and <https://github.com/qunitjs/qunit-release>.

const fs = require( "fs" );

const Repo = {
	setFiles( version ) {
		if ( typeof version !== "string" || !/^\d+\.\d+\.\d+$/.test( version ) ) {
			throw new Error( "Invalid or missing version argument" );
		}
		{
			const file = "bower.json";
			console.log( `Updating ${file}...` );
			const json = fs.readFileSync( __dirname + "/../" + file, "utf8" );
			const packageIndentation = json.match( /\n([\t\s]+)/ )[ 1 ];
			const data = JSON.parse( json );

			data.version = version;

			fs.writeFileSync(
				__dirname + "/../" + file,
				JSON.stringify( data, null, packageIndentation ) + "\n"
			);
		}
		{
			const file = "package.json";
			console.log( `Updating ${file}...` );
			const json = fs.readFileSync( __dirname + "/../" + file, "utf8" );
			const packageIndentation = json.match( /\n([\t\s]+)/ )[ 1 ];
			const data = JSON.parse( json );

			data.version = version;
			data.author.url = data.author.url.replace( "master", version );

			fs.writeFileSync(
				__dirname + "/../" + file,
				JSON.stringify( data, null, packageIndentation ) + "\n"
			);
		}
	}
};

const version = process.argv[ 2 ];

try {
	Repo.setFiles( version );
} catch ( e ) {
	console.error( e.toString() );
	process.exit( 1 );
}
