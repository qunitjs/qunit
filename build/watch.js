const fs = require( "fs" );
const http = require( "http" );
const path = require( "path" );

const rollup = require( "rollup" );
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

loadConfigFile( path.resolve( process.cwd(), "rollup.config.js" ) ).then(
	async( { options, warnings } ) => {

		console.log( `We currently have ${warnings.count} warnings` );
		warnings.flush();

		for ( const optionsObj of options ) {
			const bundle = await rollup.rollup( optionsObj );
			await Promise.all( optionsObj.output.map( bundle.write ) );
		}

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
				console.error( event.error );
			}
			if ( result ) {
				result.close();
			}
		} );

		process.on( "exit", ( _ ) => {
			watcher.close();
		} );
	}
);
