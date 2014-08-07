// For browser, export only select globals
if ( typeof window !== "undefined" ||
	(
		typeof exports === "object" && exports && !exports.nodeType &&
		typeof module === "object" && module && module.exports !== exports
	) ) {

	// Deprecated
	// Extend assert methods to QUnit and Global scope through Backwards compatibility
	(function() {
		var i,
			assertions = Assert.prototype;

		function applyCurrent( current ) {
			return function() {
				var assert = new Assert( QUnit.config.current );
				current.apply( assert, arguments );
			};
		}

		for ( i in assertions ) {
			QUnit[ i ] = applyCurrent( assertions[ i ] );
		}
	})();

	(function( exports ) {
		var i, l,
			keys = [
				"test",
				"expect",
				"asyncTest",
				"start",
				"stop",
				"ok",
				"equal",
				"notEqual",
				"propEqual",
				"notPropEqual",
				"deepEqual",
				"notDeepEqual",
				"strictEqual",
				"notStrictEqual",
				"throws"
			];

		for ( i = 0, l = keys.length; i < l; i++ ) {
			exports[ keys[ i ] ] = QUnit[ keys[ i ] ];
		}

		if ( exports === window ) {
			exports.module = QUnit.module;
		}

		exports.QUnit = QUnit;
	})( typeof exports === "object" ? exports : window );

// For Node.js, export everything
} else if ( typeof window === "undefined" ) {
	module.exports = QUnit;
	QUnit.QUnit = QUnit;
}
