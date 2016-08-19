/* jshint multistr:true, node:true */

var babel = require( "rollup-plugin-babel" );
var nodeResolve = require( "rollup-plugin-node-resolve" );

module.exports = {
	format: "iife",
	exports: "none",
	plugins: [
		nodeResolve(),
		babel( {
			presets: [

				// Use ES2015 but don't transpile modules since Rollup does that
				[ "es2015", { modules: false } ]
			],
			plugins: [ "external-helpers" ]
		} )
	],

	// jscs:disable disallowMultipleLineStrings
	banner: "/*!\n\
 * QUnit @VERSION\n\
 * https://qunitjs.com/\n\
 *\n\
 * Copyright jQuery Foundation and other contributors\n\
 * Released under the MIT license\n\
 * https://jquery.org/license\n\
 *\n\
 * Date: @DATE\n\
 */",

	// jscs:enable disallowMultipleLineStrings
	globals: {
		global: "(function() { return this; }())"
	},
	external: [
		"global"
	]
};
