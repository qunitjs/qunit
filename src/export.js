// For browser, export only select globals
if ( typeof window !== "undefined" ) {
	(function() {
		var i, l,
			keys = [
				"test",
				"module",
				"asyncTest",
				"start",
				"stop"
			];

		for ( i = 0, l = keys.length; i < l; i++ ) {
			window[ keys[ i ] ] = QUnit[ keys[ i ] ];
		}
	})();

	window.QUnit = QUnit;
}

// For CommonJS environments, export everything
if ( typeof module !== "undefined" && module.exports ) {
	module.exports = QUnit;
}
