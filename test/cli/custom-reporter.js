const co = require( "co" );
const JSReporters = require( "js-reporters" );
const NPMReporter = require( "npm-reporter" );

const findReporter = require( "../../bin/find-reporter" ).findReporter;

const expectedOutput = require( "./fixtures/expected/tap-outputs" );
const execute = require( "./helpers/execute" );

QUnit.module( "find-reporter", function() {
	QUnit.test( "correctly finds js-reporters reporter by name", function( assert ) {
		const reporter = findReporter( "tap" );
		assert.strictEqual( reporter, JSReporters.TapReporter );
	} );

	QUnit.test( "correctly finds npm package reporter by name", function( assert ) {
		const reporter = findReporter( "npm-reporter" );
		assert.strictEqual( reporter, NPMReporter );
	} );
} );

QUnit.module( "CLI Reporter", function() {
	QUnit.test( "runs tests using the specified reporter", co.wrap( function* ( assert ) {
		const command = "qunit --reporter npm-reporter";
		const execution = yield execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} ) );

	QUnit.test( "exits early and lists available reporters if reporter is not found", co.wrap( function* ( assert ) {
		const command = "qunit --reporter does-not-exist";

		try {
			yield execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, expectedOutput[ command ] );
			assert.equal( e.stdout, "" );
		}
	} ) );

	QUnit.test( "exits early and lists available reporters if reporter option is used with no value", co.wrap( function* ( assert ) {
		const command = "qunit --reporter";

		try {
			yield execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, expectedOutput[ command ] );
			assert.equal( e.stdout, "" );
		}
	} ) );
} );
