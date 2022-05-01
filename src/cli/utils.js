'use strict';

const fs = require('fs');
const path = require('path');

const glob = require('tiny-glob/sync');

function existsStat () {
  try {
    return fs.statSync.apply(fs, arguments);
  } catch (e) {
    return null;
  }
}

function getIgnoreList (baseDir) {
  const gitFilePath = path.join(baseDir, '.gitignore');
  if (fs.existsSync(gitFilePath)) {
    const gitIgnore = fs.readFileSync(gitFilePath, 'utf8');

    // Account for Windows-style line endings
    return gitIgnore.trim().split(/\r?\n/);
  }
  return [];
}

function getFilesFromArgs (args) {
  const patterns = args.slice();

  // Default to files in the test directory
  if (!patterns.length) {
    // TODO: In QUnit 3.0, change the default to {js,mjs}
    patterns.push('test/**/*.js');
  }

  const files = new Set();

  // For each of the potential globs, we check if it is a directory path and
  // update it so that it matches the JS files in that directory.
  patterns.forEach(pattern => {
    const stat = existsStat(pattern);

    if (stat && stat.isFile()) {
      // Optimisation:
      // For non-glob simple files, skip (slow) directory-wide scanning.
      // https://github.com/qunitjs/qunit/pull/1385
      files.add(pattern);
    } else {
      if (stat && stat.isDirectory()) {
        // TODO: In QUnit 3.0, change the default to {js,mjs}
        pattern = `${pattern}/**/*.js`;
      }
      const results = glob(pattern, {
        cwd: process.cwd(),
        filesOnly: true,
        flush: true
      });
      for (const result of results) {
        files.add(result);
      }
    }
  });

  if (!files.size) {
    error('No files were found matching: ' + args.join(', '));
  }

  return Array.from(files).sort();
}

function error (message) {
  console.error(message);
  process.exit(1);
}

module.exports = {
  error,
  getFilesFromArgs,
  getIgnoreList
};
