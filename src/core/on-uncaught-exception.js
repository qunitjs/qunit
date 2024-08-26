import config from './config.js';
import { emit } from './events.js';
import { globalSuiteReport } from './module.js';
import { sourceFromStacktrace } from './stacktrace.js';
import { errorString } from './utilities.js';

/**
 * Handle a global error that should result in a failed test run.
 *
 * Summary:
 *
 * - If we're strictly inside a test (or one if its module hooks), the exception
 *   becomes a failed assertion.
 *
 *   This has the important side-effect that uncaught exceptions (such as
 *   calling an undefined function) during a "todo" test do NOT result in
 *   a failed test run.
 *
 * - If we're anywhere outside a test (be it in early event callbacks, or
 *   internally between tests, or somewhere after "runEnd" if the process is
 *   still alive for some reason), then send an "error" event to the reporters.
 *
 * @since 2.17.0
 * @param {Error|any} error
 */
export default function onUncaughtException (error) {
  if (config.current) {
    // This omits 'actual' and 'expected' (undefined)
    config.current.assert.pushResult({
      result: false,
      message: `global failure: ${errorString(error)}`,

      // We could let callers specify an offset to subtract a number of frames via
      // sourceFromStacktrace, in case they are a wrapper further away from the error
      // handler, and thus reduce some noise in the stack trace. However, we're not
      // doing this right now because it would almost never be used in practice given
      // the vast majority of error values will be Error objects, and thus have their
      // own stack trace already.
      source: (error && error.stack) || sourceFromStacktrace(2)
    });
  } else {
    // The "error" event was added in QUnit 2.17.
    // Increase "bad assertion" stats despite no longer pushing an assertion in this case.
    // This ensures "runEnd" and "QUnit.done()" handlers behave as expected, since the "bad"
    // count is typically how reporters decide on the boolean outcome of the test run.
    globalSuiteReport.globalFailureCount++;
    config.stats.bad++;
    config.stats.all++;
    emit('error', error);
  }
}
