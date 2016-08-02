var listeners = {};
var loggingCallbacks = {};

// DEPRECATED: Register old logging callbacks
// This will be removed on QUnit 2.0.0+
// From now on use the QUnit.on( eventType, callback ) format
function registerLoggingCallbacks( QUnit ) {
	var i, l, key;
	var callbackNames = [ "begin", "done", "log", "testStart", "testDone",
			"moduleStart", "moduleDone" ];
	var dictionary = {
			"begin": "runStart",
			"done": "runEnd",
			"log": "assert",
			"testStart": "testStart",
			"testDone": "testEnd",
			"moduleStart": "suiteStart",
			"moduleDone": "suiteEnd"
		};

	function registerLoggingCallback( key ) {
		var loggingCallback = function( callback ) {
			return QUnit.on( dictionary[ key ], callback );
		};

		// Stores the registered functions allowing restoring
		// at verifyLoggingCallbacks() if modified
		loggingCallbacks[ key ] = loggingCallback;

		return loggingCallback;
	}

	for ( i = 0, l = callbackNames.length; i < l; i++ ) {
		key = callbackNames[ i ];

		QUnit[ key ] = registerLoggingCallback( key );
	}
}

// DEPRECATED: This will be removed on 2.0.0+
// This function verifies if the loggingCallbacks were modified by the user
// If so, it will restore it, assign the given callback and print a console warning
//
// Comment it out for testing passing (it is not used anywhere).
/* function verifyLoggingCallbacks() {
	var loggingCallback, userCallback;

	for ( loggingCallback in loggingCallbacks ) {
		if ( QUnit[ loggingCallback ] !== loggingCallbacks[ loggingCallback ] ) {

			userCallback = QUnit[ loggingCallback ];

			// Restore the callback function
			QUnit[ loggingCallback ] = loggingCallbacks[ loggingCallback ];

			// Assign the deprecated given callback
			QUnit[ loggingCallback ]( userCallback );

			if ( global.console && global.console.warn ) {
				global.console.warn(
					"QUnit." + loggingCallback + " was replaced with a new value.\n" +
					"Please, check out the documentation on how to apply logging callbacks.\n" +
					"Reference: https://api.qunitjs.com/category/callbacks/"
				);
			}
		}
	}
} */

function emit( type, data ) {
	var i, callbacks;

	// Validate
	if ( QUnit.objectType( type ) !== "string" ) {
		throw new Error( "Emitting QUnit events requires an event type" );
	}

	// Ensure a consistent event run
	callbacks = [].slice.call( listeners[ type ] || [] );
	for ( i = 0; i < callbacks.length; i++ ) {
		callbacks[ i ]( data );
	}
}

QUnit.on = function( type, listener ) {

	// Validate
	if ( QUnit.objectType( type ) !== "string" ) {
		throw new Error( "Adding QUnit events requires an event type" );
	}

	if ( QUnit.objectType( listener ) !== "function" ) {
		throw new Error( "Adding QUnit events requires a listener function" );
	}

	// Initialize collection of this logging callback
	if ( !listeners[ type ] ) {
		listeners[ type ] = [];
	}

	// Filter out duplicate listeners
	if ( inArray( listener, listeners[ type ] ) < 0 ) {
		listeners[ type ].push( listener );
	}
};
