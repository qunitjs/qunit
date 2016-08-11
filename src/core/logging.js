import config from "./config";
import { objectType, inArray } from "./utilities";

const dictionary = {
	"begin": "runStart",
	"moduleStart": "suiteStart",
	"testStart": "testStart",
	"log": "assert",
	"testDone": "testEnd",
	"moduleDone": "suiteEnd",
	"done": "runEnd"
};

var listeners = {};

// Register logging callbacks
export function registerLoggingCallbacks( obj ) {
	var i, l, key,
		callbackNames = [ "begin", "done", "log", "testStart", "testDone",
			"moduleStart", "moduleDone" ];

	function registerLoggingCallback( key ) {
		var loggingCallback = function( callback ) {
			if ( objectType( callback ) !== "function" ) {
				throw new Error(
					"QUnit logging methods require a callback function as their first parameters."
				);
			}

			config.callbacks[ key ].push( callback );
		};

		return loggingCallback;
	}

	for ( i = 0, l = callbackNames.length; i < l; i++ ) {
		key = callbackNames[ i ];

		// Initialize key collection of logging callback
		if ( objectType( config.callbacks[ key ] ) === "undefined" ) {
			config.callbacks[ key ] = [];
		}

		obj[ key ] = registerLoggingCallback( key );
	}
}

export function runLoggingCallbacks( key, args ) {
	var i, l, callbacks;

  // Emit the new events
	emit( dictionary[ key ], args );

	callbacks = config.callbacks[ key ];
	for ( i = 0, l = callbacks.length; i < l; i++ ) {
		callbacks[ i ]( args );
	}
}

function emit( type, data ) {
	var i, callbacks;

	// Validate
	if ( objectType( type ) !== "string" ) {
		throw new Error( "Emitting QUnit events requires an event type" );
	}

	// Ensure a consistent event run
	callbacks = [].slice.call( listeners[ type ] || [] );
	for ( i = 0; i < callbacks.length; i++ ) {
		callbacks[ i ]( data );
	}
}

export function on( type, listener ) {

	// Validate
	if ( objectType( type ) !== "string" ) {
		throw new Error( "Adding QUnit events requires an event type" );
	}

	if ( objectType( listener ) !== "function" ) {
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
}
