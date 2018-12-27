const resolve = require( "resolve" );

module.exports = function requireFromCWD( mod ) {
	const resolvedPath = resolve.sync( mod, { basedir: process.cwd() } );
	return require( resolvedPath );
};
