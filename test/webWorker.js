( function( window ) {

	QUnit.module( "Runs a QUnit suite in a Web Worker" );

	var testMethod = window.Worker ? "test" : "skip";

	QUnit[ testMethod ]( "test", function( assert ) {
		assert.expect( 1 );
		var done = assert.async();
		var worker = new Worker( "webWorker-worker.js" );

		worker.onmessage = function( event ) {
			assert.equal( event.data.status, "passed" );
			done();
		};
	} );

}( ( function() {
	return this;
}() ) ) );
