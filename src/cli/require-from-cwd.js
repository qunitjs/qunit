module.exports = function requireFromCWD( mod ) {
	const resolvedPath = require.resolve( mod, { paths: [ process.cwd() ] } );
	return require( resolvedPath );
};
