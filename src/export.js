function applyDeprecated( name ) {
	return function() {
		throw new Error(
			"The global `" + name + "` is now removed from QUnit 2.0, you should " +
			"now use the correct namespace. Check out our upgrade guide at " +
			"https://qunitjs.com/upgrade-guide-2.x/"
		);
	};
}

( function() {
	var i,
		assertions = Assert.prototype;

	for ( i in assertions ) {
		QUnit[ i ] = applyDeprecated( assertions[ i ] );
	}
}() );

// For browser, export only select globals
if ( defined.document ) {

	( function() {
		var i, l,
			keys = [
				"test",
				"module",
				"expect",
				"asyncTest",
				"start",
				"stop",
				"ok",
				"notOk",
				"equal",
				"notEqual",
				"propEqual",
				"notPropEqual",
				"deepEqual",
				"notDeepEqual",
				"strictEqual",
				"notStrictEqual",
				"throws",
				"raises"
			];

		for ( i = 0, l = keys.length; i < l; i++ ) {
			window[ keys[ i ] ] = applyDeprecated( keys[ i ] );
		}
	}() );

	window.QUnit = QUnit;
}

// For nodejs
if ( typeof module !== "undefined" && module && module.exports ) {
	module.exports = QUnit;

	// For consistency with CommonJS environments' exports
	module.exports.QUnit = QUnit;
}

// For CommonJS with exports, but without module.exports, like Rhino
if ( typeof exports !== "undefined" && exports ) {
	exports.QUnit = QUnit;
}

if ( typeof define === "function" && define.amd ) {
	define( function() {
		return QUnit;
	} );
	QUnit.config.autostart = false;
}
