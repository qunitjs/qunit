import { window } from "../globals";
import { pushFailure, test } from "../test";

import config from "./config";
import { defined, extend } from "./utilities";

( function() {
	if ( !defined.document ) {
		return;
	}

	// `onErrorFnPrev` initialized at top of scope
	// Preserve other handlers
	var onErrorFnPrev = window.onerror;

	// Cover uncaught exceptions
	// Returning true will suppress the default browser handler,
	// returning false will let it run.
	window.onerror = function( error, filePath, linerNr ) {
		var ret = false;
		if ( onErrorFnPrev ) {
			ret = onErrorFnPrev( error, filePath, linerNr );
		}

		// Treat return value as window.onerror itself does,
		// Only do our handling if not suppressed.
		if ( ret !== true ) {
			if ( config.current ) {
				if ( config.current.ignoreGlobalErrors ) {
					return true;
				}
				pushFailure( error, filePath + ":" + linerNr );
			} else {
				test( "global failure", extend( function() {
					pushFailure( error, filePath + ":" + linerNr );
				}, { validTest: true } ) );
			}
			return false;
		}

		return ret;
	};
} )();
