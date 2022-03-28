// Helper to commit QUnit releases to the CDN repository.
//
// See also RELEASE.md.
//
// Inspired by <https://github.com/jquery/jquery-release>.

const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const remotes = {
  real: 'git@github.com:jquery/codeorigin.jquery.com.git',
  test: 'git@github.com:jquery/fake-cdn.git'
};
const files = {
  'qunit/qunit.js': 'cdn/qunit/qunit-@VERSION.js',
  'qunit/qunit.css': 'cdn/qunit/qunit-@VERSION.css'
};
const commitMessage = 'qunit: Added version @VERSION';

const Cdn = {
  clone (remoteKey, repoPath) {
    const remote = remotes[remoteKey];
    if (!remote) {
      throw new Error('Unknown remote ' + remoteKey);
    }
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
  commit (remoteKey, version) {
    if (!remoteKey || !version) {
      throw new Error(
        'Parameters are <remote> <version>\n\n ' +
          '<remote>  One of "test" or "real".\n ' +
          '<version> E.g. "1.2.3".\n\nExample: node auth-cdn-push.js test 2.4.0\n'
      );
    }
    const repoPath = path.join(__dirname, '..', '__codeorigin');
    Cdn.clone(remoteKey, repoPath);

    const toCommit = [];
    for (const src in files) {
      const srcPath = path.join(__dirname, '..', src);
      const dest = files[src].replace('@VERSION', version);
      const destPath = path.join(repoPath, dest);
      console.log('... copying ' + src + ' to ' + dest);
      if (remoteKey === 'test') {
        const destParent = path.dirname(destPath);
        fs.mkdirSync(destParent, { recursive: true });
      }
      fs.copyFileSync(srcPath, destPath, fs.constants.COPYFILE_EXCL);
      toCommit.push(dest);
    }

    console.log('... creating commit');
    cp.execFileSync('git', [
      'add',
      ...toCommit
    ], { cwd: repoPath });
    cp.execFileSync('git', [
      'commit',
      '-m',
      commitMessage.replace('@VERSION', version)
    ], { cwd: repoPath });
  }
};

const [remote, version] = process.argv.slice(2);

try {
  Cdn.commit(remote, version);
} catch (e) {
  console.error(e.toString());
  process.exit(1);
}
