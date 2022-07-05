import { window } from '../globals';
import Logger from '../logger';

export const toString = Object.prototype.toString;
export const hasOwn = Object.prototype.hasOwnProperty;

const nativePerf = getNativePerf();

// TODO: Consider using globalThis instead so that perf marks work
// in Node.js as well. As they can have overhead, we should also
// have a way to disable these, and/or make them an opt-in reporter
// in QUnit 3 and then support globalThis.
// For example: `QUnit.addReporter(QUnit.reporters.perf)`.
function getNativePerf () {
  if (window &&
    typeof window.performance !== 'undefined' &&
    typeof window.performance.mark === 'function' &&
    typeof window.performance.measure === 'function'
  ) {
    return window.performance;
  } else {
    return undefined;
  }
}

export const performance = {
  now: nativePerf
    ? nativePerf.now.bind(nativePerf)
    : Date.now,
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

// Returns a new Array with the elements that are in a but not in b
export function diff (a, b) {
  const result = a.slice();

  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < b.length; j++) {
      if (result[i] === b[j]) {
        result.splice(i, 1);
        i--;
        break;
      }
    }
  }
  return result;
}

/**
 * Determines whether an element exists in a given array or not.
 *
 * @method inArray
 * @param {any} elem
 * @param {Array} array
 * @return {boolean}
 */
export function inArray (elem, array) {
  return array.indexOf(elem) !== -1;
}

/**
 * Recursively clone an object into a plain array or object, taking only the
 * own enumerable properties.
 *
 * @param {any} obj
 * @param {bool} [allowArray=true]
 * @return {Object|Array}
 */
export function objectValues (obj, allowArray = true) {
  const vals = (allowArray && is('array', obj)) ? [] : {};
  for (const key in obj) {
    if (hasOwn.call(obj, key)) {
      const val = obj[key];
      vals[key] = val === Object(val) ? objectValues(val, allowArray) : val;
    }
  }
  return vals;
}

/**
 * Recursively clone an object into a plain object, taking only the
 * subset of own enumerable properties that exist a given model.
 *
 * @param {any} obj
 * @param {any} model
 * @return {Object}
 */
export function objectValuesSubset (obj, model) {
  // Return primitive values unchanged to avoid false positives or confusing
  // results from assert.propContains().
  // E.g. an actual null or false wrongly equaling an empty object,
  // or an actual string being reported as object not matching a partial object.
  if (obj !== Object(obj)) {
    return obj;
  }

  // Unlike objectValues(), subset arrays to a plain objects as well.
  // This enables subsetting [20, 30] with {1: 30}.
  const subset = {};

  for (const key in model) {
    if (hasOwn.call(model, key) && hasOwn.call(obj, key)) {
      subset[key] = objectValuesSubset(obj[key], model[key]);
    }
  }
  return subset;
}

export function objectType (obj) {
  if (typeof obj === 'undefined') {
    return 'undefined';
  }

  // Consider: typeof null === object
  if (obj === null) {
    return 'null';
  }

  const match = toString.call(obj).match(/^\[object\s(.*)\]$/);
  const type = match && match[1];

  switch (type) {
    case 'Number':
      if (isNaN(obj)) {
        return 'nan';
      }
      return 'number';
    case 'String':
    case 'Boolean':
    case 'Array':
    case 'Set':
    case 'Map':
    case 'Date':
    case 'RegExp':
    case 'Function':
    case 'Symbol':
      return type.toLowerCase();
    default:
      return typeof obj;
  }
}

// Safe object type checking
export function is (type, obj) {
  return objectType(obj) === type;
}

// Based on Java's String.hashCode, a simple but not
// rigorously collision resistant hashing function
export function generateHash (module, testName) {
  const str = module + '\x1C' + testName;
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }

  // Convert the possibly negative integer hash code into an 8 character hex string, which isn't
  // strictly necessary but increases user understanding that the id is a SHA-like hash
  let hex = (0x100000000 + hash).toString(16);
  if (hex.length < 8) {
    hex = '0000000' + hex;
  }

  return hex.slice(-8);
}

/**
 * Converts an error into a simple string for comparisons.
 *
 * @param {Error|any} error
 * @return {string}
 */
export function errorString (error) {
  // Use String() instead of toString() to handle non-object values like undefined or null.
  const resultErrorString = String(error);

  // If the error wasn't a subclass of Error but something like
  // an object literal with name and message properties...
  if (resultErrorString.slice(0, 7) === '[object') {
    // Based on https://es5.github.io/#x15.11.4.4
    return (error.name || 'Error') + (error.message ? `: ${error.message}` : '');
  } else {
    return resultErrorString;
  }
}
