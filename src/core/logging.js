import config from "./config";
import { objectType } from "./utilities";
import Promise from "../promise";

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
	var callbacks = config.callbacks[ key ];

	// Handling 'log' callbacks separately. Unlike the other callbacks,
	// the log callback is not controlled by the processing queue,
	// but rather used by asserts. Hence to promisfy the 'log' callback
	// would mean promisfying each step of a test
	if ( key === "log" ) {
		callbacks.map( callback => callback( args ) );
		return;
	}

	// ensure that each callback is executed serially
	return callbacks.reduce( ( promiseChain, callback ) => {
		return promiseChain.then( () => {
			return Promise.resolve( callback( args ) );
		} );
	}, Promise.resolve( [] ) );
}
