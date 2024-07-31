// Helper to create the QUnit release commit,
// and prepare a local commit in a codeorigin.git clone.
//
// To test the codeorigin step with an alternate remote,
// pass "test" as the second argument.
//
// See also RELEASE.md.
//
// Inspired by <https://github.com/jquery/jquery-release>.

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const { CommandError, isValidVersion } = require('./utils.js');

const cdnRemotes = {
  anonymous: 'https://github.com/jquery/codeorigin.jquery.com.git',
  auth: 'git@github.com:jquery/codeorigin.jquery.com.git'
};
const cdnFiles = {
  'qunit/qunit.js': 'cdn/qunit/qunit-@VERSION.js',
  'qunit/qunit.css': 'cdn/qunit/qunit-@VERSION.css'
};
const cdnCommitMessage = 'qunit: Added version @VERSION';

function parseLineResults (output = '') {
  output = output.trim();
  return !output ? [] : output.split('\n');
}

function versionAddedString (version) {
  return `version_added: "${version}"`;
}

function versionDeprecatedString (version) {
  return `version_deprecated: "${version}"`;
}

function versionRemovedString (version) {
  return `version_removed: "${version}"`;
}

function formatChangelogColumn (version) {
  return `[QUnit ${version}](https://github.com/qunitjs/qunit/releases/tag/${version})`;
}

const Repo = {
  async prep (version) {
    if (typeof version !== 'string' || !isValidVersion(version)) {
      throw new CommandError('Invalid or missing version argument');
    }
    if (!version.includes('-alpha')) {
      const UNRELEASED_ADDED = versionAddedString('unreleased');
      const UNRELEASED_DEP = versionDeprecatedString('unreleased');
      const UNRELEASED_RM = versionRemovedString('unreleased');
      const UNRELEASED_CONTENT = /\bUNRELEASED\b/g;

      // Silence error from grep, which exits non-zero if no results.
      const results = parseLineResults(cp.execSync(
        'git grep --full-name --name-only -i unreleased docs/ || echo',
        { encoding: 'utf8' }
      ));
      results.forEach(filePath => {
        const doc = fs.readFileSync(filePath, 'utf8');
        fs.writeFileSync(filePath,
          doc
            .replace(UNRELEASED_ADDED, versionAddedString(version))
            .replace(UNRELEASED_DEP, versionDeprecatedString(version))
            .replace(UNRELEASED_RM, versionRemovedString(version))
            .replace(UNRELEASED_CONTENT, formatChangelogColumn(version))
        );
      });
    }
    {
      const file = 'History.md';
      console.log(`Updating ${file}...`);

      const filePath = path.join(__dirname, '..', file);
      const oldContent = fs.readFileSync(filePath, 'utf8');
      const oldVersion = require('../package.json').version;

      const changeFilter = [
        /^\* Release \d+\./,
        /^\* Build: /,
        /^\* Docs: /,
        /^\* Test: /,
        /^\* Tests: /
      ];
      let changes = cp.execFileSync('git', [
        'log',
        '--format=* %s. (%aN)',
        '--no-merges',
        `${oldVersion}...HEAD`
      ], { encoding: 'utf8' });

      changes = parseLineResults(changes)
        .filter(line => !changeFilter.some(filter => filter.test(line)))
        .map(line => {
          return {
            component: line.replace(/^\* ([^:]+):.*$/, '$1'),
            line
          };
        })
        .sort()
        .map(change => change.line)
        .join('\n') + '\n';

      const today = new Date().toISOString().slice(0, 10);
      const newSection = `\n${version} / ${today}
        ==================

        ### Added

        ### Changed

        ### Deprecated

        ### Fixed

        ### Removed

        `.replace(/^[ \t]*/gm, '');

      fs.writeFileSync(filePath, newSection + changes + oldContent);
    }
    {
      const file = 'package-lock.json';
      console.log(`Updating ${file}...`);
      const filePath = path.join(__dirname, '..', file);
      const json = fs.readFileSync(filePath, 'utf8');
      const packageIndentation = json.match(/\n([\t\s]+)/)[1];
      const data = JSON.parse(json);

      data.version = data.packages[''].version = version;

      fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, packageIndentation) + '\n'
      );
    }
    {
      const file = 'AUTHORS.txt';
      console.log(`Updating ${file}...`);
      cp.execSync(
        require('../package.json').scripts.authors,
        { encoding: 'utf8' }
      );
    }
  },
  buildFiles (version) {
    if (typeof version !== 'string' || !isValidVersion(version)) {
      throw new CommandError('Invalid or missing version argument');
    }
    {
      const file = 'package.json';
      console.log(`Updating ${file}...`);
      const filePath = path.join(__dirname, '..', file);
      const json = fs.readFileSync(filePath, 'utf8');
      const packageIndentation = json.match(/\n([\t\s]+)/)[1];
      const data = JSON.parse(json);

      data.version = version;

      fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, packageIndentation) + '\n'
      );
    }
    {
      console.log('Running `npm run build`...');
      process.env.QUNIT_BUILD_RELEASE = '1';
      cp.execFileSync('npm', [
        'run',
        'build'
      ], { encoding: 'utf8' });
    }
  },
  cdnClone (repoPath) {
    const remote = cdnRemotes.anonymous;
    console.log('... cloning ' + remote);
    fs.rmSync(repoPath, { recursive: true, force: true });
    cp.execFileSync('git', [
      'clone',
      '--depth=5',
      '-q',
      remote,
      repoPath
    ]);
  },
  cdnCommit (version) {
    if (!version) {
      throw new CommandError('Missing parameters');
    }
    const repoPath = path.join(__dirname, '..', '__codeorigin');
    Repo.cdnClone(repoPath);

    const toCommit = [];
    for (const src in cdnFiles) {
      const srcPath = path.join(__dirname, '..', src);
      const dest = cdnFiles[src].replace('@VERSION', version);
      const destPath = path.join(repoPath, dest);
      console.log('... copying ' + src + ' to ' + dest);
      fs.copyFileSync(srcPath, destPath, fs.constants.COPYFILE_EXCL);
      toCommit.push(dest);
    }

    console.log('... creating commit');

    const author = cp.execSync('git log -1 --format=%aN%n%aE',
      { encoding: 'utf8', cwd: path.join(__dirname, '..') }
    )
      .trim()
      .split('\n');

    cp.execFileSync('git', ['add', ...toCommit],
      { cwd: repoPath }
    );

    cp.execFileSync('git',
      ['commit', '-m', cdnCommitMessage.replace('@VERSION', version)],
      {
        cwd: repoPath,
        env: {
          GIT_AUTHOR_NAME: author[0],
          GIT_AUTHOR_EMAIL: author[1],
          GIT_COMMITTER_NAME: author[0],
          GIT_COMMITTER_EMAIL: author[1]
        }
      }
    );

    // prepre for user to push from the host shell after review
    cp.execFileSync('git', ['remote', 'set-url', 'origin', cdnRemotes.auth],
      { cwd: repoPath }
    );
  }
};

const [version, remote] = process.argv.slice(2);

(async function main () {
  await Repo.prep(version);
  Repo.buildFiles(version);
  Repo.cdnCommit(version, remote || 'real');
}()).catch(e => {
  if (e.stderr) {
    e.stdout = e.stdout.toString();
    e.stderr = e.stderr.toString();
  }
  console.error(e);
  process.exit(1);
});
