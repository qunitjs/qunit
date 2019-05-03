import config from "./config";
import { objectType } from "./utilities";
import Promise from "../promise";
import {
	setTimeout
} from "../globals";

function _promisfyCallbacksSequentially( callbacks, args ) {
	return callbacks.reduce( ( promiseChain, callback ) => {
		const executeCallback = () => callback( args );
		return promiseChain.then(
			executeCallback,
			( err ) => {
				setTimeout( executeCallback );
				throw err;
			}
		);
	}, Promise.resolve( [] ) );
}

function _registerLoggingCallback( key ) {
	const loggingCallback = ( callback ) => {
		if ( objectType( callback ) !== "function" ) {
			throw new Error(
				"QUnit logging methods require a callback function as their first parameters."
			);
		}

		config.callbacks[ key ].push( callback );
	};

	return loggingCallback;
}

export function registerLoggingCallbacks( obj ) {
	var i, l, key,
		callbackNames = [ "begin", "done", "log", "testStart", "testDone",
			"moduleStart", "moduleDone" ];

	for ( i = 0, l = callbackNames.length; i < l; i++ ) {
		key = callbackNames[ i ];

		// Initialize key collection of logging callback
		if ( objectType( config.callbacks[ key ] ) === "undefined" ) {
			config.callbacks[ key ] = [];
		}

		obj[ key ] = _registerLoggingCallback( key );
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

	return _promisfyCallbacksSequentially( callbacks, args );
}
