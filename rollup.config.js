/* eslint-env node */

var babel = require( "rollup-plugin-babel" );

module.exports = {
	format: "iife",
	exports: "none",
	plugins: [
		babel( {
			presets: [

				// Use ES2015 but don't transpile modules since Rollup does that
				[ "es2015", { modules: false } ]
			],
			plugins: [ "external-helpers" ]
		} )
	],

	// eslint-disable-next-line no-multi-str
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

	globals: {
		global: "(function() { return this; }())"
	},
	external: [
		"global"
	]
};
