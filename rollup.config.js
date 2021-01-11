/* eslint-env node */

const fs = require( "fs" );
const { babel } = require( "@rollup/plugin-babel" );
const { nodeResolve } = require( "@rollup/plugin-node-resolve" );
const commonjs = require( "@rollup/plugin-commonjs" );
const replace = require( "@rollup/plugin-replace" );

const { replacements } = require( "./build/dist-replace.js" );
const isCoverage = process.env.BUILD_TARGET === "coverage";

module.exports = {
	input: "src/qunit.js",
	output: {
		file: "dist/qunit.js",
		sourcemap: isCoverage,
		format: "iife",
		exports: "none",

		// eslint-disable-next-line no-multi-str
		banner: "/*!\n\
 * QUnit @VERSION\n\
 * https://qunitjs.com/\n\
 *\n\
 * Copyright OpenJS Foundation and other contributors\n\
 * Released under the MIT license\n\
 * https://jquery.org/license\n\
 *\n\
 * Date: @DATE\n\
 */",

		intro: function() {

			// Define the (partial) ES6 Map polyfill for "fuzzysort".
			// Per https://github.com/qunitjs/qunit/issues/1508:
			// 1. Must not leak as global variable, since it's not full Map implementation.
			// 2. Must be seen by fuzzysort as-is (e.g. not get renamed as normal
			//    variables in an imported file would be).
			return fs.readFileSync(
				__dirname + "/src/html-reporter/es6-map.js",
				"utf8"
			).toString().trim();
		},

		globals: {
			global: "(function() { return this; }())"
		}
	},
	plugins: [
		replace( {
			delimiters: [ "", "" ],
			...replacements
		} ),
		nodeResolve(),
		commonjs(),
		babel( {
			babelHelpers: "bundled",
			babelrc: true
		} )
	],
	external: [
		"global"
	]
};
