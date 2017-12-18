// Detect if the current browser supports `onunhandledrejection` (avoiding
// errors for browsers without the capability)
const HAS_UNHANDLED_REJECTION_HANDLER = "onunhandledrejection" in window;

QUnit.module( "Unhandled Rejections", function( hooks ) {
	var originalQUnitOnError;

	hooks.beforeEach( function() {
		originalQUnitOnError = QUnit.onError;
	} );

	hooks.afterEach( function() {
		QUnit.onError = originalQUnitOnError;
	} );

	if ( HAS_UNHANDLED_REJECTION_HANDLER ) {
		QUnit.test( "test passes just fine, but has a rejected promise", function( assert ) {

			QUnit.onError = function() {
				assert.ok( true, "QUnit.onError was called" );
			};

			const done = assert.async();

			new Promise( function( resolve ) {
				setTimeout( resolve );
			} )
				.then( function() {
					throw new Error( "Error thrown in non-returned promise!" );
				} );

			// prevent test from exiting before unhandled rejection fires
			setTimeout( done, 10 );
		} );
	}
} );
