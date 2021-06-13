
const fs = require( "fs" );
const http = require( "http" );
const path = require( "path" );

const { execFile } = require( "child_process" );

const server = http.createServer( ( req, res ) => {
	try {
		const requestedPath = path.format( {
			root: process.cwd(),

			// path.normalize will remove any "..".
			// Probably useless as at least Chrome resolves any ".."
			// _before_ sending the request.
			// Probably still a good idea to avoid accessing anything
			// _outside_ of process.cwd() anyways.
			base: path.normalize( req.url )
		} );
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

const rollout = execFile( "npm", [ "run", "build:watch" ] );
rollout.stdout.on( "data", console.log );
rollout.stderr.on( "data", console.log );
