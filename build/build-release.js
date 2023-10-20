// Helper to set the QUnit release version in various places,
// and prepare a local commit in a codeorigin.git clone.
//
// To test the local commit step, with an alternate remote
// pass "test" as the second argument.
//
// See also RELEASE.md.
//
// Inspired by <https://github.com/jquery/jquery-release>.

const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const cdnRemotes = {
  anonymous: 'https://github.com/jquery/codeorigin.jquery.com.git',
  auth: 'git@github.com:jquery/codeorigin.jquery.com.git'
};
const cdnFiles = {
  'qunit/qunit.js': 'cdn/qunit/qunit-@VERSION.js',
  'qunit/qunit.css': 'cdn/qunit/qunit-@VERSION.css'
};
const cdnCommitMessage = 'qunit: Added version @VERSION';

const Repo = {
  buildFiles (version) {
    if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) {
      throw new Error('Invalid or missing version argument');
    }
    {
      const file = 'bower.json';
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
      const file = 'package.json';
      console.log(`Updating ${file}...`);
      const filePath = path.join(__dirname, '..', file);
      const json = fs.readFileSync(filePath, 'utf8');
      const packageIndentation = json.match(/\n([\t\s]+)/)[1];
      const data = JSON.parse(json);

      data.version = version;
      data.author.url = data.author.url.replace('main', version);

      fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, packageIndentation) + '\n'
      );
    }
    {
      console.log('Running `npm run build`...');
      cp.execFileSync('npm', [
        'run',
        'build'
      ], { encoding: 'utf8' });
    }
  },
  cdnClone (repoPath) {
    const remote = cdnRemotes.anonymous;
    console.log('... cloning ' + remote);
    if (fs.existsSync(repoPath)) {
      fs.rmdirSync(repoPath, { recursive: true });
    }
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
      throw new Error('Missing parameters');
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

try {
  Repo.buildFiles(version);
  Repo.cdnCommit(version, remote || 'real');
} catch (e) {
  if (e.stderr) {
    e.stdout = e.stdout.toString();
    e.stderr = e.stderr.toString();
  }
  console.error(e);
  process.exit(1);
}
