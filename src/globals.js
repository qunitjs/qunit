import global from "global";

export const window = global.window;
export const console = global.console;
export const setTimeout = global.setTimeout;
export const clearTimeout = global.clearTimeout;

export const document = window && window.document;
export const navigator = window && window.navigator;

export const localSessionStorage = ( function() {
	var x = "qunit-test-string";
	try {
		sessionStorage.setItem( x, x );
		sessionStorage.removeItem( x );
		return sessionStorage;
	} catch ( e ) {
		return undefined;
	}
}() );
