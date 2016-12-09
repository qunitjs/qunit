/* eslint-env node */

// Support: Node.js <4
var oldNode = /^v0\./.test( process.version );

module.exports = function( grunt ) {

// Load grunt tasks from NPM packages
// Don't load the eslint task in old Node.js, it won't parse
require( "load-grunt-tasks" )( grunt, {
	pattern: oldNode ? [ "grunt-*", "!grunt-eslint" ] : [ "grunt-*" ]
} );

// Skip running tasks that dropped support for Node.js 0.12 in this Node version
function runIfNewNode( task ) {
	return oldNode ? "print_old_node_message:" + task : task;
}

grunt.registerTask( "print_old_node_message", function() {
	var task = [].slice.call( arguments ).join( ":" );
	grunt.log.writeln( "Old Node.js detected, running the task \"" + task + "\" skipped..." );
} );

function process( code ) {
	return code

		// Embed version
		.replace( /@VERSION/g, grunt.config( "pkg" ).version )

		// Embed date (yyyy-mm-ddThh:mmZ)
		.replace( /@DATE/g, ( new Date() ).toISOString().replace( /:\d+\.\d+Z$/, "Z" ) );
}

grunt.initConfig( {
	pkg: grunt.file.readJSON( "package.json" ),
	copy: {
		options: { process: process },
		"src-js": {
			src: "dist/qunit.js",
			dest: "dist/qunit.js"
		},
		"src-css": {
			src: "src/qunit.css",
			dest: "dist/qunit.css"
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
		all: [
			"*.js",
			"reporter/**/*.js",
			"runner/**/*.js",
			"src/**/*.js",

			"test/**/*.js",
			"build/*.js",
			"build/tasks/**/*.js",

			// Linting HTML files via eslint-plugin-html
			"test/**/*.html"
		]
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
			"--web-security": "no"
		},
		qunit: [
			"test/index.html",
			"test/deprecated.html",
			"test/autostart.html",
			"test/startError.html",
			"test/reorderError1.html",
			"test/reorderError2.html",
			"test/callbacks.html",
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
			"test/preconfigured.html",
			"test/regex-filter.html",
			"test/regex-exclude-filter.html",
			"test/string-filter.html"
		]
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
			"test/deprecated",
			"test/node/storage-1",
			"test/node/storage-2"
		]
	},
	watch: {
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
			"test/**/*.html"
		],
		tasks: "default"
	}
} );

grunt.loadTasks( "build/tasks" );
grunt.registerTask( "build", [ "rollup:src", "copy" ] );
grunt.registerTask( "test", [ runIfNewNode( "eslint" ), "search", "test-on-node", "qunit" ] );
grunt.registerTask( "default", [ "build", "test" ] );

};
