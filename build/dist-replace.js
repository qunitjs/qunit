// Helper used for JS files by rollup.config.js,
// and for CSS files by Gruntfile.js via preprocess()
//
// Release builds should be deterministic and reproducible.
// If a date or timestamp is used, then honour SOURCE_DATE_EPOCH
// and update RELEASE.md as needed.
// <https://reproducible-builds.org/docs/source-date-epoch/>.
'use strict';

let distVersion = require('../package.json').version;

if (!process.env.QUNIT_BUILD_RELEASE) {
  // During development, include a timestamp.
  distVersion = distVersion.replace(/-.+$/, '')
    + '-dev ' + (new Date()).toISOString().replace(/:\d+\.\d+Z$/, 'Z');
}

const replacements = {

  // Normalize CRLF from fuzzysort.js.
  //
  // The way we upload files to npm, Git, and the jQuery CDN all normalize
  // CRLF to LF. Thus, if we don't do this ourselves during the build, then
  // reproducible build verification would find that the distribution is
  // not identical to the reproduced build artefact.
  '\r\n': '\n',

  // Embed version
  '@VERSION': distVersion
};

function preprocess (code) {
  for (const [find, replacement] of Object.entries(replacements)) {
    code = code.replace(find, replacement);
  }
  return code;
}

module.exports = {
  replacements,
  preprocess
};
