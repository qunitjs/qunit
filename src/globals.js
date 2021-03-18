import globalThis from "../lib/global-this-polyfill";

export const window = globalThis.window;
export const self = globalThis.self;
export const console = globalThis.console;
export const setTimeout = globalThis.setTimeout;
export const clearTimeout = globalThis.clearTimeout;

export const document = window && window.document;
export const navigator = window && window.navigator;

export const localSessionStorage = ( function() {
	const x = "qunit-test-string";
	try {
		globalThis.sessionStorage.setItem( x, x );
		globalThis.sessionStorage.removeItem( x );
		return globalThis.sessionStorage;
	} catch ( e ) {
		return undefined;
	}
}() );
