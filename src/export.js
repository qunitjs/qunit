// Export global variables, unless an 'exports' object exists,
// in that case we assume we're in CommonJS
if ( typeof exports === "undefined" ) {
	extend( window, QUnit.constructor.prototype );

	// Expose QUnit object
	window.QUnit = QUnit;
} else {
	// for CommonJS environments, export everything
	extend( exports, QUnit.constructor.prototype );
}
