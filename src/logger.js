import { console } from "./globals";

/**
 * Returns a function that proxies to the given method name on the globals
 * console object. The proxy will also detect if the console doesn't exist and
 * will appropriately no-op. This allows support for IE9, which doesn't have a
 * console if the developer tools are not open.
 */
function consoleProxy( method ) {
	return function( ...args ) {
		if ( console ) {
			console[ method ]( ...args );
		}
	};
}

export default {
	warn: consoleProxy( "warn" )
};
