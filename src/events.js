import { objectType, inArray } from "./core/utilities";

const LISTENERS = Object.create( null );
const SUPPORTED_EVENTS = [
	"runStart",
	"suiteStart",
	"testStart",
	"assertion",
	"testEnd",
	"suiteEnd",
	"runEnd"
];

/**
 * Emits an event with the specified data to all currently registered listeners.
 * Callbacks will fire in the order in which they are registered (FIFO). This
 * function is not exposed publicly; it is used by QUnit internals to emit
 * logging events.
 *
 * @private
 * @method emit
 * @param {String} eventName
 * @param {Object} data
 * @return {Void}
 */
export function emit( eventName, data ) {
	if ( objectType( eventName ) !== "string" ) {
		throw new TypeError( "eventName must be a string when emitting an event" );
	}

	// Clone the callbacks in case one of them registers a new callback
	const originalCallbacks = LISTENERS[ eventName ];
	const callbacks = originalCallbacks ? [ ...originalCallbacks ] : [];

	for ( let i = 0; i < callbacks.length; i++ ) {
		callbacks[ i ]( data );
	}
}

/**
 * Registers a callback as a listener to the specified event.
 *
 * @public
 * @method on
 * @param {String} eventName
 * @param {Function} callback
 * @return {Void}
 */
export function on( eventName, callback ) {
	if ( objectType( eventName ) !== "string" ) {
		throw new TypeError( "eventName must be a string when registering a listener" );
	} else if ( !inArray( eventName, SUPPORTED_EVENTS ) ) {
		const events = SUPPORTED_EVENTS.join( ", " );
		throw new Error( `"${eventName}" is not a valid event; must be one of: ${events}.` );
	} else if ( objectType( callback ) !== "function" ) {
		throw new TypeError( "callback must be a function when registering a listener" );
	}

	if ( !LISTENERS[ eventName ] ) {
		LISTENERS[ eventName ] = [];
	}

	// Don't register the same callback more than once
	if ( !inArray( callback, LISTENERS[ eventName ] ) ) {
		LISTENERS[ eventName ].push( callback );
	}
}
