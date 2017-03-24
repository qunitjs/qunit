var defaultReporter1Called = false;
function DefaultReporter1() {
	defaultReporter1Called = true;
}

var defaultReporter2Called = false;
function DefaultReporter2() {
	defaultReporter2Called = true;
}

QUnit.setDefaultReporter( DefaultReporter1 );
QUnit.setDefaultReporter( DefaultReporter2 );

var testReporterCalledWith;
function TestReporter( runner ) {
	testReporterCalledWith = runner;
}

var initReporterCalledWith;
function InitReporter() {}
InitReporter.init = function( runner ) {
	initReporterCalledWith = runner;
};

QUnit.addReporter( TestReporter );
QUnit.addReporter( InitReporter );

QUnit.module( "Reporter API", function() {
	QUnit.module( "setDefaultReporter", function() {
		QUnit.test( "only initializes last default reporter", function( assert ) {
			assert.notOk( defaultReporter1Called, "first default reporter not initialized" );
			assert.ok( defaultReporter2Called, "last default reporter initialized" );
		} );

		QUnit.test( "throws an error if the reporter is not a function", function( assert ) {
			assert.throws(
				() => QUnit.setDefaultReporter( "TAP" ),
				// eslint-disable-next-line
				/Expected setDefaultReporter to be called with a constructor function, but was called with a string./
			);
		} );

		QUnit.test( "throws an error if the test run has already started", function( assert ) {
			assert.throws(
				() => QUnit.setDefaultReporter( function Reporter() {} ),
				/Called setDefaultReporter after the test run has started./
			);
		} );
	} );

	QUnit.module( "addReporter", function() {
		QUnit.test( "initializes added reporters", function( assert ) {
			assert.strictEqual(
				testReporterCalledWith,
				QUnit,
				"Called reporter constructor with QUnit"
			);
			assert.strictEqual(
				initReporterCalledWith,
				QUnit,
				"Called reporter init method with QUnit"
			);
		} );

		QUnit.test( "throws an error if the reporter is not a function", function( assert ) {
			assert.throws(
				() => QUnit.addReporter( "TAP" ),
				// eslint-disable-next-line
				/Expected addReporter to be called with a constructor function, but was called with a string./
			);
		} );

		QUnit.test( "throws an error if the test run has already started", function( assert ) {
			assert.throws(
				() => QUnit.addReporter( function Reporter() {} ),
				/Called addReporter after the test run has started./
			);
		} );
	} );
} );
