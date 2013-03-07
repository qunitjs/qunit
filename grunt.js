/*global config:true, task:true*/
module.exports = function( grunt ) {

grunt.loadNpmTasks( "grunt-git-authors" );

grunt.initConfig({
	pkg: '<json:package.json>',
	qunit: {
		qunit: [
			'test/index.html',
			'test/async.html'
			// TODO figure out why this fails on our Jenkins server (Linux)
			// 'test/logs.html'
		],
		addons: [
			'addons/canvas/canvas.html',
			'addons/close-enough/close-enough.html',
			'addons/composite/composite-demo-test.html'
			// TODO same as above
			// 'addons/step/step.html'
		]
	},
	lint: {
		qunit: 'qunit/qunit.js',
		addons: 'addons/**.js',
		tests: 'test/**.js',
		grunt: 'grunt.js'
	},
	// TODO remove this once grunt 0.4 is out, see jquery-ui for other details
	jshint: (function() {
		function parserc( path ) {
			var rc = grunt.file.readJSON( (path || "") + ".jshintrc" ),
				settings = {
					options: rc,
					globals: {}
				};

			(rc.predef || []).forEach(function( prop ) {
				settings.globals[ prop ] = true;
			});
			delete rc.predef;

			return settings;
		}

		return {
			qunit: parserc( "qunit/" ),
			addons: parserc( "addons/" ),
			tests: parserc( "test/" )
		};
	})()
});

grunt.registerTask( "build-git", function( sha ) {
	function processor( content ) {
		var tagline = " - A JavaScript Unit Testing Framework";
		return content.replace( tagline, "-" + sha + " " + grunt.template.today('isoDate') + tagline );
	}
	grunt.file.copy( "qunit/qunit.css", "dist/qunit-git.css", {
		process: processor
	});
	grunt.file.copy( "qunit/qunit.js", "dist/qunit-git.js", {
		process: processor
	});
});

grunt.registerTask( "testswarm", function( commit, configFile ) {
	var testswarm = require( "testswarm" ),
		config = grunt.file.readJSON( configFile ).qunit,
		runs = {},
		done = this.async();
	["index", "async"].forEach(function (suite) {
		runs[suite] = config.testUrl + commit + "/test/" + suite + ".html";
	});
	testswarm.createClient( {
		url: config.swarmUrl,
		pollInterval: 10000,
		timeout: 1000 * 60 * 30
	} )
	.addReporter( testswarm.reporters.cli )
	.auth( {
		id: config.authUsername,
		token: config.authToken
	} )
	.addjob(
		{
			name: 'QUnit commit #<a href="https://github.com/jquery/qunit/commit/' + commit + '">' + commit.substr( 0, 10 ) + '</a>',
			runs: runs,
			browserSets: config.browserSets
		}, function( err, passed ) {
			if ( err ) {
				grunt.log.error( err );
			}
			done( passed === true );
		}
	);
});


grunt.registerTask( "test-on-node", function() {
	var done = this.async(),
		QUnit = require("./qunit/qunit");
	QUnit.begin(function() {
		grunt.log.ok('BEGIN');
	});
	QUnit.log(function( details ) {
		if ( details.result ) {
			return;
		}
		var message = "name: " + details.name + " module: " + details.module + " message: " + details.message;
		grunt.log.error(message);
	});
	QUnit.done(function( details ) {
		var succeeded = (details.failed === 0),
			message = details.total + " assertions in (" + details.runtime + "ms), passed: " + details.passed + ", failed: " + details.failed;
		if ( succeeded ) {
			grunt.log.ok(message);
		} else {
			grunt.log.error(message);
		}
		done( succeeded );
	});
	QUnit.config.autorun = false;
	QUnit.load();

	var extend = function ( a, b ) {
		for ( var prop in b ) {
			if ( b[ prop ] === undefined ) {
				delete a[ prop ];
			} else if ( prop !== "constructor" ) {
				a[ prop ] = b[ prop ];
			}
		}
		return a;
	};

	extend(global, QUnit);
	global.QUnit = QUnit;

	require("./test/test");
	require("./test/deepEqual");
});


grunt.registerTask('default', 'lint qunit');

};
