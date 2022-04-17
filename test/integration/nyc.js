const cp = require('child_process');
const path = require('path');
const DIR = path.join(__dirname, 'nyc');

QUnit.module('nyc', {
  before: () => {
    cp.execSync('npm install --prefer-offline --no-audit', { cwd: DIR, encoding: 'utf8' });
  }
});

QUnit.test('test', assert => {
  const expected = `
TAP version 13
ok 1 add > two numbers
1..1
# pass 1
# skip 0
# todo 0
# fail 0
--------------|---------|----------|---------|---------|-------------------
File          | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
--------------|---------|----------|---------|---------|-------------------
All files     |   85.71 |      100 |      50 |   85.71 |                   
 nyc          |     100 |      100 |     100 |     100 |                   
  index.js    |     100 |      100 |     100 |     100 |                   
 nyc/src      |      75 |      100 |      50 |      75 |                   
  add.js      |     100 |      100 |     100 |     100 |                   
  subtract.js |      50 |      100 |       0 |      50 | 2                 
--------------|---------|----------|---------|---------|-------------------
`.trim();

  const actual = cp.execSync('npm test', { cwd: DIR, env: { PATH: process.env.PATH }, encoding: 'utf8' });
  assert.pushResult({ result: actual.includes(expected), actual, expected });
});
