import { performance } from '../core/utilities.js';

export default class SuiteReport {
  constructor (name, parentSuite) {
    this.name = name;
    this.fullName = parentSuite ? parentSuite.fullName.concat(name) : [];

    // When an "error" event is emitted from onUncaughtException(), the
    // "runEnd" event should report the status as failed. The "runEnd" event data
    // is tracked through this property (via the "runSuite" instance).
    this.globalFailureCount = 0;

    this.tests = [];
    this.childSuites = [];

    if (parentSuite) {
      parentSuite.pushChildSuite(this);
    }
  }

  start (recordTime) {
    if (recordTime) {
      this._startTime = performance.now();
    }

    return {
      name: this.name,
      fullName: this.fullName.slice(),
      tests: this.tests.map(test => test.start()),
      childSuites: this.childSuites.map(suite => suite.start()),
      testCounts: {
        // TODO: Due to code reuse, this ends up computing getStatus()
        // for tests that obviously haven't run yet. It's harmless but
        // quite inefficient recursion, that we repeat many times over
        // also via test.start() and suite.start() above.
        total: this.getTestCounts().total
      }
    };
  }

  end (recordTime) {
    if (recordTime) {
      this._endTime = performance.now();
    }

    return {
      name: this.name,
      fullName: this.fullName.slice(),
      tests: this.tests.map(test => test.end()),
      childSuites: this.childSuites.map(suite => suite.end()),
      testCounts: this.getTestCounts(),
      runtime: this.getRuntime(),
      status: this.getStatus()
    };
  }

  pushChildSuite (suite) {
    this.childSuites.push(suite);
  }

  pushTest (test) {
    this.tests.push(test);
  }

  getRuntime () {
    return Math.round(this._endTime - this._startTime);
  }

  getTestCounts (counts = { passed: 0, failed: 0, skipped: 0, todo: 0, total: 0 }) {
    counts.failed += this.globalFailureCount;
    counts.total += this.globalFailureCount;

    counts = this.tests.reduce((counts, test) => {
      if (test.valid) {
        counts[test.getStatus()]++;
        counts.total++;
      }

      return counts;
    }, counts);

    return this.childSuites.reduce((counts, suite) => {
      return suite.getTestCounts(counts);
    }, counts);
  }

  getStatus () {
    const {
      total,
      failed,
      skipped,
      todo
    } = this.getTestCounts();

    if (failed) {
      return 'failed';
    } else {
      if (skipped === total) {
        return 'skipped';
      } else if (todo === total) {
        return 'todo';
      } else {
        return 'passed';
      }
    }
  }
}
