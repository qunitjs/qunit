import { extend } from "../core/utilities";

export default class TestReport {
	constructor( name, suite, options ) {
		this.name = name;
		this.suiteName = suite.name;
		this.fullName = suite.fullName.concat( name );
		this.runtime = 0;
		this.assertions = [];

		this.skipped = !!options.skip;
		this.todo = !!options.todo;

		this.valid = options.valid;

		this._startTime = 0;
		this._endTime = 0;

		suite.pushTest( this );
	}

	start( recordTime ) {
		if ( recordTime ) {
			this._startTime = Date.now();
		}

		return {
			name: this.name,
			suiteName: this.suiteName,
			fullName: this.fullName.slice()
		};
	}

	end( recordTime ) {
		if ( recordTime ) {
			this._endTime = Date.now();
		}

		return extend( this.start(), {
			runtime: this.getRuntime(),
			status: this.getStatus(),
			errors: this.getFailedAssertions(),
			assertions: this.getAssertions()
		} );
	}

	pushAssertion( assertion ) {
		this.assertions.push( assertion );
	}

	getRuntime() {
		return this._endTime - this._startTime;
	}

	getStatus() {
		if ( this.skipped ) {
			return "skipped";
		}

		const testPassed = this.getFailedAssertions().length > 0 ? this.todo : !this.todo;

		if ( !testPassed ) {
			return "failed";
		} else if ( this.todo ) {
			return "todo";
		} else {
			return "passed";
		}
	}

	getFailedAssertions() {
		return this.assertions.filter( assertion => !assertion.passed );
	}

	getAssertions() {
		return this.assertions.slice();
	}

	// Remove actual and expected values from assertions. This is to prevent
	// leaking memory throughout a test suite.
	slimAssertions() {
		this.assertions = this.assertions.map( assertion => {
			delete assertion.actual;
			delete assertion.expected;
			return assertion;
		} );
	}
}
