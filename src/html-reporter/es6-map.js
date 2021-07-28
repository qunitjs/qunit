// Support IE 9-10, Safari 7, PhantomJS: Partial Map fallback.
// Used by html.js (via fuzzysort.js), and test.js.
//
// FIXME: This check is broken. This file is embedded in the qunit.js closure,
// thus the Map var is hoisted in that scope, and starts undefined (not a function).
var Map = typeof Map === "function" ? Map : function StringMap() {
	var store = Object.create( null );
	var hasOwn = Object.prototype.hasOwnProperty;
	this.get = function( strKey ) {
		return store[ strKey ];
	};
	this.set = function( strKey, val ) {
		if ( !hasOwn.call( store, strKey ) ) {
			this.size++;
		}
		store[ strKey ] = val;
		return this;
	};
	this.delete = function( strKey ) {
		if ( hasOwn.call( store, strKey ) ) {
			delete store[ strKey ];
			this.size--;
		}
	};
	this.forEach = function( callback ) {
		for ( var strKey in store ) {
			callback( store[ strKey ], strKey );
		}
	};
	this.clear = function() {
		store = Object.create( null );
		this.size = 0;
	};
	this.size = 0;
};
