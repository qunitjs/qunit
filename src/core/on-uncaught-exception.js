import config from "./config";
import ProcessingQueue from "./processing-queue";
import { sourceFromStacktrace } from "./stacktrace";
import { extend, errorString } from "./utilities";
import Logger from "../logger";
import { test } from "../test";

/**
 * Handle a global error that should result in a failed test run.
 *
 * Summary:
 *
 * - If there is a current test, it becomes a failed assertion.
 * - If there is a current module, it becomes a failed test (and bypassing filters).
 *   Note that if we're before any other test or module, it will naturally
 *   become a global test.
 * - If the overall test run has ended, the error is printed to `console.warn()`.
 *
 * @since 2.17.0
 * @param {Error|any} error
 */
export default function onUncaughtException( error ) {
	const message = errorString( error );

	// We could let callers specify an extra offset to add to the number passed to
	// sourceFromStacktrace, in case they are a wrapper further away from the error
	// handler, and thus reduce some noise in the stack trace. However, we're not
	// doing this right now because it would almost never be used in practice given
	// the vast majority of error values will be an Error object, and thus have a
	// clean stack trace already.
	const source = error.stack || sourceFromStacktrace( 2 );

	if ( config.current ) {
		config.current.assert.pushResult( {
			result: false,
			message: `global failure: ${message}`,
			source
		} );
	} else if ( !ProcessingQueue.finished ) {
		test( "global failure", extend( function( assert ) {
			assert.pushResult( { result: false, message, source } );
		}, { validTest: true } ) );
	} else {

		// TODO: Once supported in js-reporters and QUnit, use a TAP "bail" event.
		// The CLI runner can use this to ensure a non-zero exit code, even if
		// emitted after "runEnd" and before the process exits.
		// The HTML Reporter can use this to renmder it on the page in a test-like
		// block for easy discovery.
		//
		// Avoid printing "Error: foo" twice if the environment's native stack trace
		// already includes that in its format.
		Logger.warn( source.indexOf( source ) !== -1 ? source : `${message}\n${source}` );
	}
}
