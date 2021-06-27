const fs = require( "fs" );
const http = require( "http" );
const path = require( "path" );

const rollup = require( "rollup" );
const kleur = require( "kleur" );
const loadConfigFile = require( "rollup/dist/loadConfigFile" );

const server = http.createServer( ( req, res ) => {
	try {
		const requestedPath = path.join(
			process.cwd(),

			// path.normalize will remove any "..".
			// Probably useless as at least Chrome resolves any ".."
			// _before_ sending the request.
			// Probably still a good idea to avoid accessing anything
			// _outside_ of process.cwd() anyways.
			path.normalize( req.url )
		);
		if ( fs.existsSync( requestedPath ) ) {
			return res.end( fs.readFileSync( requestedPath ) );
		}
		res.statusCode = 404;
		res.end( `Not found: ${req.url}.` );
	} catch ( e ) {
		res.statusCode = 500;
		res.end( `Unexpected error: ${e.message}.` );
	}
} );

server.listen( 4000 );

function relativeOutput( output = [] ) {
	return output.map( o => path.relative( process.cwd(), o ) ).join( ", " );
}

function inputToOutput( input, output ) {
	return `${input} -> ${relativeOutput( output )}`;
}

function errorString( err ) {
	let str = kleur.bold(
		( err.plugin ? `(plugin ${err.plugin}) ` : "" ) + err.toString()
	);
	str += "\n" + ( err.loc ? `${err.loc.file} ${err.loc.line}:${err.loc.column}` : err.id );
	str += `\n${kleur.grey( err.frame )}`;
	str += `\n${kleur.grey( err.stack )}`;
	return str;
}

loadConfigFile( path.resolve( process.cwd(), "rollup.config.js" ) ).then(
	async( { options, warnings } ) => {

		console.log( kleur.grey( `We currently have ${warnings.count} warnings` ) );
		warnings.flush();

		const watcher = rollup.watch( options );

		watcher.on( "event", event => {
			const { code, result } = event;
			if ( code === "BUNDLE_START" ) {
				const { input, output } = event;
				console.log( code, inputToOutput( input, output ) );
			} else if ( code === "BUNDLE_END" ) {
				const { duration, input, output } = event;
				console.log( code, inputToOutput( input, output ), `${duration}ms` );
			} else if ( code === "ERROR" ) {
				console.error( errorString( event.error ) );
			}
			if ( result ) {
				result.close();
			}
		} );

		process.on( "exit", ( _ ) => {
			watcher.close();
		} );
	}
).catch( ( err ) => {

	// Handle generic script error from before watcher starts
	console.error( err );

	// Watcher didn't get created so no reason to keep the process.
	// It doesn't exit automatically because the http server is alive.
	process.exit( 1 );
} );
