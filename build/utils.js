'use strict';

const cp = require('child_process');
const fs = require('fs');
const stream = require('stream');

/**
 * Skip distracting trace for simple command-line mistakes.
 *
 * Implement Symbol.for('nodejs.util.inspect.custom'), instead of extending Error,
 * as there appears to be no way to prevent console.error/util.inspect/util.format
 * from appending a stacktrace without causing other unwanted output.
 *
 * @see https://nodejs.org/api/util.html#utilinspectcustom
 */
class CommandError {
  constructor (message) {
    this.message = message;
  }

  toString () {
    return this.message;
  }

  [Symbol.for('nodejs.util.inspect.custom')] () {
    return this.message;
  }
}

function getDiff (from, to, options = {}) {
  // macOS 10.15+ comes with GNU diff (2.8)
  // https://unix.stackexchange.com/a/338960/37512
  // https://stackoverflow.com/a/41770560/319266
  const gnuDiffVersion = cp.execFileSync('diff', ['--version'], { encoding: 'utf8' });
  const versionStr = /diff.* (\d+\.\d+)/.exec(gnuDiffVersion);
  const isOld = (versionStr && Number(versionStr[1]) < 3.4);

  try {
    cp.execFileSync('diff', [
      ...(options.ignoreWhitespace !== false ? ['-w'] : []),
      '--text',
      '--unified',
      ...(isOld ? [] : ['--color=always']),
      from,
      to
    ], { encoding: 'utf8' });
  } catch (e) {
    // Expected, `diff` command yields non-zero exit status if files differ
    return e.stdout;
  }
  if (options.allowUnchanged) {
    return null;
  }
  throw new Error(`Unable to diff between ${from} and ${to}`);
}

async function download (url) {
  const resp = await fetch(url);
  return await resp.text();
}

async function downloadFile (url, dest) {
  const fileStr = fs.createWriteStream(dest);

  const resp = await fetch(url);
  const respStr = stream.Readable.fromWeb(resp.body);
  respStr.pipe(fileStr);
  return new Promise((resolve) => {
    fileStr.on('finish', () => fileStr.close(resolve));
  });
}

function cleanDir (dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { force: true, recursive: true });
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

function isValidVersion (version) {
  return /^\d+\.\d+\.\d+(-alpha\.\d+)?$/.test(version);
}

const versionAnywhereRegPattern = '\\d+\\.\\d+\\.\\d+(-alpha\\.\\d+)?';

// Turn invisible chars and non-ASCII chars into escape sequences.
//
// This is like `cat --show-nonprinting` and makes diffs easier to understand
// when e.g. there is an added/removed line with a Window-style CRLF which
// would otherwise look the same in both lines.
function verboseNonPrintable (str) {
  // Match all chars that are not printable ASCII,
  // except \t (U+0009) and \n (U+000A).
  return str.replace(/[^\t\n\u0020-\u007F]/g, function (m) {
    return `U+${m.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`;
  });
}

function normalizeEOL (str) {
  return str.replace(/\r\n/g, '\n');
}

module.exports = {
  CommandError,
  getDiff,
  download,
  downloadFile,
  cleanDir,
  isValidVersion,
  versionAnywhereRegPattern,
  verboseNonPrintable,
  normalizeEOL
};
