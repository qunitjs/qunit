import global from "global";

export const window = global.window;
export const self = global.self;
export const console = global.console;
export const setTimeout = global.setTimeout;
export const clearTimeout = global.clearTimeout;

export const document = window && window.document;
export const navigator = window && window.navigator;

export const localSessionStorage = ( function() {
	var x = "qunit-test-string";
	try {
		global.sessionStorage.setItem( x, x );
		global.sessionStorage.removeItem( x );
		return global.sessionStorage;
	} catch ( e ) {
		return undefined;
	}
}() );

// Support IE 9-10: Fallback for fuzzysort.js used by /reporter/html.js
if ( !global.Map ) {
	global.Map = function StringMap() {
		var store = Object.create( null );
		this.get = function( strKey ) {
			return store[ strKey ];
		};
		this.set = function( strKey, val ) {
			store[ strKey ] = val;
			return this;
		};
		this.clear = function() {
			store = Object.create( null );
		};
	};
}
