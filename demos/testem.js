const cp = require('child_process');
const path = require('path');
const DIR = path.join(__dirname, 'testem');

function normalize (str) {
  return str
    .trim()
    .replace(/(Firefox) [\d.]+/g, '$1')
    .replace(/(\d+ ms)/g, '0 ms');
}

QUnit.module('testem', {
  before: () => {
    // Let this be quick for re-runs
    cp.execSync('npm install --prefer-offline --no-audit --update-notifier=false', { cwd: DIR, encoding: 'utf8' });
  }
});

QUnit.test('passing test', assert => {
  const ret = cp.execSync('npm run -s test', { cwd: DIR, encoding: 'utf8' });
  assert.strictEqual(
    normalize(ret),
    `
ok 1 Firefox - [0 ms] - add: two numbers

1..1
# tests 1
# pass  1
# skip  0
# todo  0
# fail  0

# ok
    `.trim()
  );
});
