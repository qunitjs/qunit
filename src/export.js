/* global module, exports, define */
import { window, document, self } from "./globals";
import global from "global";

export default function exportQUnit( QUnit ) {
	let exportedModule = false;

	if ( window && document ) {

		// QUnit may be defined when it is preconfigured but then only QUnit and QUnit.config may be defined.
		if ( window.QUnit && window.QUnit.version ) {
			throw new Error( "QUnit has already been defined." );
		}

		window.QUnit = QUnit;

		exportedModule = true;
	}

	// For Node.js
	if ( typeof module !== "undefined" && module && module.exports ) {
		module.exports = QUnit;

		// For consistency with CommonJS environments' exports
		module.exports.QUnit = QUnit;

		exportedModule = true;
	}

	// For CommonJS with exports, but without module.exports, like Rhino
	if ( typeof exports !== "undefined" && exports ) {
		exports.QUnit = QUnit;

		exportedModule = true;
	}

	// For AMD
	if ( typeof define === "function" && define.amd ) {
		define( function() {
			return QUnit;
		} );
		QUnit.config.autostart = false;

		exportedModule = true;
	}

	// For Web/Service Workers
	if ( self && self.WorkerGlobalScope && self instanceof self.WorkerGlobalScope ) {
		self.QUnit = QUnit;

		exportedModule = true;
	}

	// For other environments, such as SpiderMonkey (mozjs) and other
	// embedded JavaScript engines
	if ( !exportedModule ) {
		global.QUnit = QUnit;
	}
}
