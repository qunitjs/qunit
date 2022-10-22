'use strict';

const cp = require('child_process');
const os = require('os');
const path = require('path');

const reEscape = /([\\{}()|.?*+\-^$[\]])/g;

// Apply light normalization to CLI output to allow strict string
// comparison across Node versions and OS platforms against the
// expected output in fixtures/.
function normalize (actual) {
  const dir = path.join(__dirname, '..', '..', '..');
  const reDir = new RegExp(dir.replace(reEscape, '\\$1'), 'g');
  const reSep = new RegExp(path.sep.replace(reEscape, '\\$1'), 'g');

  return actual
    .replace(reDir, '/qunit')
    // Replace backslashes (\) in stack traces on Windows to POSIX
    .replace(reSep, '/')
    // Convert "at processModule (/qunit/qunit/qunit.js:1:2)" to "at qunit.js"
    // Convert "at /qunit/qunit/qunit.js:1:2" to "at qunit.js"
    .replace(/^(\s+at ).*\/qunit\/qunit\/qunit\.js.*$/gm, '$1qunit.js')
    // Strip inferred names for anonymous test closures (as Node 10 did),
    // to match the output of Node 12+.
    // Convert "at QUnit.done (/qunit/test/foo.js:1:2)" to "at /qunit/test/foo.js:1:2"
    .replace(/\b(at )\S+ \((\/qunit\/test\/[^:]+:\d+:\d+)\)/g, '$1$2')
    // Convert sourcemap'ed traces from Node 14 and earlier to the
    // standard format used by Node 15+.
    // https://github.com/nodejs/node/commit/15804e0b3f
    // https://github.com/nodejs/node/pull/37252
    // Convert "at foo (/min.js:1)\n -> /src.js:2" to "at foo (/src.js:2)"
    .replace(/\b(at [^(]+\s\()[^)]+(\))\n\s+-> ([^\n]+)/g, '$1$3$2')
    // CJS-style internal traces:
    // Convert "at load (internal/modules/cjs/loader.js:7)" to "at internal"
    //
    // ESM-style internal traces from Node 14+:
    // Convert "at wrap (node:internal/modules/cjs/loader:1)" to "at internal"
    .replace(/^(\s+at ).+\([^/)][^)]*\)$/gm, '$1internal')

    // Convert /bin/qunit and /src/cli to internal as well
    // Because there are differences between Node 10 and Node 12 in terms
    // of how much back and forth ocurrs, so by mapping both to internal
    // we can flatten and normalize across.
    .replace(/^(\s+at ).*\/qunit\/bin\/qunit\.js.*$/gm, '$1internal')
    .replace(/^(\s+at ).*\/qunit\/src\/cli\/.*$/gm, '$1internal')

    // Strip frames from indirect nyc dependencies that are specific
    // to code coverage jobs:
    // Convert "at load (/qunit/node_modules/append-transform/index.js:6" to "at internal"
    .replace(/ {2}at .+\/.*node_modules\/append-transform\/.*\)/g, '  at internal')
    // Consolidate subsequent qunit.js frames
    .replace(/^(\s+at qunit\.js$)(\n\s+at qunit\.js$)+/gm, '$1')
    // Consolidate subsequent internal frames
    .replace(/^(\s+at internal$)(\n\s+at internal$)+/gm, '$1');
}

/**
 * Executes the provided command from within the fixtures directory.
 *
 * The `options` and `hook` parameters are used by test/cli/watch.js to
 * control the stdio stream.
 *
 * @param {Array} command
 * @param {Object} [options]
 * @param {Array} [options.stdio]
 * @param {Object} [options.env]
 * @param {Function} [hook]
 */
async function execute (command, options = {}, hook) {
  options.cwd = path.join(__dirname, '..', 'fixtures');

  // Inherit no environment by default
  // Without this, tests may fail from inheriting FORCE_COLOR=1
  options.env = options.env || {};

  // Avoid Windows-specific issue where otherwise 'foo/bar' is seen as a directory
  // named "'foo/" (including the single quote).
  options.windowsVerbatimArguments = true;

  let cmd = command[0];
  const args = command.slice(1);
  if (cmd === 'qunit') {
    cmd = '../../../bin/qunit.js';
    args.unshift(cmd);
    cmd = process.execPath;
  }
  if (cmd === 'node') {
    cmd = process.execPath;
  }

  const spawned = cp.spawn(cmd, args, options);

  if (hook) {
    hook(spawned);
  }

  const result = {
    code: null,
    stdout: '',
    stderr: ''
  };
  spawned.stdout.on('data', data => {
    result.stdout += data;
  });
  spawned.stderr.on('data', data => {
    result.stderr += data;
  });
  const execPromise = new Promise((resolve, reject) => {
    spawned.on('error', error => {
      reject(error);
    });
    spawned.on('exit', (exitCode, _signal) => {
      result.code = exitCode;
    });
    // Wait for 'close' event. https://github.com/nodejs/node/issues/45085
    spawned.on('close', () => {
      if (result.code !== 0) {
        reject(new Error('Exit code ' + result.code));
      } else {
        resolve();
      }
    });
  });

  try {
    await execPromise;
  } catch (e) {
    // We return `result` instead of re-throwing a modified `e`
    // which makes test handlers more consistent by simply asserting
    // `result.code`. But, makes sure the code is actually non-zero.
    result.code = result.code || 'oops';
  }

  result.stdout = normalize(String(result.stdout).trimEnd());
  result.stderr = normalize(String(result.stderr).trimEnd());

  result.snapshot = result.stdout;
  if (result.stderr) {
    result.snapshot += (result.snapshot ? '\n\n' : '') + '# stderr\n' + result.stderr;
  }
  if (result.code) {
    result.snapshot += (result.snapshot ? '\n\n' : '') + '# exit code: ' + result.code;
  }
  result.command = command;

  return result;
}

// Very loose command formatter.
// Not for the purpose of execution, but for the purpose
// of formatting the string key in fixtures/ files.
function prettyPrintCommand (command) {
  return command.map(arg => {
    // Quote spaces and stars
    return /[ *]/.test(arg) ? `'${arg}'` : arg;
  }).join(' ');
}

/**
 * @param {Array<number,any>} input
 * @param {number} [concurrency=0]
 * @return {Array<number,Promise>}
 */
function concurrentMap (input, concurrency, asyncFn) {
  const ret = [];
  if (!concurrency) {
    concurrency = os.cpus().length;
  }
  if (concurrency < 1) {
    throw new Error('Concurrency must be non-zero');
  }
  for (let i = 0; i < input.length; i++) {
    const val = input[i];
    ret[i] = (i < concurrency)
      ? Promise.resolve(asyncFn(val))
      : ret[i - concurrency].then(asyncFn.bind(null, val));
  }
  return ret;
}

/**
 * @param {Object<string,any>} input
 * @param {number} [concurrency=0]
 * @return {Object<string,Promise>}
 */
function concurrentMapKeys (input, concurrency, asyncFn) {
  const keys = Object.keys(input);
  const values = concurrentMap(keys, concurrency, async function (key) {
    return await asyncFn(input[key]);
  });
  const ret = {};
  for (var i = 0; i < keys.length; i++) {
    ret[keys[i]] = values[i];
  }
  return ret;
}

module.exports = {
  normalize,
  execute,
  prettyPrintCommand,
  concurrentMap,
  concurrentMapKeys
};
