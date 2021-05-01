import { console } from "../globals";

export default class ConsoleReporter {
	constructor( runner, options = {} ) {

		// Cache references to console methods to ensure we can report failures
		// from tests tests that mock the console object itself.
		// https://github.com/qunitjs/qunit/issues/1340
		this.log = options.log || console.log.bind( console );

		runner.on( "runStart", this.onRunStart.bind( this ) );
		runner.on( "testStart", this.onTestStart.bind( this ) );
		runner.on( "testEnd", this.onTestEnd.bind( this ) );
		runner.on( "runEnd", this.onRunEnd.bind( this ) );
	}

	static init( runner, options ) {
		return new ConsoleReporter( runner, options );
	}

	onRunStart( runStart ) {
		this.log( "runStart", runStart );
	}

	onTestStart( test ) {
		this.log( "testStart", test );
	}

	onTestEnd( test ) {
		this.log( "testEnd", test );
	}

	onRunEnd( runEnd ) {
		this.log( "runEnd", runEnd );
	}
}
