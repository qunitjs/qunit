/*jshint node:true */
module.exports = function( grunt ) {

require( "load-grunt-tasks" )( grunt );

function process( code, filepath ) {

	// Make coverage ignore external files
	if ( filepath.match( /^external\// ) ) {
		code = "/*istanbul ignore next */\n" + code;
	}

	return code

		// Embed version
		.replace( /@VERSION/g, grunt.config( "pkg" ).version )

		// Embed date (yyyy-mm-ddThh:mmZ)
		.replace( /@DATE/g, ( new Date() ).toISOString().replace( /:\d+\.\d+Z$/, "Z" ) );
}

// Prevents CRLF EOL on Windows environments
// grunt-contrib-concat defaults to CRLF on Windows if this is unset
grunt.util.linefeed = "\u000A";

grunt.initConfig( {
	pkg: grunt.file.readJSON( "package.json" ),
	concat: {
		options: { process: process },
		"src-js": {
			src: [
				"src/intro.js",
				"src/core/initialize.js",
				"src/core/utilities.js",
				"src/core/stacktrace.js",
				"src/core/config.js",
				"src/core/logging.js",
				"src/core/onerror.js",
				"src/core.js",
				"src/test.js",
				"src/assert.js",
				"src/equiv.js",
				"src/dump.js",
				"src/export.js",
				"src/outro.js",
				"runner/fixture.js",
				"reporter/intro.js",
				"reporter/urlparams.js",
				"reporter/html.js",
				"reporter/diff.js",
				"reporter/outro.js"
			],
			dest: "dist/qunit.js"
		},
		"src-css": {
			src: "src/qunit.css",
			dest: "dist/qunit.css"
		}
	},
	jshint: {
		options: {
			jshintrc: true
		},
		all: [
			"*.js",
			"{test,dist}/**/*.js",
			"build/*.js",
			"build/tasks/**/*.js"
		]
	},
	jscs: {
		options: {
			config: ".jscsrc"
		},
		all: [
			"<%= jshint.all %>",
			"!test/main/deepEqual.js"
		]
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
			"src/**/*.js",
			"reporter/**/*.js"
		]
	},
	qunit: {
		options: {
			timeout: 30000,
			"--web-security": "no",
			coverage: {
				src: "dist/qunit.js",
				instrumentedFiles: "temp/",
				htmlReport: "build/report/coverage",
				lcovReport: "build/report/lcov",
				linesThresholdPct: 70
			}
		},
		qunit: [
			"test/index.html",
			"test/deprecated.html",
			"test/autostart.html",
			"test/startError.html",
			"test/reorderError1.html",
			"test/reorderError2.html",
			"test/logs.html",
			"test/setTimeout.html",
			"test/amd.html",
			"test/reporter-html/index.html",
			"test/reporter-html/legacy-markup.html",
			"test/reporter-html/no-qunit-element.html",
			"test/reporter-html/single-testid.html",
			"test/reporter-urlparams.html",
			"test/moduleId.html",
			"test/only.html",
			"test/seed.html",
			"test/overload.html",
			"test/regex-filter.html",
			"test/regex-exclude-filter.html",
			"test/string-filter.html"
		]
	},
	coveralls: {
		options: {
			force: true
		},
		all: {

			// LCOV coverage file relevant to every target
			src: "build/report/lcov/lcov.info"
		}
	},
	"test-on-node": {
		files: [
			"test/logs",
			"test/main/test",
			"test/main/assert",
			"test/main/async",
			"test/main/promise",
			"test/main/modules",
			"test/main/deepEqual",
			"test/main/stack",
			"test/only",
			"test/setTimeout",
			"test/main/dump",
			"test/deprecated"
		]
	},
	concurrent: {
		build: [
			"concat:src-js",
			"concat:src-css"
		],
		test: [
			"jshint",
			"jscs",
			"search",
			"qunit",
			"test-on-node"
		]
	},
	watch: {
		options: {
			atBegin: true,
			spawn: false,
			interrupt: true
		},
		files: [
			".jshintrc",
			"*.js",
			"build/*.js",
			"{src,test,reporter}/**/*.js",
			"src/qunit.css",
			"test/**/*.html"
		],
		tasks: "default"
	}
} );

grunt.loadTasks( "build/tasks" );
grunt.registerTask( "build", [ "concat" ] );
grunt.registerTask( "default", [ "concurrent:build", "concurrent:test" ] );

};
