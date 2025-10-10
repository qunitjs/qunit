import { console } from '../globals.js';
import { annotateStacktrace } from '../stacktrace.js';
import { errorString } from '../utilities.js';
import kleur from 'kleur';

/**
 * Format a given value into YAML.
 *
 * YAML is a superset of JSON that supports all the same data
 * types and syntax, and more. As such, it is always possible
 * to fallback to JSON.stringfify, but we generally avoid
 * that to make output easier to read for humans.
 *
 * Supported data types:
 *
 * - null
 * - boolean
 * - number
 * - string
 * - array
 * - object
 *
 * Anything else (including NaN, Infinity, and undefined)
 * must be described in strings, for display purposes.
 *
 * Note that quotes are optional in YAML strings if the
 * strings are "simple", and as such we generally prefer
 * that for improved readability. We output strings in
 * one of three ways:
 *
 * - bare unquoted text, for simple one-line strings.
 * - JSON (quoted text), for complex one-line strings.
 * - YAML Block, for complex multi-line strings.
 *
 * Objects with cyclical references will be stringifed as
 * "[Circular]" as they cannot otherwise be represented.
 */
function prettyYamlValue (value, indent = 2) {
  if (value === undefined) {
    // Not supported in JSON/YAML, turn into string
    // and let the below output it as bare string.
    value = String(value);
  }

  // Support IE 9-11: Use isFinite instead of ES6 Number.isFinite
  if (typeof value === 'number' && !isFinite(value)) {
    // Turn NaN and Infinity into simple strings.
    // Paranoia: Don't return directly just in case there's
    // a way to add special characters here.
    value = String(value);
  }

  if (typeof value === 'number') {
    // Simple numbers
    return JSON.stringify(value);
  }

  if (typeof value === 'string') {
    // If any of these match, then we can't output it
    // as bare unquoted text, because that would either
    // cause data loss or invalid YAML syntax.
    //
    // - Quotes, escapes, line breaks, or JSON-like stuff.
    // - Not allowed in YAML unquoted strings per https://yaml.org/spec/1.2.2/#733-plain-style
    //   * ": " (colon followed by space)
    //   * " #" (space followed by hash)
    const rSpecialJson = /['"\\/[{}\]\r\n|:#]/;

    // - Characters that are special at the start of a YAML value
    const rSpecialYaml = /[-?:,[\]{}#&*!|=>'"%@`]/;

    // - Leading or trailing whitespace.
    const rUntrimmed = /(^\s|\s$)/;

    // - Ambiguous as YAML number, e.g. '2', '-1.2', '.2', or '2_000'
    const rNumerical = /^[\d._-]+$/;

    // - Ambiguous as YAML bool.
    //   Use case-insensitive match, although technically only
    //   fully-lower, fully-upper, or uppercase-first would be ambiguous.
    //   e.g. true/True/TRUE, but not tRUe.
    const rBool = /^(true|false|y|n|yes|no|on|off)$/i;

    // Is this a complex string?
    if (
      value === ''
        || rSpecialJson.test(value)
        || rSpecialYaml.test(value[0])
        || rUntrimmed.test(value)
        || rNumerical.test(value)
        || rBool.test(value)
    ) {
      if (!/\n/.test(value)) {
        // Complex one-line string, use JSON (quoted string)
        return JSON.stringify(value);
      }

      // See also <https://yaml-multiline.info/>
      // Support IE 9-11: Avoid ES6 String#repeat
      const prefix = (new Array((indent * 2) + 1)).join(' ');

      const trailingLinebreakMatch = value.match(/\n+$/);
      const trailingLinebreaks = trailingLinebreakMatch
        ? trailingLinebreakMatch[0].length
        : 0;

      if (trailingLinebreaks === 1) {
        // Use the most straight-forward "Block" string in YAML
        // without any "Chomping" indicators.
        const lines = value

        // Ignore the last new line, since we'll get that one for free
        // with the straight-forward Block syntax.
          .replace(/\n$/, '')
          .split('\n')
          .map(line => prefix + line);
        return '|\n' + lines.join('\n');
      } else {
        // This has either no trailing new lines, or more than 1.
        // Use |+ so that YAML parsers will preserve it exactly.
        const lines = value
          .split('\n')
          .map(line => prefix + line);
        return '|+\n' + lines.join('\n');
      }
    } else {
      // Simple string, use bare unquoted text
      return value;
    }
  }

  const prefix = (new Array(indent + 1)).join(' ');

  // Handle null, boolean, array, and object
  return JSON.stringify(decycledShallowClone(value), null, 2)
    .split('\n')
    .map((line, i) => i === 0 ? line : prefix + line)
    .join('\n');
}

/**
 * Creates a shallow clone of an object where cycles have
 * been replaced with "[Circular]".
 */
function decycledShallowClone (object, ancestors = []) {
  if (ancestors.indexOf(object) !== -1) {
    return '[Circular]';
  }

  const type = Object.prototype.toString
    .call(object)
    .replace(/^\[.+\s(.+?)]$/, '$1')
    .toLowerCase();

  let clone;

  switch (type) {
    case 'array':
      ancestors.push(object);
      clone = object.map(function (element) {
        return decycledShallowClone(element, ancestors);
      });
      ancestors.pop();
      break;
    case 'object':
      ancestors.push(object);
      clone = {};
      Object.keys(object).forEach(function (key) {
        clone[key] = decycledShallowClone(object[key], ancestors);
      });
      ancestors.pop();
      break;
    default:
      clone = object;
  }

  return clone;
}

export default class TapReporter {
  constructor (runner, options = {}) {
    // Cache references to console methods to ensure we can report failures
    // from tests tests that mock the console object itself.
    // https://github.com/qunitjs/qunit/issues/1340
    // Support IE 9: Function#bind is supported, but no console.log.bind().
    this.log = options.log || Function.prototype.bind.call(console.log, console);

    this.testCount = 0;
    this.started = false;
    this.ended = false;
    this.bailed = false;

    runner.on('error', this.onError.bind(this));
    runner.on('runStart', this.onRunStart.bind(this));
    runner.on('testEnd', this.onTestEnd.bind(this));
    runner.on('runEnd', this.onRunEnd.bind(this));
  }

  static init (runner, options) {
    return new TapReporter(runner, options);
  }

  onRunStart () {
    if (!this.started) {
      this.log('TAP version 13');
      this.started = true;
    }
  }

  onError (error) {
    if (this.bailed) {
      return;
    }

    this.bailed = true;

    // Imitate onTestEnd
    // Skip this if we're past "runEnd" as it would look odd
    if (!this.ended) {
      this.onRunStart();
      this.testCount = this.testCount + 1;
      this.log(`not ok ${this.testCount} ${kleur.red('global failure')}`);
      this.logError(error);
    }

    this.log('Bail out! ' + errorString(error).split('\n')[0]);
    if (this.ended) {
      this.logError(error);
    }
  }

  onTestEnd (test) {
    this.testCount = this.testCount + 1;

    if (test.status === 'passed') {
      this.log(`ok ${this.testCount} ${test.fullName.join(' > ')}`);
    } else if (test.status === 'skipped') {
      this.log(
        `ok ${this.testCount} ${kleur.yellow(test.fullName.join(' > '))} # SKIP`
      );
    } else if (test.status === 'todo') {
      this.log(
        `not ok ${this.testCount} ${kleur.cyan(test.fullName.join(' > '))} # TODO`
      );
      test.errors.forEach((error) => this.logAssertion(error, 'todo'));
    } else {
      this.log(
        `not ok ${this.testCount} ${kleur.red(test.fullName.join(' > '))}`
      );
      test.errors.forEach((error) => this.logAssertion(error));
    }
  }

  onRunEnd (runEnd) {
    this.ended = true;

    this.log(`1..${runEnd.testCounts.total}`);
    this.log(`# pass ${runEnd.testCounts.passed}`);
    this.log(`# ${kleur.yellow(`skip ${runEnd.testCounts.skipped}`)}`);
    this.log(`# ${kleur.cyan(`todo ${runEnd.testCounts.todo}`)}`);
    this.log(`# ${kleur.red(`fail ${runEnd.testCounts.failed}`)}`);
  }

  logAssertion (error, severity) {
    let out = '  ---';
    out += `\n  message: ${prettyYamlValue(error.message || 'failed')}`;
    out += `\n  severity: ${prettyYamlValue(severity || 'failed')}`;

    // When pushFailure() is used, actual/expected are initially unset but
    // eventually in Test#logAssertion, for testReport#pushAssertion, these are
    // forged into existence as undefined.
    const hasAny = (error.expected !== undefined || error.actual !== undefined);
    if (hasAny) {
      out += `\n  actual  : ${prettyYamlValue(error.actual)}`;
      out += `\n  expected: ${prettyYamlValue(error.expected)}`;
    }

    if (error.stack) {
      // Since stacks aren't user generated, take a bit of liberty by
      // adding a trailing new line to allow a straight-forward YAML Blocks.
      const fmtStack = annotateStacktrace(error.stack, kleur.grey);
      if (fmtStack.length) {
        out += `\n  stack: ${prettyYamlValue(fmtStack + '\n')}`;
      }
    }

    out += '\n  ...';
    this.log(out);
  }

  logError (error) {
    let out = '  ---';
    out += `\n  message: ${prettyYamlValue(errorString(error))}`;
    out += `\n  severity: ${prettyYamlValue('failed')}`;
    if (error && error.stack) {
      const fmtStack = annotateStacktrace(error.stack, kleur.grey, error.toString());
      if (fmtStack.length) {
        out += `\n  stack: ${prettyYamlValue(fmtStack + '\n')}`;
      }
    }
    out += '\n  ...';
    this.log(out);
  }
}
