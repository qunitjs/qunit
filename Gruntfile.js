/* eslint-env node */

var path = require( "path" );
var fs = require( "fs-extra" );
var semver = require( "semver" );

var instrumentedDir = "build/instrumented";
var reportDir = "build/report";

var HAS_ASYNC_FUNCTIONS = semver.satisfies( process.version, ">= 7.10" );

module.exports = function( grunt ) {
	var livereloadPort = grunt.option( "livereload-port" ) || 35729;

	// Load grunt tasks from NPM packages
	require( "load-grunt-tasks" )( grunt );

	function preprocess( code ) {
		return code

		// Embed version
			.replace( /@VERSION/g, grunt.config( "pkg" ).version )

		// Embed date (yyyy-mm-ddThh:mmZ)
			.replace( /@DATE/g, ( new Date() ).toISOString().replace( /:\d+\.\d+Z$/, "Z" ) );
	}

	grunt.initConfig( {
		pkg: grunt.file.readJSON( "package.json" ),
		connect: {
			server: {
				options: {
					port: 8000,
					base: ".",
					livereload: livereloadPort
				}
			}
		},
		copy: {
			options: { process: preprocess },

			"src-js": {
				src: "dist/qunit.js",
				dest: "dist/qunit.js"
			},
			"src-css": {
				src: "src/qunit.css",
				dest: "dist/qunit.css"
			},

			// Moves files around during coverage runs
			"dist-to-tmp": {
				src: "dist/qunit.js",
				dest: "dist/qunit.tmp.js"
			},
			"instrumented-to-dist": {
				src: "build/instrumented/dist/qunit.js",
				dest: "dist/qunit.js"
			},
			"tmp-to-dist": {
				src: "dist/qunit.tmp.js",
				dest: "dist/qunit.js"
			}
		},
		rollup: {
			options: require( "./rollup.config" ),
			src: {
				src: "src/qunit.js",
				dest: "dist/qunit.js"
			}
		},
		eslint: {
			options: {
				config: ".eslintrc.json"
			},
			js: [
				"*.js",
				"bin/qunit",
				"bin/**/*.js",
				"reporter/**/*.js",
				"runner/**/*.js",
				"src/**/*.js",

				"test/**/*.js",
				"build/*.js",
				"build/tasks/**/*.js"
			],
			html: {
				options: {
					rules: {
						indent: "off"
					}
				},
				src: [

					// Linting HTML files via eslint-plugin-html
					"test/**/*.html"
				]
			}
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
				"src/**/*.js",
				"reporter/**/*.js"
			]
		},
		qunit: {
			options: {
				timeout: 30000,
				"--web-security": "no",
				inject: [
					path.resolve( "./build/coverage-bridge.js" ),
					require.resolve( "grunt-contrib-qunit/phantomjs/bridge" )
				],
				urls: [
					"http://localhost:8000/test/sandboxed-iframe.html"
				]
			},
			qunit: [
				"test/index.html",
				"test/autostart.html",
				"test/startError.html",
				"test/reorder.html",
				"test/reorderError1.html",
				"test/reorderError2.html",
				"test/callbacks.html",
				"test/events.html",
				"test/events-in-test.html",
				"test/logs.html",
				"test/setTimeout.html",
				"test/amd.html",
				"test/reporter-html/index.html",
				"test/reporter-html/legacy-markup.html",
				"test/reporter-html/no-qunit-element.html",
				"test/reporter-html/single-testid.html",
				"test/reporter-html/window-onerror.html",
				"test/reporter-html/window-onerror-preexisting-handler.html",
				"test/reporter-urlparams.html",
				"test/moduleId.html",
				"test/onerror/inside-test.html",
				"test/onerror/outside-test.html",
				"test/only.html",
				"test/seed.html",
				"test/overload.html",
				"test/preconfigured.html",
				"test/regex-filter.html",
				"test/regex-exclude-filter.html",
				"test/string-filter.html",
				"test/module-only.html",
				"test/module-skip.html",
				"test/module-todo.html"
			]
		},
		"test-on-node": {
			files: [
				"test/logs",
				"test/main/test",
				"test/main/assert",
				"test/main/assert/step",
				"test/main/assert/timeout",
				"test/main/async",
				"test/main/promise",
				"test/main/modules",
				"test/main/deepEqual",
				"test/main/stack",
				"test/main/utilities",
				"test/events",
				"test/events-in-test",
				"test/onerror/inside-test",
				"test/onerror/outside-test",
				"test/only",
				"test/setTimeout",
				"test/main/dump",
				"test/node/storage-1",
				"test/node/storage-2",
				"test/module-only",
				"test/module-skip",
				"test/module-todo",
				HAS_ASYNC_FUNCTIONS ? "test/es2017/async-functions" : null
			].filter( Boolean )
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
				"{src,test,reporter}/**/*.js",
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
		},

		instrument: {
			files: "dist/qunit.js",
			options: {
				lazy: false,
				basePath: instrumentedDir
			}
		},

		storeCoverage: {
			options: {
				dir: reportDir
			}
		},

		makeReport: {
			src: reportDir + "/**/*.json",
			options: {
				type: [ "lcov" ],
				dir: reportDir,
				print: "detail"
			}
		},

		coveralls: {
			options: {
				force: true
			},
			all: {

				// LCOV coverage file relevant to every target
				src: "build/report/lcov.info"
			}
		}
	} );

	grunt.event.on( "qunit.coverage", function( file, coverage ) {
		var testName = file.split( "/test/" ).pop().replace( ".html", "" );
		var reportPath = path.join( "build/report/phantom", testName + ".json" );

		fs.ensureFileSync( reportPath );
		fs.writeJsonSync( reportPath, coverage, { spaces: 0 } );
	} );

	grunt.loadTasks( "build/tasks" );
	grunt.registerTask( "build", [ "rollup:src", "copy:src-js", "copy:src-css" ] );
	grunt.registerTask( "test-base", [ "eslint", "search", "test-on-node" ] );
	grunt.registerTask( "test", [ "test-base", "connect", "qunit" ] );
	grunt.registerTask( "test-in-watch", [ "test-base", "qunit" ] );
	grunt.registerTask( "coverage", [
		"build",
		"instrument",
		"copy:dist-to-tmp",
		"copy:instrumented-to-dist",
		"test",
		"copy:tmp-to-dist",
		"storeCoverage",
		"makeReport",
		"coveralls"
	] );

	// Start the web server in a watch pre-task
	// https://github.com/gruntjs/grunt-contrib-watch/issues/50
	grunt.renameTask( "watch", "watch-repeatable" );
	grunt.registerTask( "watch", [ "connect", "watch-repeatable" ] );

	grunt.registerTask( "default", [ "build", "test" ] );

};
