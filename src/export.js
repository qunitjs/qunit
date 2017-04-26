/* global module, exports, define */
import { defined } from "./core/utilities";
import { window, self } from "./globals";

export default function exportQUnit( QUnit ) {

	if ( defined.document ) {

	// QUnit may be defined when it is preconfigured but then only QUnit and QUnit.config may be defined.
		if ( window.QUnit && window.QUnit.version ) {
			throw new Error( "QUnit has already been defined." );
		}

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

	// For Web/Service Workers
	if ( self && self.WorkerGlobalScope && self instanceof self.WorkerGlobalScope ) {
		self.QUnit = QUnit;
	}
}
