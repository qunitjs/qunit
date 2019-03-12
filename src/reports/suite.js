import { measure, performance, performanceNow, isNodeJS } from "../core/utilities";

export default class SuiteReport {
	constructor( name, parentSuite ) {
		this.name = name;
		this.fullName = parentSuite ? parentSuite.fullName.concat( name ) : [];

		this.tests = [];
		this.childSuites = [];

		if ( parentSuite ) {
			parentSuite.pushChildSuite( this );
		}
	}

	start( recordTime ) {
		if ( recordTime ) {
			this._startTime = performanceNow();

			if ( performance ) {
				const suiteLevel = this.fullName.length;
				performance.mark( `qunit_suite_${suiteLevel}_start` );
			}

			if ( console.group && !isNodeJS ) {
				console.group( `Test Suite: ${this.name}` );
			}
		}

		return {
			name: this.name,
			fullName: this.fullName.slice(),
			tests: this.tests.map( test => test.start() ),
			childSuites: this.childSuites.map( suite => suite.start() ),
			testCounts: {
				total: this.getTestCounts().total
			}
		};
	}

	end( recordTime ) {
		if ( recordTime ) {
			this._endTime = performanceNow();

			if ( performance ) {
				const suiteLevel = this.fullName.length;
				performance.mark( `qunit_suite_${suiteLevel}_end` );

				const suiteName = this.fullName.join( " – " );

				measure(
					suiteLevel === 0 ? "QUnit Test Run" : `QUnit Test Suite: ${suiteName}`,
					`qunit_suite_${suiteLevel}_start`,
					`qunit_suite_${suiteLevel}_end`
				);
			}

			if ( console.groupEnd && !isNodeJS ) {
				console.groupEnd();
			}
		}

		return {
			name: this.name,
			fullName: this.fullName.slice(),
			tests: this.tests.map( test => test.end() ),
			childSuites: this.childSuites.map( suite => suite.end() ),
			testCounts: this.getTestCounts(),
			runtime: this.getRuntime(),
			status: this.getStatus()
		};
	}

	pushChildSuite( suite ) {
		this.childSuites.push( suite );
	}

	pushTest( test ) {
		this.tests.push( test );
	}

	getRuntime() {
		return this._endTime - this._startTime;
	}

	getTestCounts( counts = { passed: 0, failed: 0, skipped: 0, todo: 0, total: 0 } ) {
		counts = this.tests.reduce( ( counts, test ) => {
			if ( test.valid ) {
				counts[ test.getStatus() ]++;
				counts.total++;
			}

			return counts;
		}, counts );

		return this.childSuites.reduce( ( counts, suite ) => {
			return suite.getTestCounts( counts );
		}, counts );
	}

	getStatus() {
		const {
			total,
			failed,
			skipped,
			todo
		} = this.getTestCounts();

		if ( failed ) {
			return "failed";
		} else {
			if ( skipped === total ) {
				return "skipped";
			} else if ( todo === total ) {
				return "todo";
			} else {
				return "passed";
			}
		}
	}
}
