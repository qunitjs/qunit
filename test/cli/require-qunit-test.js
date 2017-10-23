const proxyquire = require( "proxyquire" );
const resolveStub = {
	sync( path ) {
		return path;
	}
};

QUnit.module( "requireQUnit", function() {
	QUnit.test( "finds QUnit in the current working directory", function( assert ) {
		const localQUnit = {
			"@noCallThru": true
		};
		const requireQUnit = proxyquire( "../../bin/require-qunit", {
			"resolve": resolveStub,
			"qunit": localQUnit
		} );

		assert.strictEqual( requireQUnit(), localQUnit );
	} );

	QUnit.test( "finds globally installled QUnit", function( assert ) {
		const globalQUnit = {
			"@noCallThru": true
		};
		const requireQUnit = proxyquire( "../../bin/require-qunit", {
			"resolve": resolveStub,
			"qunit": null,
			"../qunit/qunit": globalQUnit
		} );

		assert.strictEqual( requireQUnit(), globalQUnit );
	} );

	QUnit.test( "finds development mode QUnit", function( assert ) {
		const devQUnit = {
			"@noCallThru": true
		};
		const requireQUnit = proxyquire( "../../bin/require-qunit", {
			"resolve": resolveStub,
			"qunit": null,
			"../qunit/qunit": null,
			"../dist/qunit": devQUnit
		} );

		assert.strictEqual( requireQUnit(), devQUnit );
	} );

	QUnit.test( "throws error if none of the modules are found", function( assert ) {
		const requireQUnit = proxyquire( "../../bin/require-qunit", {
			"resolve": resolveStub,
			"qunit": null,
			"../qunit/qunit": null,
			"../dist/qunit": null
		} );

		assert.throws( requireQUnit, /Cannot find module/ );
	} );
} );

