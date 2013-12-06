// For browser, export only select globals
// but everything in the QUnit namespace
if ( typeof window !== "undefined" ) {
	extend( window, QUnit.constructor.prototype );
	window.QUnit = QUnit;
}

// For CommonJS environments, export everything
if ( typeof module !== "undefined" && module.exports ) {
	module.exports = QUnit;
}
