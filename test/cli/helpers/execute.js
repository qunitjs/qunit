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
  // Replace backslashes (\) in stack traces on Windows to POSIX
  // but leave quoted/escaped shell arguments like \"foo\" unchanged.
  const reSep = new RegExp(path.sep.replace(reEscape, '\\$1') + '(?!")', 'g');

  return actual
    .replace(reDir, '/qunit')
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
    // ESM-style internal traces from Node 22+ that NYC corrupts
    // https://github.com/istanbuljs/nyc/issues/1589
    // from "at Object..js (node:internal/modules/cjs/loader:1904:10)"
    // to "at node:internal/modules/cjs/loader:1904:10"
    .replace(/^(\s+at )node:[^) ]+$/gm, '$1internal')

    // Convert /bin/qunit and /src/cli to internal as well
    // Because there are differences between Node 10 and Node 12 in terms
    // of how much back and forth occurs, so by mapping both to internal
    // we can flatten and normalize across.
    .replace(/^(\s+at ).*\/qunit\/bin\/qunit\.js.*$/gm, '$1internal')
    .replace(/^(\s+at ).*\/qunit\/src\/cli\/.*$/gm, '$1internal')

    // Strip frames from nyc dependencies that nyc injects during coverage job:
    // Convert "at load (/qunit/node_modules/append-transform/index.js:6"
    // Convert "at process.processEmit (/qunit/node_modules/signal-exit/index.js:199:34)"
    .replace(/ {2}at .+\/.*node_modules\/append-transform\/.*\)/g, '  at internal')
    .replace(/ {2}at .+\/.*node_modules\/signal-exit\/.*\)/g, '  at internal')
    // Consolidate subsequent qunit.js frames
    .replace(/^(\s+at qunit\.js$)(\n\s+at qunit\.js$)+/gm, '$1')
    // Consolidate subsequent internal frames
    .replace(/^(\s+at internal$)(\n\s+at internal$)+/gm, '$1')

    // Normalize tap-min time duration
    .replace(/\(\d+ms\)/g, '(1ms)');
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
  options.cwd ??= path.join(__dirname, '..', 'fixtures');

  // Inherit no environment by default
  // Without this, tests may fail from inheriting FORCE_COLOR=1
  options.env = options.env || {};

  // Avoid Windows-specific issue where otherwise 'foo/bar' is seen as a directory
  // named "'foo/" (including the single quote).
  options.windowsVerbatimArguments = true;

  let cmd = command[0];
  const args = command.slice(1);
  if (cmd === 'qunit') {
    cmd = path.join(__dirname, '../../../bin/qunit.js');
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

  return await getProcessResult(spawned);
}

/**
 * Executes the provided command from within the fixtures directory.
 *
 * This variation of execute() exists to allow for pipes.
 *
 * @param {string} command
 */
async function executeRaw (command, options = {}) {
  options.cwd = path.join(__dirname, '..', 'fixtures');
  options.env = {
    PATH: process.env.PATH
  };

  const parts = command.split(' ');
  if (parts[0] === 'qunit') {
    parts[0] = JSON.stringify(process.execPath) + ' ../../../bin/qunit.js';
  }
  if (parts[0] === 'node') {
    parts[0] = JSON.stringify(process.execPath);
  }

  const cmd = parts.join(' ');
  const spawned = cp.exec(cmd, options);

  return await getProcessResult(spawned);
}

async function getProcessResult (spawned) {
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

  return result;
}

/**
 * @param {Array<number,any>} input
 * @param {number} [concurrency=0]
 * @return {Array<number,Promise>}
 */
function concurrentMap (input, concurrency, asyncFn) {
  if (!concurrency) {
    concurrency = os.cpus().length;
  }
  if (concurrency < 1) {
    throw new Error('Concurrency must be non-zero');
  }
  const queue = [];
  const ret = [];
  function next () {
    if (queue.length) {
      queue.shift()();
    }
  }
  for (let i = 0; i < input.length; i++) {
    const val = input[i];
    if (i < concurrency) {
      ret[i] = Promise.resolve(asyncFn(val));
    } else {
      let trigger;
      const promise = new Promise((resolve) => {
        trigger = resolve;
      });
      queue.push(trigger);

      ret[i] = promise.then(asyncFn.bind(null, val));
    }
    // Avoid premature UnhandledPromiseRejectionWarning
    ret[i].catch(() => null).finally(next);
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
  for (let i = 0; i < keys.length; i++) {
    ret[keys[i]] = values[i];
  }
  return ret;
}

module.exports = {
  normalize,
  execute,
  executeRaw,
  concurrentMap,
  concurrentMapKeys
};
