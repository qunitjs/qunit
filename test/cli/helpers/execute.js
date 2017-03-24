"use strict";

const path = require( "path" );
const exec = require( "execa" ).shell;

// Executes the provided command from within the fixtures directory
module.exports = function execute( command ) {
	const cwd = process.cwd();
	process.chdir( path.join( __dirname, "..", "fixtures" ) );

	const execution = exec( command );

	process.chdir( cwd );

	return execution;
};
