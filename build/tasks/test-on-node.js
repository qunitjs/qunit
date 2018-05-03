/* eslint-env node */
"use strict";

var async = require( "async" );

module.exports = function( grunt ) {
	grunt.registerMultiTask( "test-on-node", function() {
		var runs = this.data.map( function( file ) {
			return function( runEnd ) {
				runQUnit( file, runEnd );
			};
		} );

		var done = this.async();

		async.series( runs, function( error, stats ) {
			var totals = stats.reduce( function( totals, stats ) {
				totals.passed += stats.passed;
				totals.failed += stats.failed;
				totals.skipped += stats.skipped;
				totals.todo += stats.todo;
				totals.passedAssertions += stats.passedAssertions;
				totals.failedAssertions += stats.failedAssertions;
				totals.runtime += stats.runtime;
				return totals;
			}, {
				passed: 0,
				failed: 0,
				skipped: 0,
				todo: 0,
				runtime: 0,
				passedAssertions: 0,
				failedAssertions: 0
			} );

			grunt.log.writeln( "-----" );
			grunt.log.ok( constructMessage( totals ) );

			// Refresh the QUnit global to be used in other tests
			global.QUnit = requireFresh( "../../dist/qunit" );

			done( !error );
		} );
	} );

	function constructMessage( stats ) {
		var totalTests = stats.passed + stats.failed + stats.skipped + stats.todo,
			totalAssertions = stats.passedAssertions + stats.failedAssertions;

		return [
			totalTests,
			" tests completed with ",
			stats.failed,
			" failed, " +
			stats.skipped,
			" skipped, and ",
			stats.todo,
			" todo. \n" +
			totalAssertions,
			" assertions (in ",
			stats.runtime,
			"ms), passed: " +
			stats.passedAssertions,
			", failed: ",
			stats.failedAssertions
		].join( "" );
	}

	function requireFresh( path ) {
		var resolvedPath = require.resolve( path );
		delete require.cache[ resolvedPath ];
		return require( path );
	}

	function runQUnit( file, runEnd ) {

		// Resolve current QUnit path and remove it from the require cache
		// to avoid stacking the QUnit logs.
		var QUnit = requireFresh( "../../dist/qunit" );

		// Expose QUnit to the global scope to be seen on the other tests.
		global.QUnit = QUnit;

		QUnit.config.autostart = false;

		requireFresh( "../../" + file );

		registerEvents( QUnit, file, runEnd );

		QUnit.start();
	}

	function registerEvents( QUnit, file, runEnd ) {
		var runDone = false;
		var testActive = false;
		var stats = {
			passed: 0,
			failed: 0,
			skipped: 0,
			todo: 0
		};

		QUnit.begin( function() {
			grunt.log.ok( "Testing " + file + " ..." );
		} );

		QUnit.testStart( function() {
			testActive = true;
		} );

		QUnit.log( function( details ) {
			if ( !testActive || details.result || details.todo ) {
				return;
			}
			var message = "name: " + details.name + " module: " + details.module +
				" message: " + details.message;
			grunt.log.error( message );
		} );

		QUnit.testDone( function( details ) {
			testActive = false;

			var testPassed = details.failed > 0 ? details.todo : !details.todo;

			if ( details.skipped ) {
				stats.skipped++;
			} else if ( !testPassed ) {
				stats.failed++;
			} else if ( details.todo ) {
				stats.todo++;
			} else {
				stats.passed++;
			}
		} );

		QUnit.done( function( details ) {
			if ( runDone ) {
				return;
			}

			stats.runtime = details.runtime;
			stats.passedAssertions = details.passed;
			stats.failedAssertions = details.failed;

			var message = constructMessage( stats );

			if ( stats.failed ) {
				grunt.log.error( message );
			} else {
				grunt.log.ok( message );
			}

			runDone = true;
			runEnd( stats.failed, stats );
		} );
	}
};
