/* eslint-env node */

const fs = require( "fs" );
const path = require( "path" );
const { preprocess } = require( "./build/dist-replace.js" );

var isCI = process.env.CI;

module.exports = function( grunt ) {
	var connectPort = Number( grunt.option( "connect-port" ) ) || 4000;

	grunt.loadNpmTasks( "grunt-contrib-connect" );
	grunt.loadNpmTasks( "grunt-contrib-copy" );
	grunt.loadNpmTasks( "grunt-contrib-qunit" );
	grunt.loadNpmTasks( "grunt-search" );

	grunt.initConfig( {
		connect: {
			base: {
				options: {

					// grunt-contrib-connect supports 'useAvailablePort' which
					// automatically finds a suitable port, but we can't use that here because
					// the grunt-contrib-qunit task needs to know the url ahead of time.
					port: connectPort,
					base: "."
				}
			}
		},
		copy: {
			options: { process: preprocess },

			"src-css": {
				src: "src/qunit.css",
				dest: "qunit/qunit.css"
			}
		},
		search: {
			options: {

				// Ensure that the only HTML entities used are those with a special status in XHTML
				// and that any common singleton/empty HTML elements end with the XHTML-compliant
				// "/>"rather than ">"
				searchString: /(&(?!gt|lt|amp|quot)[A-Za-z0-9]+;|<(?:hr|HR|br|BR|input|INPUT)(?![^>]*\/>)(?:\s+[^>]*)?>)/g,
				logFormat: "console",
				failOnMatch: true
			},
			xhtml: [
				"src/**/*.js"
			]
		},
		qunit: {
			all: {
				options: {
					timeout: 30000,
					puppeteer: {
						args: isCI ?

							// For CI
							[ "--no-sandbox" ] :

							// For local development
							// Allow Docker-based developer environmment to
							// inject --no-sandbox as-needed for Chrome.
							( process.env.CHROMIUM_FLAGS || "" ).split( " " )
					},
					inject: [
						path.resolve( "./build/coverage-bridge.js" ),
						require.resolve( "grunt-contrib-qunit/chrome/bridge" )
					],

					// @HTML_FILES
					urls: [
						"test/index.html",

						"test/amd.html",
						"test/autostart.html",
						"test/events-filters.html",
						"test/events-in-test.html",
						"test/headless.html",
						"test/logs.html",
						"test/module-skip.html",
						"test/module-todo.html",
						"test/only-each.html",
						"test/overload.html",
						"test/performance-mark.html",
						"test/preconfigured.html",
						"test/reorder.html",
						"test/reorderError1.html",
						"test/reorderError2.html",
						"test/reporter-urlparams.html",
						"test/sandboxed-iframe.html",
						"test/seed.html",
						"test/startError.html",
						"test/urlparams-module.html",
						"test/urlparams-moduleId.html",
						"test/urlparams-testId.html",
						"test/webWorker.html",

						"test/reporter-html/hidepassed.html?hidepassed=true",
						"test/reporter-html/legacy-markup.html",
						"test/reporter-html/no-qunit-element.html",
						"test/reporter-html/config-testId.html",
						"test/reporter-html/urlparams-filter.html",
						"test/reporter-html/window-onerror-preexisting-handler.html",
						"test/reporter-html/window-onerror.html",
						"test/reporter-html/xhtml-escape-details-source.xhtml",
						"test/reporter-html/xhtml-config-testId.xhtml"

					].map( file => `http://localhost:${connectPort}/${file}` )
				}
			}
		},

		"test-on-node": {
			files: [

				// Sync with test/index.html
				"test/main/assert.js",
				"test/main/assert-step.js",
				"test/main/assert-timeout.js",
				"test/main/async.js",
				"test/main/deepEqual.js",
				"test/main/dump.js",
				"test/main/each.js",
				"test/main/modules.js",
				"test/main/onError.js",
				"test/main/onUncaughtException.js",
				"test/main/promise.js",
				"test/main/setTimeout.js",
				"test/main/stack.js",
				"test/main/test.js",
				"test/main/utilities.js",

				// Sync with test/*.html files that also make sense for Node.js
				"test/events-in-test.js",
				"test/logs.js",
				"test/module-skip.js",
				"test/module-todo.js",

				"test/node/storage-1.js",
				"test/node/storage-2.js",

				"test/es2018/async-functions.js",
				"test/es2018/rejects.js",
				"test/es2018/throws.js"
			]
		}
	} );

	grunt.event.on( "qunit.coverage", function( file, coverage ) {
		var testName = file.split( "/test/" ).pop().replace( ".html", "" ).replace( /[/\\]/g, "--" );
		var reportPath = path.join( ".nyc_output", "browser--" + testName + ".json" );

		fs.mkdirSync( path.dirname( reportPath ), { recursive: true } );
		fs.writeFileSync( reportPath, JSON.stringify( coverage ) + "\n" );
	} );

	grunt.loadTasks( "build/tasks" );
	grunt.registerTask( "test", [ "search", "test-on-node", "connect:base", "qunit" ] );
};
