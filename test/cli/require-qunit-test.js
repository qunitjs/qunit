const proxyquire = require( "proxyquire" ).noCallThru();
const path = require( "path" );
const resolveStub = ( path ) => {
	return path;
};

QUnit.module( "requireQUnit", function( hooks ) {
	const cwd = process.cwd();

	hooks.before( () => {
		process.chdir( cwd );
	} );
	hooks.afterEach( () => {
		process.chdir( cwd );
	} );

	QUnit.test( "finds QUnit in the current working directory", function( assert ) {
		const requireQUnit = require( "../../src/cli/require-qunit" );
		process.chdir( path.join( __dirname, "./fixtures/require-from-cwd" ) );

		assert.propEqual( requireQUnit(), { version: "from-cwd" } );
	} );

	QUnit.test( "finds globally installed QUnit", function( assert ) {
		const globalQUnit = {
			"version": "from-global"
		};
		const requireQUnit = proxyquire( "../../src/cli/require-qunit", {
			"qunit": null,
			"../../dist/qunit": null,
			"../../qunit/qunit": globalQUnit
		} );
		assert.strictEqual( requireQUnit( resolveStub ), globalQUnit );
	} );

	QUnit.test( "finds development mode QUnit", function( assert ) {
		const devQUnit = {
			"version": "from-dist"
		};
		const requireQUnit = proxyquire( "../../src/cli/require-qunit", {
			"qunit": null,
			"../../qunit/qunit": null,
			"../../dist/qunit": devQUnit
		} );

		assert.strictEqual( requireQUnit( resolveStub ), devQUnit );
	} );

	QUnit.test( "throws error if none of the modules are found", function( assert ) {
		const requireQUnit = proxyquire( "../../src/cli/require-qunit", {
			"qunit": null,
			"../../qunit/qunit": null,
			"../../dist/qunit": null
		} );

		assert.throws( requireQUnit, /Cannot find module/ );
	} );
} );

