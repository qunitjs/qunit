/*global config:true, task:true*/
module.exports = function( grunt ) {

grunt.initConfig({
	pkg: '<json:package.json>',
	qunit: {
		// TODO include 'test/logs.html' as well
		qunit: 'test/index.html',
		addons: [
			'addons/canvas/canvas.html',
			'addons/close-enough/close-enough.html',
			'addons/composite/composite-demo-test.html'
		]
	},
	lint: {
		qunit: 'qunit/qunit.js',
		addons: 'addons/**/*.js',
		grunt: 'grunt.js'
		// TODO need to figure out which warnings to fix and which to disable
		// tests: 'test/test.js'
	},
	jshint: {
		qunit: {
			options: {
				onevar: true,
				browser: true,
				bitwise: true,
				curly: true,
				trailing: true,
				immed: true,
				latedef: false,
				newcap: true,
				noarg: false,
				noempty: true,
				nonew: true,
				sub: true,
				undef: true,
				eqnull: true,
				proto: true
			},
			globals: {
				jQuery: true,
				exports: true
			}
		},
		addons: {
			// meh
			options: {
				onevar: true,
				smarttabs: true
			}
		},
		tests: {
		}
	}
});

// Default task.
grunt.registerTask('default', 'lint qunit');

};
