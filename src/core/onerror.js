import { pushFailure, test } from "../test";

import config from "./config";
import { extend } from "./utilities";

// Handle an unhandled exception. By convention, returns true if further
// error handling should be suppressed and false otherwise.
// In this case, we will only suppress further error handling if the
// "ignoreGlobalErrors" configuration option is enabled.
export default function onError( error, ...args ) {
	if ( config.current ) {
		if ( config.current.ignoreGlobalErrors ) {
			return true;
		}
		pushFailure( error.message, error.fileName + ":" + error.lineNumber, ...args );
	} else {
		test( "global failure", extend( function() {
			pushFailure( error.message, error.fileName + ":" + error.lineNumber, ...args );
		}, { validTest: true } ) );
	}

	return false;
}
