'use strict';

const path = require('path');
const fsPromises = require('fs').promises;
const glob = require('tiny-glob/sync');
const { execute } = require('./execute.js');

const NAME_DIRECTIVE = '# name: ';
const CMD_DIRECTIVE = '# command: ';

async function parseFixture (file) {
  const contents = await fsPromises.readFile(file, 'utf8');
  const lines = contents.split('\n');
  if (!lines[0].startsWith(NAME_DIRECTIVE)) {
    throw new Error('Name declaration missing');
  }
  const name = lines[0].slice(NAME_DIRECTIVE.length);
  if (!lines[1].startsWith(CMD_DIRECTIVE)) {
    throw new Error('Command declaration missing');
  }
  const command = JSON.parse(lines[1].slice(CMD_DIRECTIVE.length));
  return {
    name,
    command,
    expected: lines.slice(2).join('\n').trim()
  };
}

function readFixtures (dir) {
  const fixtures = {};

  for (const file of glob('*.tap.txt', { cwd: dir, absolute: true })) {
    fixtures[path.basename(file, '.tap.txt')] = async function runFixture () {
      const fixture = await parseFixture(file);
      const result = await execute(fixture.command);
      return {
        expected: fixture.expected,
        snapshot: result.snapshot
      };
    };
  }

  return fixtures;
}

module.exports = {
  readFixtures
};
