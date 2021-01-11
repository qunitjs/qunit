/* eslint-env node */

const fs = require( "fs" );
const path = require( "path" );
const { preprocess } = require( "./build/dist-replace.js" );

// Detect Travis CI or Jenkins.
var isCI = process.env.CI || process.env.JENKINS_HOME;

module.exports = function( grunt ) {
	var livereloadPort = grunt.option( "livereload-port" ) || 35729;
	var connectPort = Number( grunt.option( "connect-port" ) ) || 4000;

	// Load grunt tasks from NPM packages
	grunt.loadNpmTasks( "grunt-contrib-connect" );
	grunt.loadNpmTasks( "grunt-contrib-copy" );
	grunt.loadNpmTasks( "grunt-contrib-qunit" );
	grunt.loadNpmTasks( "grunt-contrib-watch" );
	grunt.loadNpmTasks( "grunt-eslint" );
	grunt.loadNpmTasks( "grunt-search" );

	grunt.initConfig( {
		connect: {
			nolivereload: {
				options: {

					// grunt-contrib-connect supports 'useAvailablePort' which
					// automatically finds a suitable port, but we can't use that here because
					// the grunt-contrib-qunit task needs to know the url ahead of time.
					port: connectPort,
					base: "."
				}
			},

			// For use by the "watch" task.
			livereload: {
				options: {
					port: connectPort,
					base: ".",
					livereload: livereloadPort
				}
			}
		},
		copy: {
			options: { process: preprocess },

			"src-css": {
				src: "src/qunit.css",
				dest: "dist/qunit.css"
			}
		},
		eslint: {
			all: "."
		},
		search: {
			options: {

				// Ensure that the only HTML entities used are those with a special status in XHTML
				// and that any common singleton/empty HTML elements end with the XHTML-compliant
				// "/>"rather than ">"
				searchString: /(&(?!gt|lt|amp|quot)[A-Za-z0-9]+;|<(?:hr|HR|br|BR|input|INPUT)(?![^>]*\/>)(?:\s+[^>]*)?>)/g, // eslint-disable-line max-len
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
					puppeteer: !isCI ? {

						// Allow Docker-based developer environmment to
						// inject --no-sandbox as-needed for Chrome.
						args: ( process.env.CHROMIUM_FLAGS || "" ).split( " " )
					} : {
						args: [

							// https://docs.travis-ci.com/user/chrome#sandboxing
							"--no-sandbox"
						]
					},
					inject: [
						path.resolve( "./build/coverage-bridge.js" ),
						require.resolve( "grunt-contrib-qunit/chrome/bridge" )
					],
					urls: [
						"test/index.html",
						"test/autostart.html",
						"test/startError.html",
						"test/reorder.html",
						"test/reorderError1.html",
						"test/reorderError2.html",
						"test/callbacks.html",
						"test/callbacks-promises.html",
						"test/events.html",
						"test/events-filters.html",
						"test/events-in-test.html",
						"test/logs.html",
						"test/amd.html",
						"test/reporter-html/legacy-markup.html",
						"test/reporter-html/no-qunit-element.html",
						"test/reporter-html/single-testid.html",
						"test/reporter-html/window-onerror.html",
						"test/reporter-html/window-onerror-preexisting-handler.html",
						"test/reporter-html/xhtml-escape-details-source.xhtml",
						"test/reporter-html/xhtml-single-testid.xhtml",
						"test/reporter-urlparams.html",
						"test/reporter-urlparams-hidepassed.html",
						"test/moduleId.html",
						"test/onerror/inside-test.html",
						"test/onerror/outside-test.html",
						"test/seed.html",
						"test/overload.html",
						"test/preconfigured.html",
						"test/regex-filter.html",
						"test/regex-exclude-filter.html",
						"test/string-filter.html",
						"test/module-skip.html",
						"test/module-todo.html",

						// ensure this is last - it has the potential to drool
						// and omit subsequent tests during coverage runs
						"test/sandboxed-iframe.html"
					].map( file => `http://localhost:${connectPort}/${file}` )
				}
			}
		},
		"test-on-node": {
			files: [
				"test/logs.js",
				"test/main/test.js",
				"test/main/assert.js",
				"test/main/assert/step.js",
				"test/main/assert/timeout.js",
				"test/main/async.js",
				"test/main/promise.js",
				"test/main/modules.js",
				"test/main/deepEqual.js",
				"test/main/stack.js",
				"test/main/utilities.js",
				"test/events.js",
				"test/events-in-test.js",
				"test/onerror/inside-test.js",
				"test/onerror/outside-test.js",
				"test/setTimeout.js",
				"test/main/dump.js",
				"test/node/storage-1.js",
				"test/node/storage-2.js",

				"test/cli/fixtures/only/test.js",
				"test/cli/fixtures/only/module.js",
				"test/cli/fixtures/only/module-flat.js",

				// FIXME: These tests use an ugly hack that re-opens
				// an already finished test run. This only works reliably
				// via the HTML Reporter thanks to some delays in the bridge.
				// These tests are about reporting, not about functional
				// behaviour. They would be best run either as reflection on the
				// DOM in an HTML Reporter test, or from the CLI by asserting
				// TAP output. I suggest we do the latter, and then remove them
				// from here.
				//
				// Ref https://github.com/qunitjs/qunit/issues/1511
				//
				// "test/module-skip.js",
				// "test/module-todo.js",
				"test/es2018/async-functions.js",
				"test/es2018/throws.js"
			]
		},
		"watch-repeatable": {
			options: {
				atBegin: true,
				spawn: false,
				interrupt: true
			},
			files: [
				".eslintrc.json",
				"*.js",
				"build/*.js",
				"{src,test}/**/*.js",
				"src/qunit.css",
				"test/*.{html,js}",
				"test/**/*.html"
			],
			tasks: [ "build", "livereload", "test-in-watch" ]
		},

		livereload: {
			options: {
				port: livereloadPort
			}
		}
	} );

	grunt.event.on( "qunit.coverage", function( file, coverage ) {
		var testName = file.split( "/test/" ).pop().replace( ".html", "" ).replace( /[/\\]/g, "--" );
		var reportPath = path.join( ".nyc_output", "browser--" + testName + ".json" );

		fs.mkdirSync( path.dirname( reportPath ), { recursive: true } );
		fs.writeFileSync( reportPath, JSON.stringify( coverage ) + "\n" );
	} );

	grunt.loadTasks( "build/tasks" );
	grunt.registerTask( "test-base", [ "eslint", "search", "test-on-node" ] );
	grunt.registerTask( "test", [ "test-base", "connect:nolivereload", "qunit" ] );
	grunt.registerTask( "test-in-watch", [ "test-base", "qunit" ] );

	// Start the web server in a watch pre-task
	// https://github.com/gruntjs/grunt-contrib-watch/issues/50
	grunt.renameTask( "watch", "watch-repeatable" );
	grunt.registerTask( "watch", [ "connect:livereload", "watch-repeatable" ] );
};
