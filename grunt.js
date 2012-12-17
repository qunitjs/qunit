/*global config:true, task:true*/
module.exports = function( grunt ) {

grunt.loadNpmTasks( "grunt-git-authors" );

grunt.initConfig({
	pkg: '<json:package.json>',
	qunit: {
		qunit: [
			'test/index.html',
			'test/async.html'
			// TODO: Fix test failures in test/logs.js
			// 'test/logs.html'
		],
		addons: [
			'addons/canvas/canvas.html',
			'addons/close-enough/close-enough.html',
			'addons/composite/composite-demo-test.html'
			// TODO: Fix test failures addons/step-test.js
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
		suites = ["index.html", "async.html"];
	testswarm({
		url: config.swarmUrl,
		pollInterval: 10000,
		timeout: 1000 * 60 * 30,
		done: this.async()
	}, {
		authUsername: config.authUsername,
		authToken: config.authToken,
		jobName: 'QUnit commit #<a href="https://github.com/jquery/qunit/commit/' + commit + '">' + commit.substr( 0, 10 ) + '</a>',
		runMax: config.runMax,
		"runNames[]": suites,
		"runUrls[]": suites.map(function (suite) {
			return config.testUrl + commit + "/test/" + suite;
		}),
		"browserSets[]": config.browserSets
	});
});

grunt.registerTask('default', 'lint qunit');

};
