import config from "./config";

// Doesn't support IE9, it will return undefined on these browsers
// See also https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack
var fileName = ( sourceFromStacktrace( 0 ) || "" )
	.replace( /(:\d+)+\)?/, "" )
	.replace( /.+\//, "" );

export function extractStacktrace( e, offset ) {
	offset = offset === undefined ? 4 : offset;

	var stack, include, includeLine, i;

	if ( e && e.stack ) {
		stack = e.stack.split( "\n" );
		if ( /^error$/i.test( stack[ 0 ] ) ) {
			stack.shift();
		}
		if ( fileName ) {
			include = [];
			for ( i = offset; i < stack.length; i++ ) {
				if ( stack[ i ].indexOf( fileName ) !== -1 ) {
					break;
				}
				includeLine = stack[ i ];
				if ( config.projectPath ) {

					// replace on each line separately so only one occurence per line is replaced
					includeLine = includeLine.replace( config.projectPath, "" );
				}
				include.push( includeLine );
			}
			if ( include.length ) {
				return include.join( "\n" );
			}
		}
		return stack[ offset ];
	}
}

export function sourceFromStacktrace( offset ) {
	var error = new Error();

	// Support: Safari <=7 only, IE <=10 - 11 only
	// Not all browsers generate the `stack` property for `new Error()`, see also #636
	if ( !error.stack ) {
		try {
			throw error;
		} catch ( err ) {
			error = err;
		}
	}

	return extractStacktrace( error, offset );
}
