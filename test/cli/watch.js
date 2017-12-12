"use strict";

const fs = require( "fs-extra" );
const path = require( "path" );
const exec = require( "execa" ).shell;
const co = require( "co" );
const fixturify = require( "fixturify" );

const expectedWatchOutput = require( "./fixtures/expected/watch-tap-outputs" );

// Executes the provided command from within the fixtures directory
function execute( command ) {
	const cwd = process.cwd();
	process.chdir( path.join( __dirname, "fixtures" ) );

	const execution = exec( command, { stdio: [ null, null, null, "ipc" ] } );

	process.chdir( cwd );

	return execution;
}

const fixturePath = path.join( __dirname, "fixtures", "watching" );

// Kills the provided executing process, handling differences in platforms
function kill( execution, signal ) {
	const sig = signal || "SIGINT";

	// Linux increments the pid by 1 due to creating a new shell instance
	if ( process.platform === "linux" ) {
		process.kill( execution.pid + 1, sig );
	} else {
		process.kill( execution.pid, sig );
	}
}

QUnit.module( "CLI Watch", function( hooks ) {
	hooks.beforeEach( function() {
		fs.ensureDirSync( fixturePath );
		fixturify.writeSync( fixturePath, {
			"setup.js": "QUnit.on('runEnd', function() { process.send('runEnd'); });"
		} );
	} );

	hooks.afterEach( function() {
		fs.removeSync( fixturePath );
	} );

	QUnit.test( "runs tests and waits until SIGTERM", co.wrap( function* ( assert ) {
		fixturify.writeSync( fixturePath, {
			"foo.js": "QUnit.test('foo', function(assert) { assert.ok(true); });"
		} );

		const command = "qunit watching";
		const execution = execute( `${command} --watch` );

		execution.on( "message", function( data ) {
			assert.step( data );
			kill( execution, "SIGTERM" );
		} );

		const result = yield execution;

		assert.verifySteps( [ "runEnd" ] );
		assert.equal( result.code, 0 );
		assert.equal( result.stderr, "" );
		assert.equal( result.stdout, expectedWatchOutput[ "no-change" ] );
	} ) );

	QUnit.test( "runs tests and waits until SIGINT", co.wrap( function* ( assert ) {
		fixturify.writeSync( fixturePath, {
			"foo.js": "QUnit.test('foo', function(assert) { assert.ok(true); });"
		} );

		const command = "qunit watching";
		const execution = execute( `${command} --watch` );

		execution.on( "message", function( data ) {
			assert.step( data );
			kill( execution );
		} );

		const result = yield execution;

		assert.verifySteps( [ "runEnd" ] );
		assert.equal( result.code, 0 );
		assert.equal( result.stderr, "" );
		assert.equal( result.stdout, expectedWatchOutput[ "no-change" ] );
	} ) );

	QUnit.test( "re-runs tests on file changed", co.wrap( function* ( assert ) {
		fixturify.writeSync( fixturePath, {
			"foo.js": "QUnit.test('foo', function(assert) { assert.ok(true); });"
		} );

		const command = "qunit watching";
		const execution = execute( `${command} --watch` );

		execution.once( "message", function( data ) {
			assert.step( data );
			fixturify.writeSync( fixturePath, {
				"foo.js": "QUnit.test('bar', function(assert) { assert.ok(true); });"
			} );

			execution.once( "message", function( data ) {
				assert.step( data );
				kill( execution );
			} );
		} );

		const result = yield execution;

		assert.verifySteps( [ "runEnd", "runEnd" ] );
		assert.equal( result.code, 0 );
		assert.equal( result.stderr, "" );
		assert.equal( result.stdout, expectedWatchOutput[ "change-file" ] );
	} ) );

	QUnit.test( "re-runs tests on file added", co.wrap( function* ( assert ) {
		fixturify.writeSync( fixturePath, {
			"foo.js": "QUnit.test('foo', function(assert) { assert.ok(true); });"
		} );

		const command = "qunit watching";
		const execution = execute( `${command} --watch` );

		execution.once( "message", function( data ) {
			assert.step( data );
			fixturify.writeSync( fixturePath, {
				"bar.js": "QUnit.test('bar', function(assert) { assert.ok(true); });"
			} );

			execution.once( "message", function( data ) {
				assert.step( data );
				kill( execution );
			} );
		} );

		const result = yield execution;

		assert.verifySteps( [ "runEnd", "runEnd" ] );
		assert.equal( result.code, 0 );
		assert.equal( result.stderr, "" );
		assert.equal( result.stdout, expectedWatchOutput[ "add-file" ] );
	} ) );

	QUnit.test( "re-runs tests on file removed", co.wrap( function* ( assert ) {
		fixturify.writeSync( fixturePath, {
			"foo.js": "QUnit.test('foo', function(assert) { assert.ok(true); });",
			"bar.js": "QUnit.test('bar', function(assert) { assert.ok(true); });"
		} );

		const command = "qunit watching";
		const execution = execute( `${command} --watch` );

		execution.once( "message", function( data ) {
			assert.step( data );
			fixturify.writeSync( fixturePath, {
				"bar.js": null
			} );

			execution.once( "message", function( data ) {
				assert.step( data );
				kill( execution );
			} );
		} );

		const result = yield execution;

		assert.verifySteps( [ "runEnd", "runEnd" ] );
		assert.equal( result.code, 0 );
		assert.equal( result.stderr, "" );
		assert.equal( result.stdout, expectedWatchOutput[ "remove-file" ] );
	} ) );

	QUnit.test( "aborts and restarts when in middle of run", co.wrap( function* ( assert ) {

		// A proper abort finishes the currently running test and runs any remaining
		// afterEach/after hooks to ensure cleanup happens.

		fixturify.writeSync( fixturePath, {
			"tests": {
				"setup.js": "QUnit.on('runEnd', function() { process.send('runEnd'); });",
				"foo.js": `
					process.send(require('../bar'));
					QUnit.module('Foo', {
						before() { process.send('before'); },
						beforeEach() { process.send('beforeEach'); },
						afterEach() { process.send('afterEach'); },
						after() { process.send('after'); }
					});
					QUnit.test('one', function(assert) {
						process.send('testRunning');
						var done = assert.async();
						setTimeout(function() {
							assert.ok(true);
							done();
						}, 500);
					});
					QUnit.test('two', function(assert) { assert.ok(true); });`
			},
			"bar.js": "module.exports = 'bar export first';"
		} );

		const command = "qunit watching/tests";
		const execution = execute( `${command} --watch` );

		function one( data ) {
			if ( data === "testRunning" ) {
				fixturify.writeSync( fixturePath, {
					"bar.js": "module.exports = 'bar export second';"
				} );
			}

			assert.step( data );

			if ( data === "runEnd" ) {
				execution.removeListener( "message", one );
				execution.addListener( "message", function( data ) {
					assert.step( data );

					if ( data === "runEnd" ) {
						kill( execution );
					}
				} );
			}
		}

		execution.addListener( "message", one );

		const result = yield execution;

		assert.verifySteps( [
			"bar export first",
			"before",
			"beforeEach",
			"testRunning",
			"afterEach",
			"after",
			"runEnd",
			"bar export second",
			"before",
			"beforeEach",
			"testRunning",
			"afterEach",
			"beforeEach",
			"afterEach",
			"after",
			"runEnd"
		] );
		assert.equal( result.code, 0 );
		assert.equal( result.stderr, "" );
		assert.equal( result.stdout, expectedWatchOutput[ "change-file-mid-run" ] );
	} ) );

	QUnit.test( "properly watches files after initial run", co.wrap( function* ( assert ) {

		fixturify.writeSync( fixturePath, {
			"tests": {
				"setup.js": "QUnit.on('runEnd', function() { process.send('runEnd'); });",
				"foo.js": `
					QUnit.module('Module');
					QUnit.test('Test', function(assert) {
						assert.ok(true);
					});`
			}
		} );

		const command = "qunit watching/tests";
		const execution = execute( `${command} --watch` );
		let count = 0;

		execution.addListener( "message", function( data ) {
			assert.step( data );

			if ( data === "runEnd" ) {
				count++;

				if ( count === 1 ) {
					fixturify.writeSync( fixturePath, {
						"tests": {
							"foo.js": `
								process.send(require('../bar.js'));
								QUnit.module('Module');
								QUnit.test('Test', function(assert) {
									assert.ok(true);
								});`
						},
						"bar.js": "module.exports = 'bar export first';"
					} );
				}

				if ( count === 2 ) {
					fixturify.writeSync( fixturePath, {
						"bar.js": "module.exports = 'bar export second';"
					} );
				}

				if ( count === 3 ) {
					kill( execution );
				}
			}
		} );

		const result = yield execution;

		assert.verifySteps( [
			"runEnd",
			"bar export first",
			"runEnd",
			"bar export second",
			"runEnd"
		] );
		assert.equal( result.code, 0 );
		assert.equal( result.stderr, "" );
		assert.equal( result.stdout, expectedWatchOutput[ "add-file-after-run" ] );
	} ) );
} );
