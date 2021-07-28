import Logger from "../logger";
import config from "./config";
import onUncaughtException from "./on-uncaught-exception";

/**
 * Handle a window.onerror error.
 *
 * If there is a current test that sets the internal `ignoreGlobalErrors` field
 * (such as during `assert.throws()`), then the error is ignored and native
 * error reporting is suppressed as well. This is because in browsers, an error
 * can sometimes end up in `window.onerror` instead of in the local try/catch.
 * This ignoring of errors does not apply to our general onUncaughtException
 * method, nor to our `unhandledRejection` handlers, as those are not meant
 * to receive an "expected" error during `assert.throws()`.
 *
 * @see <https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror>
 * @deprecated since 2.17.0 Use QUnit.onUncaughtException instead.
 * @param {Object} details
 * @param {string} details.message
 * @param {string} details.fileName
 * @param {number} details.lineNumber
 * @param {string|undefined} [details.stacktrace]
 * @return {bool} True if native error reporting should be suppressed.
 */
export default function onWindowError( details ) {
	Logger.warn( "QUnit.onError is deprecated and will be removed in QUnit 3.0." +
			" Please use QUnit.onUncaughtException instead." );

	if ( config.current && config.current.ignoreGlobalErrors ) {
		return true;
	}

	const err = new Error( details.message );
	err.stack = details.stacktrace || details.fileName + ":" + details.lineNumber;
	onUncaughtException( err );

	return false;
}
