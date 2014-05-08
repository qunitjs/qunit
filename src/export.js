// For browser, export only select globals
if ( typeof window !== "undefined" ) {
	(function() {
		var i, l,
			toExport = {},
			keys = [
				"test",
				"module",
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
			toExport[ keys[ i ] ] = QUnit[ keys[ i ] ];
		}

		extend( window, toExport );
	})();

	window.QUnit = QUnit;
}

// For CommonJS environments, export everything
if ( typeof module !== "undefined" && module.exports ) {
	module.exports = QUnit;
}
