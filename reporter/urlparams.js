import QUnit from "../src/core";
import { window } from "../src/globals";

( function() {

// Only interact with URLs via window.location
	var location = typeof window !== "undefined" && window.location;
	if ( !location ) {
		return;
	}

	var urlParams = getUrlParams();

	QUnit.urlParams = urlParams;

// Match module/test by inclusion in an array
	QUnit.config.moduleId = [].concat( urlParams.moduleId || [] );
	QUnit.config.testId = [].concat( urlParams.testId || [] );

// Exact case-insensitive match of the module name
	QUnit.config.module = urlParams.module;

// Regular expression or case-insenstive substring match against "moduleName: testName"
	QUnit.config.filter = urlParams.filter;

// Test order randomization
	if ( urlParams.seed === true ) {

	// Generate a random seed if the option is specified without a value
		QUnit.config.seed = Math.random().toString( 36 ).slice( 2 );
	} else if ( urlParams.seed ) {
		QUnit.config.seed = urlParams.seed;
	}

// Add URL-parameter-mapped config values with UI form rendering data
	QUnit.config.urlConfig.push(
		{
			id: "hidepassed",
			label: "Hide passed tests",
			tooltip: "Only show tests and assertions that fail. Stored as query-strings."
		},
		{
			id: "noglobals",
			label: "Check for Globals",
			tooltip: "Enabling this will test if any test introduces new properties on the " +
			"global object (`window` in Browsers). Stored as query-strings."
		},
		{
			id: "notrycatch",
			label: "No try-catch",
			tooltip: "Enabling this will run tests outside of a try-catch block. Makes debugging " +
			"exceptions in IE reasonable. Stored as query-strings."
		}
);

	QUnit.begin( function() {
		var i, option,
			urlConfig = QUnit.config.urlConfig;

		for ( i = 0; i < urlConfig.length; i++ ) {

		// Options can be either strings or objects with nonempty "id" properties
			option = QUnit.config.urlConfig[ i ];
			if ( typeof option !== "string" ) {
				option = option.id;
			}

			if ( QUnit.config[ option ] === undefined ) {
				QUnit.config[ option ] = urlParams[ option ];
			}
		}
	} );

	function getUrlParams() {
		var i, param, name, value;
		var urlParams = Object.create( null );
		var params = location.search.slice( 1 ).split( "&" );
		var length = params.length;

		for ( i = 0; i < length; i++ ) {
			if ( params[ i ] ) {
				param = params[ i ].split( "=" );
				name = decodeQueryParam( param[ 0 ] );

			// Allow just a key to turn on a flag, e.g., test.html?noglobals
				value = param.length === 1 ||
				decodeQueryParam( param.slice( 1 ).join( "=" ) );
				if ( name in urlParams ) {
					urlParams[ name ] = [].concat( urlParams[ name ], value );
				} else {
					urlParams[ name ] = value;
				}
			}
		}

		return urlParams;
	}

	function decodeQueryParam( param ) {
		return decodeURIComponent( param.replace( /\+/g, "%20" ) );
	}

}() );
