"use strict";

const path = require( "path" );
const exec = require( "execa" ).shell;

// Executes the provided command from within the fixtures directory
// The execaOptions parameter is used by test/cli/watch.js to
// control the stdio stream.
module.exports = function execute( command, execaOptions ) {
	const cwd = process.cwd();
	process.chdir( path.join( __dirname, "..", "fixtures" ) );

	command = command.replace( /^qunit\b/, "../../../bin/qunit" );
	const execution = exec( command, execaOptions );

	process.chdir( cwd );

	return execution;
};
