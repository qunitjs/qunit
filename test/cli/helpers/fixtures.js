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
  const name = (lines[0].startsWith(NAME_DIRECTIVE))
    ? lines.shift().slice(NAME_DIRECTIVE.length)
    : path.basename(file);
  if (!lines[0].startsWith(CMD_DIRECTIVE)) {
    throw new Error(`Missing command declaration in ${path.basename(file)}`);
  }
  const command = JSON.parse(lines[0].slice(CMD_DIRECTIVE.length));

  return {
    name,
    command,
    expected: lines.slice(1).join('\n').trim()
  };
}

function readFixtures (dir) {
  const fixtures = {};

  for (const file of glob('*.tap.txt', { cwd: dir, absolute: true })) {
    fixtures[path.basename(file, '.tap.txt')] = async function runFixture () {
      const fixture = await parseFixture(file);
      const result = await execute(fixture.command);
      return {
        name: fixture.name,
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
