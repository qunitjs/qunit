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

async function run (args, options) {
  // Default to non-zero exit code to avoid false positives
  process.exitCode = 1;

  const files = utils.getFilesFromArgs(args);

  QUnit = requireQUnit();

  if (options.filter) {
    QUnit.config.filter = options.filter;
  }

  if (options.module) {
    QUnit.config.module = options.module;
  }

  const seed = options.seed;
  if (seed) {
    if (seed === true) {
      QUnit.config.seed = Math.random().toString(36).slice(2);
    } else {
      QUnit.config.seed = seed;
    }

    console.log(`Running tests with seed: ${QUnit.config.seed}`);
  }

  // TODO: Enable mode where QUnit is not auto-injected, but other setup is
  // still done automatically.
  global.QUnit = QUnit;

  options.requires.forEach(requireFromCWD);

  findReporter(options.reporter, QUnit.reporters).init(QUnit);

  for (let i = 0; i < files.length; i++) {
    const filePath = path.resolve(process.cwd(), files[i]);
    delete require.cache[filePath];

    // Node.js 12.0.0 has node_module_version=72
    // https://nodejs.org/en/download/releases/
    const nodeVint = process.config.variables.node_module_version;

    try {
      // QUnit supports passing ESM files to the 'qunit' command when used on
      // Node.js 12 or later. The dynamic import() keyword supports both CommonJS files
      // (.js, .cjs) and ESM files (.mjs), so we could simply use that unconditionally on
      // newer Node versions, regardless of the given file path.
      //
      // But:
      // - Node.js 12 emits a confusing "ExperimentalWarning" when using import(),
      //   even if just to load a non-ESM file. So we should try to avoid it on non-ESM.
      // - This Node.js feature is still considered experimental so to avoid unexpected
      //   breakage we should continue using require(). Consider flipping once stable and/or
      //   as part of QUnit 3.0.
      // - Plugins and CLI bootstrap scripts may be hooking into require.extensions to modify
      //   or transform code as it gets loaded. For compatibility with that, we should
      //   support that until at least QUnit 3.0.
      // - File extensions are not sufficient to differentiate between CJS and ESM.
      //   Use of ".mjs" is optional, as a package may configure Node to default to ESM
      //   and optionally use ".cjs" for CJS files.
      //
      // https://nodejs.org/docs/v12.7.0/api/modules.html#modules_addenda_the_mjs_extension
      // https://nodejs.org/docs/v12.7.0/api/esm.html#esm_code_import_code_expressions
      // https://github.com/qunitjs/qunit/issues/1465
      try {
        require(filePath);
      } catch (e) {
        if (
          (e.code === 'ERR_REQUIRE_ESM' ||
          (e instanceof SyntaxError &&
            e.message === 'Cannot use import statement outside a module')) &&
          (!nodeVint || nodeVint >= 72)
        ) {
          // filePath is an absolute file path here (per path.resolve above).
          // On Windows, Node.js enforces that absolute paths via ESM use valid URLs,
          // e.g. file-protocol) https://github.com/qunitjs/qunit/issues/1667
          await import(url.pathToFileURL(filePath)); // eslint-disable-line node/no-unsupported-features/es-syntax
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
  process.on('unhandledRejection', (reason, _promise) => {
    QUnit.onUncaughtException(reason);
  });
  process.on('uncaughtException', (error, _origin) => {
    QUnit.onUncaughtException(error);
  });

  let running = true;
  process.on('exit', function () {
    if (running) {
      console.error('Error: Process exited before tests finished running');

      const currentTest = QUnit.config.current;
      if (currentTest && currentTest.pauses.size > 0) {
        const name = currentTest.testName;
        console.error('Last test to run (' + name + ') has an async hold. ' +
          'Ensure all assert.async() callbacks are invoked and Promises resolve. ' +
          'You should also set a standard timeout via QUnit.config.testTimeout.');
      }
    }
  });

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

run.restart = function (args) {
  clearTimeout(this._restartDebounceTimer);

  this._restartDebounceTimer = setTimeout(() => {
    changedPendingPurge.forEach(file => delete require.cache[path.resolve(file)]);
    changedPendingPurge.length = 0;

    if (QUnit.config.queue.length) {
      console.log('Finishing current test and restarting...');
    } else {
      console.log('Restarting...');
    }

    run.abort(() => run.apply(null, args));
  }, DEBOUNCE_RESTART_LENGTH);
};

run.abort = function (callback) {
  function clearQUnit () {
    delete global.QUnit;
    QUnit = null;
    if (callback) {
      callback();
    }
  }

  if (QUnit.config.queue.length) {
    const nextTestIndex = QUnit.config.queue.findIndex(fn => fn.name === 'runTest');
    QUnit.config.queue.splice(nextTestIndex);
    QUnit.on('runEnd', clearQUnit);
  } else {
    clearQUnit();
  }
};

run.watch = function watch (_, options) {
  const watch = require('node-watch');
  const args = Array.prototype.slice.call(arguments);
  const baseDir = process.cwd();

  QUnit = requireQUnit();
  global.QUnit = QUnit;
  options.requires.forEach(requireFromCWD);

  // Include TypeScript when in use (automatically via require.extensions),
  // https://github.com/qunitjs/qunit/issues/1669.
  //
  // Include ".json" (part of require.extensions) for test suites that use a data files,
  // and for changes to package.json that may affect how a file is parsed (e.g. type=module).
  //
  // Include ".cjs" and ".mjs", which Node.js doesn't expose via require.extensions by default.
  //
  // eslint-disable-next-line node/no-deprecated-api
  const includeExts = Object.keys(require.extensions).concat(['.cjs', '.mjs']);
  const ignoreDirs = ['.git', 'node_modules'];

  const watcher = watch(baseDir, {
    persistent: true,
    recursive: true,

    // Bare minimum delay, we have another debounce in run.restart().
    delay: DEBOUNCE_WATCH_LENGTH,
    filter: (fullpath, skip) => {
      if (/\/node_modules\//.test(fullpath) ||
        ignoreDirs.includes(path.basename(fullpath))
      ) {
        return skip;
      }
      return includeExts.includes(path.extname(fullpath));
    }
  }, (event, fullpath) => {
    console.log(`File ${event}: ${path.relative(baseDir, fullpath)}`);
    changedPendingPurge.push(fullpath);
    run.restart(args);
  });

  watcher.on('ready', () => {
    run.apply(null, args);
  });

  function stop () {
    console.log('Stopping QUnit...');

    watcher.close();
    run.abort(() => {
      process.exit();
    });
  }

  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
};

module.exports = run;
