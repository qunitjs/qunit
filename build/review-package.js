// Helper for reviewing build artefacts against a past release.
//
// See also RELEASE.md.
/* eslint-env node */
'use strict';

const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { CommandError, getDiff, downloadFile, cleanDir, isValidVersion } = require('./utils.js');

async function confirm (text) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  await new Promise((resolve, reject) => {
    rl.question(`${text} (y/N)> `, (answer) => {
      rl.close();
      if (String(answer).toLowerCase() === 'y') {
        resolve();
      } else {
        reject(new Error('Audit aborted'));
      }
    });
  });
}

const ReleaseAssets = {
  async audit (prevVersion) {
    if (typeof prevVersion !== 'string' || !isValidVersion(prevVersion)) {
      throw new CommandError('Invalid or missing version argument');
    }
    {
      cleanDir(path.join(__dirname, '../temp'));
    }
    {
      const file = 'package.json';
      console.log(`Auditing ${file}...`);

      const prevContent = cp.execFileSync('git', [
        'show',
        `${prevVersion}:package.json`
      ], { encoding: 'utf8' });
      const tempPrevPath = path.join(__dirname, '../temp', file);
      fs.writeFileSync(tempPrevPath, prevContent);

      const currentPath = path.join(__dirname, '..', file);
      const diff = getDiff(tempPrevPath, currentPath, { allowUnchanged: true });
      if (diff === null) {
        console.log(`${file} was unchanged...`);
      } else {
        process.stdout.write(diff);
        await confirm(`Accept ${file}?`);
      }
    }
    {
      const file = 'qunit.js';
      console.log(`Auditing ${file}...`);

      const prevUrl = `https://code.jquery.com/qunit/qunit-${prevVersion}.js`;
      const tempPrevPath = path.join(__dirname, '../temp', file);
      await downloadFile(prevUrl, tempPrevPath);

      const currentPath = path.join(__dirname, '../qunit', file);
      process.stdout.write(getDiff(tempPrevPath, currentPath));
      await confirm(`Accept ${file}?`);
    }
    {
      const file = 'qunit.css';
      console.log(`Auditing ${file}...`);

      const prevUrl = `https://code.jquery.com/qunit/qunit-${prevVersion}.css`;
      const tempPrevPath = path.join(__dirname, '../temp', file);
      await downloadFile(prevUrl, tempPrevPath);

      const currentPath = path.join(__dirname, '../qunit', file);
      process.stdout.write(getDiff(tempPrevPath, currentPath));
      await confirm(`Accept ${file}?`);
    }
  }
};

const prevVersion = process.argv[2];

(async function main () {
  await ReleaseAssets.audit(prevVersion);
}()).catch(e => {
  console.error(e.toString());
  process.exit(1);
});
