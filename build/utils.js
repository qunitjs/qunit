const cp = require('child_process');
const fs = require('fs');
const https = require('https');

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
  throw new Error(`Unable to diff between ${from} and ${to}`);
}

async function download (url) {
  return new Promise((resolve, reject) => {
    https.get(url, async resp => {
      try {
        const chunks = [];
        for await (const chunk of resp) {
          chunks.push(Buffer.from(chunk));
        }
        resolve(Buffer.concat(chunks).toString('utf8'));
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function downloadFile (url, dest) {
  const fileStr = fs.createWriteStream(dest);
  return new Promise((resolve, reject) => {
    https.get(url, resp => {
      resp.pipe(fileStr);
      fileStr.on('finish', () => fileStr.close(resolve));
    }).on('error', err => reject(err));
  });
}

function cleanDir (dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmdirSync(dirPath, { recursive: true });
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

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
  getDiff,
  download,
  downloadFile,
  cleanDir,
  verboseNonPrintable,
  normalizeEOL
};
