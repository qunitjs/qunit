"use strict";

const JSReporters = require( "js-reporters" );
const utils = require( "./utils" );
const pkg = require( "../../package.json" );

function findReporter( reporterName ) {
	if ( !reporterName ) {
		return JSReporters.TapReporter;
	}

	// First, check if the reporter is one of the standard js-reporters ones

	const capitalizedName = utils.capitalize( reporterName );
	const jsReporterName = `${capitalizedName}Reporter`;

	if ( JSReporters[ jsReporterName ] ) {
		return JSReporters[ jsReporterName ];
	}

	// Second, check if the reporter is an npm package
	try {
		return require( reporterName );
	} catch ( e ) {
		if ( e.code !== "MODULE_NOT_FOUND" ) {
			throw e;
		}
	}

	// If we didn't find a reporter, display the available reporters and exit
	displayAvailableReporters( reporterName );
}

function displayAvailableReporters( inputReporterName ) {
	const message = [];

	if ( inputReporterName ) {
		message.push( `No reporter found matching "${inputReporterName}".` );
	}

	const jsReporters = getReportersFromJSReporters();

	message.push( `Available reporters from JS Reporters are: ${jsReporters.join( ", " )}` );

	const npmReporters = getReportersFromDependencies();
	if ( npmReporters.length ) {
		message.push(
			`Available custom reporters from dependencies are: ${npmReporters.join( ", " )}`
		);
	}

	utils.error( message.join( "\n" ) );
}

function getReportersFromJSReporters() {
	const jsReporterRegex = /(.*)Reporter$/;
	return Object.keys( JSReporters )
		.filter( key => jsReporterRegex.test( key ) )
		.map( reporter => reporter.match( jsReporterRegex )[ 1 ].toLowerCase() )
		.sort();
}

function getReportersFromDependencies() {
	const dependencies = [].concat(
		Object.keys( pkg.dependencies ),
		Object.keys( pkg.devDependencies )
	);
	return dependencies.filter( dep => {
		try {
			const pkg = require( dep + "/package.json" );

			return !!pkg.keywords && pkg.keywords.indexOf( "js-reporter" ) !== -1;
		} catch ( e ) {
			if ( e.code !== "MODULE_NOT_FOUND" ) {
				throw e;
			}
		}

		return false;
	} );
}

module.exports = {
	findReporter,
	displayAvailableReporters
};
