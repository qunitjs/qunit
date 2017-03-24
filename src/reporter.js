import { objectType } from "./core/utilities";
import QUnit, { internalState } from "./core";

const reporters = [];
let defaultReporter;

function validateReporterChange( functionName, reporter ) {
	let reporterType = objectType( reporter );
	if ( reporterType !== "function" ) {
		throw new Error(
			`Expected ${functionName} to be called with a constructor function, ` +
			`but was called with a ${reporterType}.`
		);
	} else if ( internalState.runStarted ) {
		throw new Error(
			`Called ${functionName} after the test run has started.`
		);
	}
}

export function addReporter( reporter ) {
	validateReporterChange( "addReporter", reporter );
	reporters.push( reporter );
}

export function setDefaultReporter( reporter ) {
	validateReporterChange( "setDefaultReporter", reporter );
	defaultReporter = reporter;
}

export function initializeReporters() {
	[ defaultReporter, ...reporters ]
		.filter( Boolean )
		.forEach( reporter => {
			return reporter.init ? reporter.init( QUnit ) : new reporter( QUnit );
		} );
}
