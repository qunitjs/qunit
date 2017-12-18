import { test } from "../test";

import config from "./config";
import { extend } from "./utilities";

// Handle an unhandled rejection
export default function onUnhandledRejection( reason ) {
	const resultInfo = {
		result: false,
		message: reason.message || "error",
		actual: reason,
		source: reason.stack
	};

	const currentTest = config.current;
	if ( currentTest ) {
		currentTest.assert.pushResult( resultInfo );
	} else {
		test( "global failure", extend( function( assert ) {
			assert.pushResult( resultInfo );
		}, { validTest: true } ) );
	}
}

