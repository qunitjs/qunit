/* jshint multistr:true, node:true */

var babel = require( "rollup-plugin-babel" );

module.exports = {
	format: "iife",
	exports: "none",
	plugins: [
		babel( {
			presets: [ "es2015-rollup" ]
		} )
	],

	// jscs:disable disallowMultipleLineStrings
	banner: "\
/*!\n\
 * QUnit @VERSION\n\
 * https://qunitjs.com/\n\
 *\n\
 * Copyright jQuery Foundation and other contributors\n\
 * Released under the MIT license\n\
 * https://jquery.org/license\n\
 *\n\
 * Date: @DATE\n\
 */\
",

	// jscs:enable disallowMultipleLineStrings
	globals: {
		global: "(function() { return this; }())"
	},
	external: [
		"global"
	]
};
