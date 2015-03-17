function pauseProcessing() {
	config.blocking = true;

	if ( config.testTimeout && defined.setTimeout ) {
		clearTimeout( config.timeout );
		config.timeout = setTimeout(function() {
			if ( config.current ) {
				config.current.semaphore = 0;
				QUnit.pushFailure( "Test timed out", sourceFromStacktrace( 2 ) );
			} else {
				throw new Error( "Test timed out" );
			}
			resumeProcessing();
		}, config.testTimeout );
	}
}