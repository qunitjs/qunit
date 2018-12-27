const resolve = require( "resolve" );

module.exports = function requireFromCWD( mod ) {

	// TODO: Once Node 8+ is required, consider using native require.resolve().
	const resolvedPath = resolve.sync( mod, { basedir: process.cwd() } );
	return require( resolvedPath );
};
