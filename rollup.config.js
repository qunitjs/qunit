/* eslint-env node */

var babel = require( "rollup-plugin-babel" );

module.exports = {
	format: "iife",
	exports: "none",
	plugins: [
		babel( {
			exclude: "node_modules/**"
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
