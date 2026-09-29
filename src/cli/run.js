'use strict';

const path = require('path');
const url = require('url');

const requireFromCWD = require('./require-from-cwd');
const requireQUnit = require('./require-qunit');
const utils = require('./utils');
const { findReporter } = require('./find-reporter');

const DEBOUNCE_WATCH_LENGTH = 60;
const DEBOUNCE_RESTART_LENGTH = 200 - DEBOUNCE_WATCH_LENGTH;

const changedPendingPurge = [];

let QUnit;
let running = false;
let restartDebounceTimer;

function onUnhandledRejection (reason, _promise) {
  if (!QUnit.config.ignoreUnhandledRejections) {
    QUnit.onUncaughtException(reason);
  }
}
function onUncaughtException (error, _origin) {
  QUnit.onUncaughtException(error);
}
function onExit () {
  if (running) {
    console.error('Error: Process exited before tests finished running');

    const currentTest = QUnit.config.current;
    if (currentTest && currentTest.pauses.size > 0) {
      const name = currentTest.testName;
      console.error('Last test to run (' + name + ') has an async hold. '
        + 'Ensure all assert.async() callbacks are invoked and Promises resolve. '
        + 'You should also set a standard timeout via QUnit.config.testTimeout.');
    }
  }
}

async function run (args, options) {
  // Default to non-zero exit code to avoid false positives
  process.exitCode = 1;

  const files = utils.getFilesFromArgs(args);

  if (options.filter) {
    globalThis.qunit_config_filter = options.filter;
  }
  if (options.module) {
    globalThis.qunit_config_module = options.module;
  }
  if (options.seed) {
    globalThis.qunit_config_seed = options.seed;
  }
  if (!options.reporter && globalThis.qunit_config_reporters_tap === undefined && process.env.qunit_config_reporters_tap === undefined) {
    globalThis.qunit_config_reporters_tap = true;
  }

  // Replace any previous instance, e.g. in watch mode
  QUnit = globalThis.QUnit = requireQUnit();

  if (QUnit.config.seed) {
    console.log(`Running tests with seed: ${QUnit.config.seed}`);
  }

  options.requires.forEach(requireFromCWD);

  if (options.reporter) {
    const reporter = findReporter(options.reporter, QUnit.reporters);
    if (!reporter.init) {
      utils.error(`Reporter "${options.reporter}" must define an init function.\nhttps://qunitjs.com/api/callbacks/QUnit.on/#reporter-api`);
    }
    reporter.init(QUnit);
  }

  for (let i = 0; i < files.length; i++) {
    const filePath = path.resolve(process.cwd(), files[i]);
    delete require.cache[filePath];

    // Node.js 12.0.0 has node_module_version=72
    // https://nodejs.org/en/download/releases/
    const nodeVint = process.config.variables.node_module_version;

    try {
      // QUnit supports passing ESM files to the 'qunit' command when used on
      // Node.js 12 or later. The dynamic import() keyword supports both CommonJS files
      // (.js, .cjs) and ESM files (.mjs), so we in theory we'd want to use that
      // unconditionally on, regardless of the file type.
      //
      // But:
      // - Plugins and CLI bootstrap scripts may be hooking into require.extensions to modify
      //   or transform code as it gets loaded. For compatibility with that, we should
      //   support that until at least QUnit 3.0.
      // - File extensions are not sufficient to differentiate between CJS and ESM.
      //   Use of ".mjs" is optional, as a package may configure Node to default to ESM
      //   and optionally use ".cjs" for CJS files.
      // - import() tends to obscure the location of a SyntaxError
      //   https://github.com/nodejs/node/issues/49441
      //
      // https://nodejs.org/docs/v12.7.0/api/modules.html#modules_addenda_the_mjs_extension
      // https://nodejs.org/docs/v12.7.0/api/esm.html#esm_code_import_code_expressions
      // https://github.com/qunitjs/qunit/issues/1465
      //
      // And, Node.js v23.0.0 (v22.12.0, v20.19.0) changed this again by introducing
      // support for trivial/synchronous ESM in require() *and* changing the error
      // code for non-trivial ESM modes to "ERR_REQUIRE_ASYNC_MODULE".
      //
      // https://nodejs.org/docs/latest/api/errors.html#err_require_esm
      // https://github.com/nodejs/node/pull/51977
      try {
        require(filePath);
      } catch (e) {
        if (
          (
            e.code === 'ERR_REQUIRE_ESM'
            || e.code === 'ERR_REQUIRE_ASYNC_MODULE'
            || (
              e instanceof SyntaxError
              && e.message === 'Cannot use import statement outside a module')
          )
          && (!nodeVint || nodeVint >= 72)
        ) {
          // filePath is an absolute file path here (per path.resolve above).
          // On Windows, Node.js enforces that absolute paths via ESM use valid URLs,
          // e.g. file-protocol) https://github.com/qunitjs/qunit/issues/1667
          await import(url.pathToFileURL(filePath));
        } else {
          throw e;
        }
      }
    } catch (e) {
      const error = new Error(`Failed to load file ${files[i]}\n${e.name}: ${e.message}`);
      error.stack = e.stack;
      QUnit.onUncaughtException(error);
    }
  }

  // Handle the unhandled
  process.on('unhandledRejection', onUnhandledRejection);
  process.on('uncaughtException', onUncaughtException);

  running = true;
  process.on('exit', onExit);

  QUnit.on('error', function (_error) {
    // Set exitCode directly, to make sure it is set to fail even if "runEnd" will never be
    // reached, or if "runEnd" was already fired in the past and the process crashed later.
    process.exitCode = 1;
  });

  QUnit.on('runEnd', function setExitCode (data) {
    running = false;

    if (data.testCounts.failed) {
      process.exitCode = 1;
    } else {
      process.exitCode = 0;
    }
  });

  QUnit.start();
}

