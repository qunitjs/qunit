/*global config:true, task:true*/
module.exports = function( grunt ) {

grunt.initConfig({
	pkg: '<json:package.json>',
	qunit: {
		// TODO include 'test/logs.html' as well
		files: ['test/index.html']
	},
	lint: {
		qunit: 'qunit/qunit.js',
		grunt: 'grunt.js'
		// TODO need to figure out which warnings to fix and which to disable
		// tests: 'test/*.js'
	},
	jshint: {
		qunit: {
			options: {
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
		tests: {
			tests: {
				globals: {
					module: true,
					test: true,
					ok: true,
					equal: true,
					deepEqual: true,
					QUnit: true
				}
			}
		}
	}
});

// Default task.
grunt.registerTask('default', 'lint qunit');

};
