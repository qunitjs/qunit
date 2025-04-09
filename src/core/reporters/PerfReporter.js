import { globalThis } from '../globals.js';
import { prioritySymbol } from '../events.js';
import Logger from '../logger.js';

const nativePerf = (
  typeof globalThis.performance !== 'undefined'
    // eslint-disable-next-line compat/compat -- Checked
    && typeof globalThis.performance.mark === 'function'
    // eslint-disable-next-line compat/compat -- Checked
    && typeof globalThis.performance.measure === 'function'
)
  ? globalThis.performance
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

    runner.on('runStart', this.onRunStart.bind(this), prioritySymbol);
    runner.on('runEnd', this.onRunEnd.bind(this));
    runner.on('suiteStart', this.onSuiteStart.bind(this), prioritySymbol);
    runner.on('suiteEnd', this.onSuiteEnd.bind(this));
    runner.on('testStart', this.onTestStart.bind(this), prioritySymbol);
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
    this.perf.measure(`QUnit Module: ${suiteName}`,
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
    this.perf.measure('QUnit Run', 'qunit_suite_0_start', 'qunit_suite_0_end');
  }
}
