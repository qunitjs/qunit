import { window } from '../globals.js';
import Logger from '../logger.js';

// TODO: Consider using globalThis instead of window, so that the reporter
// works for Node.js as well. As this can add overhead, we should make
// this opt-in before we enable it for CLI.
//
// QUnit 3 will switch from `window` to `globalThis` and then make it
// no longer an implicit feature of the HTML Reporter, but rather let
// it be opt-in via `QUnit.config.reporters = ['perf']` or something
// like that.
const nativePerf = (
  window &&
    typeof window.performance !== 'undefined' &&
    // eslint-disable-next-line compat/compat -- Checked
    typeof window.performance.mark === 'function' &&
    // eslint-disable-next-line compat/compat -- Checked
    typeof window.performance.measure === 'function'
)
  ? window.performance
  : undefined;

const perf = {
  measure: nativePerf
    ? function (comment, startMark, endMark) {
      // `performance.measure` may fail if the mark could not be found.
      // reasons a specific mark could not be found include: outside code invoking `performance.clearMarks()`
      try {
        nativePerf.measure(comment, startMark, endMark);
      } catch (ex) {
        Logger.warn('performance.measure could not be executed because of ', ex.message);
      }
    }
    : function () {},
  mark: nativePerf ? nativePerf.mark.bind(nativePerf) : function () {}
};

export default class PerfReporter {
  constructor (runner, options = {}) {
    this.perf = options.perf || perf;

    runner.on('runStart', this.onRunStart.bind(this));
    runner.on('runEnd', this.onRunEnd.bind(this));
    runner.on('suiteStart', this.onSuiteStart.bind(this));
    runner.on('suiteEnd', this.onSuiteEnd.bind(this));
    runner.on('testStart', this.onTestStart.bind(this));
    runner.on('testEnd', this.onTestEnd.bind(this));
  }

  static init (runner, options) {
    return new PerfReporter(runner, options);
  }

  onRunStart () {
    this.perf.mark('qunit_suite_0_start');
  }

  onSuiteStart (suiteStart) {
    const suiteLevel = suiteStart.fullName.length;
    this.perf.mark(`qunit_suite_${suiteLevel}_start`);
  }

  onSuiteEnd (suiteEnd) {
    const suiteLevel = suiteEnd.fullName.length;
    const suiteName = suiteEnd.fullName.join(' – ');

    this.perf.mark(`qunit_suite_${suiteLevel}_end`);
    this.perf.measure(`QUnit Test Suite: ${suiteName}`,
        `qunit_suite_${suiteLevel}_start`,
        `qunit_suite_${suiteLevel}_end`
    );
  }

  onTestStart () {
    this.perf.mark('qunit_test_start');
  }

  onTestEnd (testEnd) {
    this.perf.mark('qunit_test_end');
    const testName = testEnd.fullName.join(' – ');

    this.perf.measure(`QUnit Test: ${testName}`,
      'qunit_test_start',
      'qunit_test_end'
    );
  }

  onRunEnd () {
    this.perf.mark('qunit_suite_0_end');
    this.perf.measure('QUnit Test Run', 'qunit_suite_0_start', 'qunit_suite_0_end');
  }
}
