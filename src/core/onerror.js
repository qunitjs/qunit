import { pushFailure, test } from "../test";

import config from "./config";
import { extend } from "./utilities";

// Handle an unhandled exception. By convention, returns true if further
// error handling should be suppressed and false otherwise.
// In this case, we will only suppress further error handling if the
// "ignoreGlobalErrors" configuration option is enabled.
export default function onError( errorMessage, filePath, lineNumber, ...args ) {
	if ( config.current ) {
		if ( config.current.ignoreGlobalErrors ) {
			return true;
		}
		pushFailure( errorMessage, filePath + ":" + lineNumber, ...args );
	} else {
		test( "global failure", extend( function() {
			pushFailure( errorMessage, filePath + ":" + lineNumber, ...args );
		}, { validTest: true } ) );
	}

	return false;
}
