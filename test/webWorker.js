QUnit.module( "Web Worker" );

var testMethod = window.Worker ? "test" : "skip";

QUnit[ testMethod ]( "main tests", function( assert ) {
	assert.expect( 1 );
	var done = assert.async();
	var worker = new Worker( "webWorker-worker.js" );

	worker.onmessage = function( event ) {
		assert.equal( event.data.status, "passed", "runEnd.status" );
		done();
	};
} );
