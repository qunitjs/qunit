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

function qunitFileName () {
  let error = new Error();
  if (!error.stack) {
    // Copy of sourceFromStacktrace() to avoid circular dependency
    // Support: IE 11
    try {
      throw error;
    } catch (err) {
      error = err;
    }
  }
  return (error.stack || '')
    // Copy of extractStacktrace() to avoid circular dependency
    // Support: V8/Chrome
    .replace(/^error$\n/im, '')
    .split('\n')[0]
    // Global replace, because a frame like localhost:4000/lib/qunit.js:1234:50,
    // would otherwise (harmlessly, but uselessly) remove only the port (first match).
    // https://github.com/qunitjs/qunit/issues/1769
    .replace(/(:\d+)+\)?/g, '')
    // Remove anything prior to the last slash (Unix/Windows) from the last frame,
    // leaving only "qunit.js".
    .replace(/.+[/\\]/, '');
}

const fileName = qunitFileName();

/**
 * - For internal errors from QUnit itself, remove the first qunit.js frames.
 * - For errors in Node.js, format any remaining qunit.js and node:internal
 *   frames as internal (i.e. grey out).
 */
export function annotateStacktrace (e, formatInternal) {
  if (!e || !e.stack) {
    return String(e);
  }
  const frames = e.stack.split('\n');
  const annotated = [];
  if (e.toString().indexOf(frames[0]) !== -1) {
    // In Firefox and Safari e.stack starts with frame 0, but in V8 (Chrome/Node.js),
    // e.stack starts first stringified message. Preserve this separately,
    // so that, below, we can distinguish between internal frames on top
    // (to remove) vs later internal frames (to format differently).
    annotated.push(frames.shift());
  }
  let initialInternal = true;
  for (let i = 0; i < frames.length; i++) {
    const frame = frames[i];
    const isInternal = (frame.indexOf(fileName) !== -1 || frame.indexOf('node:internal/') !== -1);
    if (!isInternal) {
      initialInternal = false;
    }
    // Remove initial internal frames entirely.
    if (!initialInternal) {
      annotated.push(isInternal ? formatInternal(frame) : frame);
    }
  }

  return annotated.join('\n');
}

export function extractStacktrace (e, offset) {
  offset = offset === undefined ? 4 : offset;

  if (e && e.stack) {
    const stack = e.stack.split('\n');
    // In Firefox and Safari, e.stack starts immediately with the first frame.
    //
    // In V8 (Chrome/Node.js), the stack starts first with a stringified error message,
    // and the real stack starting on line 2.
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

  // Support: IE 11, iOS 7
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

export function stack (offset) {
  offset = (offset || 0) + 2;
  // Support Safari: Use temp variable to avoid triggering ES6 Proper Tail Calls,
  // which ensures a consistent cross-browser result.
  // https://bugs.webkit.org/show_bug.cgi?id=276187
  const source = sourceFromStacktrace(offset);
  return source;
}