run.restart = function restart (args, options) {
  clearTimeout(restartDebounceTimer);

  restartDebounceTimer = setTimeout(() => {
    changedPendingPurge.forEach(file => delete require.cache[path.resolve(file)]);
    changedPendingPurge.length = 0;

    if (QUnit.config.queue.length) {
      console.log('Finishing current test and restarting...');
    } else {
      console.log('Restarting...');
    }

    abort(() => run(args, options));
  }, DEBOUNCE_RESTART_LENGTH);
};

function abort (callback) {
  function clearQUnit () {
    process.off('unhandledRejection', onUnhandledRejection);
    process.off('uncaughtException', onUncaughtException);
    process.off('exit', onExit);
    running = false;

    delete globalThis.QUnit;
    QUnit = null;
    if (callback) {
      callback();
    }
  }

  QUnit.config._pq.abort();
  QUnit.on('runEnd', clearQUnit);
}

run.watch = function watch (args, options) {
  const watch = require('node-watch');
  const baseDir = process.cwd();

  requireQUnit();
  options.requires.forEach(requireFromCWD);

  // Include TypeScript when in use (automatically via require.extensions),
  // https://github.com/qunitjs/qunit/issues/1669.
  //
  // Include ".json" (part of require.extensions) for test suites that use a data files,
  // and for changes to package.json that may affect how a file is parsed (e.g. type=module).
  //
  // Include ".cjs" and ".mjs", which Node.js doesn't expose via require.extensions by default.
  //
  // eslint-disable-next-line n/no-deprecated-api
  const includeExts = Object.keys(require.extensions).concat(['.cjs', '.mjs']);
  const ignoreDirs = ['.git', 'node_modules'];

  const watcher = watch(baseDir, {
    persistent: true,
    recursive: true,

    // Bare minimum delay, we have another debounce in restart().
    delay: DEBOUNCE_WATCH_LENGTH,
    filter: (fullpath, skip) => {
      if (/\/node_modules\//.test(fullpath)
        || ignoreDirs.includes(path.basename(fullpath))
      ) {
        return skip;
      }
      return includeExts.includes(path.extname(fullpath));
    }
  }, (event, fullpath) => {
    console.log(`File ${event}: ${path.relative(baseDir, fullpath)}`);
    changedPendingPurge.push(fullpath);
    run.restart(args, options);
  });

  watcher.on('ready', () => {
    run(args, options);
  });

  function stop () {
    console.log('Stopping QUnit...');

    watcher.close();
    abort(() => {
      process.exit();
    });
  }

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
};

module.exports = run;
