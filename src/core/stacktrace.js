// Stacktrace cleaner to focus on the path from error source to test suite.
//
// This should reduce a raw stack trace like this:
//
// > foo.broken()@/src/foo.js
// > Bar@/src/bar.js
// > @/test/bar.test.js
// > @/lib/qunit.js:500:12
// > @/lib/qunit.js:100:28
// > @/lib/qunit.js:200:56
// > setTimeout@
// > @/dist/vendor.js
//
// and shorten it to show up until the end of the user's bar.test.js code.
//
// > foo.broken()@/src/foo.js
// > Bar@/src/bar.js
// > @/test/bar.test.js
//
// QUnit will obtain one example trace (once per process/pageload suffices),
// strip off any :<line> and :<line>:<column>, and use that as match needle,
// to the first QUnit-internal frames, and then stop at that point.
// Any later frames, including those that are outside QUnit again, will be ommitted
// as being uninteresting to the test, since QUnit will have either started or
// resumed the test. This we also clean away browser built-ins, or other
// vendor/bundler that may be higher up the stack.
//
// Stripping :<line>:<column> is not for prettyness, it is essential for the
// match needle to work, since this sample trace will by definitin not be the
// same line as e.g. the QUnit.test() call we're trying to identify.
//
// See also:
// - https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error/Stack
//
const fileName = (sourceFromStacktrace(0) || '')
  // Global replace, because a frame like localhost:4000/lib/qunit.js:1234:50,
  // would otherwise (harmlessly, but uselessly) remove only the port (first match).
  // https://github.com/qunitjs/qunit/issues/1769
  .replace(/(:\d+)+\)?/g, '')
  // Remove anything prior to the last slash (Unix/Windows) from the last frame,
  // leaving only "qunit.js".
  .replace(/.+[/\\]/, '');
export function extractStacktrace (e, offset) {
  offset = offset === undefined ? 4 : offset;

  if (e && e.stack) {
    const stack = e.stack.split('\n');
    if (/^error$/i.test(stack[0])) {
      stack.shift();
    }
    if (fileName) {
      const include = [];
      for (let i = offset; i < stack.length; i++) {
        if (stack[i].indexOf(fileName) !== -1) {
          break;
        }
        include.push(stack[i]);
      }
      if (include.length) {
        return include.join('\n');
      }
    }
    return stack[offset];
  }
}

export function sourceFromStacktrace (offset) {
  let error = new Error();

  // Support: Safari <=7, IE 11
  // Not all browsers generate the `stack` property for `new Error()`
  // See also https://github.com/qunitjs/qunit/issues/636
  if (!error.stack) {
    try {
      throw error;
    } catch (err) {
      error = err;
    }
  }

  return extractStacktrace(error, offset);
}
