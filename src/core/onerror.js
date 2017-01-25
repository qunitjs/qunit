import { window } from "../globals";
import { pushFailure, test } from "../test";

import config from "./config";
import { defined, extend } from "./utilities";

( function() {

	// TODO: (KTP) Remove HTML Reporter-specific logic
	if ( !defined.document ) {
		return;
	}

	// `onErrorFnPrev` initialized at top of scope
	// Preserve other handlers
	var onErrorFnPrev = window.onerror;

	// Cover uncaught exceptions
	// Returning true will suppress the default browser handler,
	// returning false will let it run.
	window.onerror = function( error, filePath, lineNumber ) {
		var ret = false;
		if ( onErrorFnPrev ) {
			ret = onErrorFnPrev( error, filePath, lineNumber );
		}

		// Treat return value as window.onerror itself does,
		// Only do our handling if not suppressed.
		if ( ret !== true ) {
			onError( error, filePath, lineNumber );
		}

		return ret;
	};
} )();

// Handle an unhandled exception. By convention, returns true if further
// error handling should be suppressed and false otherwise.
// In this case, we will only suppress further error handling if the
// "ignoreGlobalErrors" configuration option is enabled.
export default function onError( errorMessage, filePath, lineNumber ) {
	if ( config.current ) {
		if ( config.current.ignoreGlobalErrors ) {
			return true;
		}
		pushFailure( errorMessage, filePath + ":" + lineNumber );
	} else {
		test( "global failure", extend( function() {
			pushFailure( errorMessage, filePath + ":" + lineNumber );
		}, { validTest: true } ) );
	}

	return false;
}
