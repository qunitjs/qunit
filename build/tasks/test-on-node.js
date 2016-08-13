/*jshint node:true */
"use strict";

var async = require( "async" );
var path = require( "path" );

module.exports = function( grunt ) {
	grunt.registerMultiTask( "test-on-node", function() {
		var runs = this.data.map( function( file ) {
			return function( runEnd ) {
				runQUnit( file, runEnd );
			};
		} );

		var done = this.async();

		async.series( runs, function( error, result ) {
			var total = result.reduce( function( previous, details ) {
					return previous + details.total;
				}, 0 );
			var failed = result.reduce( function( previous, details ) {
					return previous + details.failed;
				}, 0 );
			var runtime = result.reduce( function( previous, details ) {
					return previous + details.runtime;
				}, 0 );

			grunt.log.writeln( "-----" );
			grunt.log.ok( total + " total assertions (in " + runtime + "ms) , " +
				"with "  + failed + " failed assertions" );

			done( !error );
		} );
	} );

	function runQUnit( file, runEnd ) {

		// Resolve current QUnit path and remove it from the require cache
		// to avoid stacking the QUnit logs.
		var QUnitFile = path.resolve( __dirname, "../../dist/qunit.js" );
		delete require.cache[ QUnitFile ];

		var QUnit = require( QUnitFile );

		// Expose QUnit to the global scope to be seen on the other tests.
		global.QUnit = QUnit;

		registerEvents( QUnit, file, runEnd );

		QUnit.config.autostart = false;

		require( "../../" + file );

		QUnit.load();
		QUnit.start();
	}

	function registerEvents( QUnit, file, runEnd ) {
		var runDone = false;
		var testActive = false;

		QUnit.begin( function() {
			grunt.log.ok( "Testing " + file + " ..." );
		} );
		QUnit.testStart( function() {
			testActive = true;
		} );
		QUnit.log( function( details ) {
			if ( !testActive || details.result ) {
				return;
			}
			var message = "name: " + details.name + " module: " + details.module +
				" message: " + details.message;
			grunt.log.error( message );
		} );
		QUnit.testDone( function() {
			testActive = false;
		} );
		QUnit.done( function( details ) {
			if ( runDone ) {
				return;
			}
			var message = details.total + " assertions (in " + details.runtime + "ms), passed: " +
					details.passed + ", failed: " + details.failed;

			if ( details.failed ) {
				grunt.log.error( message );
			} else {
				grunt.log.ok( message );
			}

			runDone = true;
			runEnd( details.failed, details );
		} );
	}
};
