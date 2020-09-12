/* eslint-env node */

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
