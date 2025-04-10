'use strict';

const path = require('path');
const fsPromises = require('fs').promises;
const glob = require('tiny-glob/sync');
const { execute } = require('./execute.js');

const NAME_DIRECTIVE = '# name: ';
const CMD_DIRECTIVE = '# command: ';
const ENV_DIRECTIVE = '# env: ';

async function parseFixture (file) {
  const contents = await fsPromises.readFile(file, 'utf8');
  const lines = contents.split('\n');
  const name = (lines[0].startsWith(NAME_DIRECTIVE))
    ? lines.shift().slice(NAME_DIRECTIVE.length)
    : path.basename(file);
  if (!lines[0].startsWith(CMD_DIRECTIVE)) {
    throw new Error(`Missing command declaration in ${path.basename(file)}`);
  }
  const command = JSON.parse(lines.shift().slice(CMD_DIRECTIVE.length));
  const env = (lines[0].startsWith(ENV_DIRECTIVE))
    ? JSON.parse(lines.shift().slice(ENV_DIRECTIVE.length))
    : undefined;

  return {
    name,
    command,
    env,
    expected: lines.join('\n').trim()
  };
}

function readFixtures (dir) {
  const fixtures = {};

  for (const file of glob('*.tap.txt', { cwd: dir, absolute: true })) {
    fixtures[path.basename(file, '.tap.txt')] = async function runFixture () {
      const fixture = await parseFixture(file);
      const result = await execute(fixture.command, { env: fixture.env });
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
