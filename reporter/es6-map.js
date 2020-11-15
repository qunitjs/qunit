// Support IE 9-10, PhantomJS: Fallback for fuzzysort.js used by /reporter/html.js
// eslint-disable-next-line no-unused-vars
var Map = typeof Map === "function" ? Map : function StringMap() {
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
