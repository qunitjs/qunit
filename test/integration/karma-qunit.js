const cp = require('child_process');
const path = require('path');
const DIR = path.join(__dirname, 'karma-qunit');

function normalize (str) {
  return str
    .replace(/^.*:INFO/gm, 'INFO')
    .replace(/(Karma|Firefox) \S+/g, '$1')
    .replace(/(Firefox) \([^)]*\)/g, '$1')
    .replace(/(started at|on socket|SUCCESS) .*$/gm, '$1')
    .replace(/^\s+/gm, '  ');
}

QUnit.module('karma-qunit', {
  before: () => {
    // Need --legacy-peer-deps under npm 7 for "file:" override in package.json.
    // Once CI and dev environments are on npm 8, consider using native "overrides".
    cp.execSync('npm install --prefer-offline --no-audit --no-dev --legacy-peer-deps', { cwd: DIR, encoding: 'utf8' });
  }
});

QUnit.test('passing test', assert => {
  const expected = `
INFO [karma-server]: Karma server started at
INFO [launcher]: Launching browsers FirefoxHeadless with concurrency unlimited
INFO [launcher]: Starting browser FirefoxHeadless
INFO [Firefox]: Connected on socket
...
Firefox: Executed 3 of 3 SUCCESS
`.trim();
  const actual = normalize(
    cp.execSync('npm test', { cwd: DIR, env: { PATH: process.env.PATH }, encoding: 'utf8' })
  );
  assert.pushResult({ result: actual.includes(expected), actual, expected });
});

QUnit.test.each('failing test', {
  assert: ['fail-assert.js', `
Firefox  example FAILED
  some message
  Expected: true
  Actual: false
  @fail-assert.js:2:10`
  ],
  'global-error': ['fail-global-error.js', `
Firefox  example FAILED
  Died on test #1: boom is not defined
  @fail-global-error.js:1:7`
  ]
}, (assert, [file, expected]) => {
  try {
    const ret = cp.execSync('npm test', {
      cwd: DIR,
      env: {
        PATH: process.env.PATH,
        KARMA_FILES: file
      },
      encoding: 'utf8'
    });
    assert.equal(ret, null);
  } catch (e) {
    const actual = normalize(e.stdout);
    assert.pushResult({ result: actual.includes(expected), actual, expected });
    assert.true(e.status > 0, 'non-zero exit code');
  }
});
