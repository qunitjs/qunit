"use strict";

const fs = require( "fs" );
const path = require( "path" );
const fixturify = require( "fixturify" );
const rimraf = require( "rimraf" );

const expectedWatchOutput = require( "./fixtures/expected/watch-tap-outputs" );
const { execute } = require( "./helpers/execute" );

// Executes the provided command from within the fixtures directory
function executeIpc( command, hook ) {
	return execute( command, { stdio: [ null, null, null, "ipc" ] }, hook );
}

const fixturePath = path.join( __dirname, "fixtures", "watching" );

// Kills the provided executing process, handling differences in platforms
function kill( execution, signal ) {
	const sig = signal || "SIGINT";

	process.kill( execution.pid, sig );
}

// TODO: Make watch tests work on Windows. https://github.com/qunitjs/qunit/issues/1359
if ( process.platform === "win32" ) {
	return;
}

QUnit.module( "CLI Watch", function( hooks ) {
	hooks.before( function() {
		rimraf.sync( fixturePath );
	} );

	hooks.beforeEach( function() {
		fs.mkdirSync( path.dirname( fixturePath ), { recursive: true } );
		fixturify.writeSync( fixturePath, {
			"setup.js": "QUnit.on('runEnd', function() { process.send('runEnd'); });"
		} );
	} );

	hooks.afterEach( function() {
		rimraf.sync( fixturePath );
	} );

	QUnit.test( "runs tests and waits until SIGTERM", async assert => {
		fixturify.writeSync( fixturePath, {
			"foo.js": "QUnit.test('foo', function(assert) { assert.true(true); });"
		} );

		const command = [ "qunit", "--watch", "watching" ];
		const result = await executeIpc(
			command,
			execution => {
				execution.on( "message", data => {
					assert.step( data );
					kill( execution, "SIGTERM" );
				} );
			}
		);

		assert.verifySteps( [ "runEnd" ] );
		assert.equal( result.code, 0 );
		assert.equal( result.stderr, "" );
		assert.equal( result.stdout, expectedWatchOutput[ "no-change" ] );
	} );

	QUnit.test( "runs tests and waits until SIGINT", async assert => {
		fixturify.writeSync( fixturePath, {
			"foo.js": "QUnit.test('foo', function(assert) { assert.true(true); });"
		} );

		const command = [ "qunit", "--watch", "watching" ];
		const result = await executeIpc(
			command,
			execution => {
				execution.on( "message", data => {
					assert.step( data );
					kill( execution );
				} );
			}
		);

		assert.verifySteps( [ "runEnd" ] );
		assert.equal( result.code, 0 );
		assert.equal( result.stderr, "" );
		assert.equal( result.stdout, expectedWatchOutput[ "no-change" ] );
	} );

	QUnit.test( "re-runs tests on file changed", async assert => {
		fixturify.writeSync( fixturePath, {
			"foo.js": "QUnit.test('foo', function(assert) { assert.true(true); });"
		} );

		const command = [ "qunit", "--watch", "watching" ];
		const result = await executeIpc(
			command,
			execution => {
				execution.once( "message", data => {
					assert.step( data );
					fixturify.writeSync( fixturePath, {
						"foo.js": "QUnit.test('bar', function(assert) { assert.true(true); });"
					} );

					execution.once( "message", data => {
						assert.step( data );
						kill( execution );
					} );
				} );
			}
		);

		assert.verifySteps( [ "runEnd", "runEnd" ] );
		assert.equal( result.code, 0 );
		assert.equal( result.stderr, "" );
		assert.equal( result.stdout, expectedWatchOutput[ "change-file" ] );
	} );

	QUnit.test( "re-runs tests on file added", async assert => {
		fixturify.writeSync( fixturePath, {
			"foo.js": "QUnit.test('foo', function(assert) { assert.true(true); });"
		} );

		const command = [ "qunit", "--watch", "watching" ];
		const result = await executeIpc(
			command,
			execution => {
				execution.once( "message", data => {
					assert.step( data );
					fixturify.writeSync( fixturePath, {
						"bar.js": "QUnit.test('bar', function(assert) { assert.true(true); });"
					} );

					execution.once( "message", data => {
						assert.step( data );
						kill( execution );
					} );
				} );
			}
		);

		assert.verifySteps( [ "runEnd", "runEnd" ] );
		assert.equal( result.code, 0 );
		assert.equal( result.stderr, "" );
		assert.equal( result.stdout, expectedWatchOutput[ "add-file" ] );
	} );

	QUnit.test( "re-runs tests on file removed", async assert => {
		fixturify.writeSync( fixturePath, {
			"foo.js": "QUnit.test('foo', function(assert) { assert.true(true); });",
			"bar.js": "QUnit.test('bar', function(assert) { assert.true(true); });"
		} );

		const command = [ "qunit", "--watch", "watching" ];
		const result = await executeIpc(
			command,
			execution => {
				execution.once( "message", data => {
					assert.step( data );
					fixturify.writeSync( fixturePath, {
						"bar.js": null
					} );

					execution.once( "message", data => {
						assert.step( data );
						kill( execution );
					} );
				} );
			}
		);

		assert.verifySteps( [ "runEnd", "runEnd" ] );
		assert.equal( result.code, 0 );
		assert.equal( result.stderr, "" );
		assert.equal( result.stdout, expectedWatchOutput[ "remove-file" ] );
	} );

	// Skip in coverage mode since NYC adds non-default extensions
	QUnit[ process.env.NYC_PROCESS_ID ? "skip" : "test" ]( "default file extensions", async assert => {
		fixturify.writeSync( fixturePath, {
			"tests": {
				"setup.js": "QUnit.on('runEnd', function() { process.send('runEnd'); });",
				"foo.js": "QUnit.test('foo', function(assert) { assert.true(true); });"
			}
		} );

		const command = [ "qunit", "--watch", "watching/tests" ];
		const result = await executeIpc(
			command,
			execution => {
				execution.once( "message", () => {
					fixturify.writeSync( fixturePath, {
						"x.cjs": "-",
						"x.js": "-",
						"x.json": "-",
						"x.mjs": "-",
						"x.ts": "-",
						"x.txt": "-",

						"node_modules": {
							"x": {
								"y.js": "-"
							}
						},

						"tests": {
							"foo.js": "QUnit.test('foo2', function(assert) { assert.true(true); });",
							"setup.js": "QUnit.on('runEnd', function() { process.send('runEnd2'); });"
						}
					} );

					execution.once( "message", data => {

						// Ignore other re-runs
						if ( data === "runEnd2" ) {
							kill( execution );
						}
					} );
				} );
			}
		);

		assert.equal( result.code, 0 );
		assert.equal( result.stderr, "" );
		assert.equal( result.stdout, expectedWatchOutput[ "file-extensions" ] );
	} );

	QUnit.test( "aborts and restarts when in middle of run", async assert => {

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
							assert.true(true);
							done();
						}, 500);
					});
					QUnit.test('two', function(assert) { assert.true(true); });`
			},
			"bar.js": "module.exports = 'bar export first';"
		} );

		const command = [ "qunit", "--watch", "watching/tests" ];
		const result = await executeIpc(
			command,
			execution => {
				execution.on( "message", function handle( data ) {
					if ( data === "testRunning" ) {
						fixturify.writeSync( fixturePath, {
							"bar.js": "module.exports = 'bar export second';"
						} );
					}

					assert.step( data );

					if ( data === "runEnd" ) {
						execution.off( "message", handle );
						execution.on( "message", data => {
							assert.step( data );

							if ( data === "runEnd" ) {
								kill( execution );
							}
						} );
					}
				} );
			}
		);

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
	} );

	QUnit.test( "properly watches files after initial run", async assert => {

		fixturify.writeSync( fixturePath, {
			"tests": {
				"setup.js": "QUnit.on('runEnd', function() { process.send('runEnd'); });",
				"foo.js": `
					QUnit.module('Module');
					QUnit.test('Test', function(assert) {
						assert.true(true);
					});`
			}
		} );

		let count = 0;
		const command = [ "qunit", "--watch", "watching/tests" ];
		const result = await executeIpc(
			command,
			execution => {
				execution.on( "message", data => {
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
											assert.true(true);
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
			}
		);

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
	} );
} );
