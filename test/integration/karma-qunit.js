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
    cp.execSync('npm install --prefer-offline --no-audit --omit=dev --legacy-peer-deps --update-notifier=false', { cwd: DIR, encoding: 'utf8' });
  }
});

QUnit.test.each('passing test', {
  basic: ['', `
INFO [karma-server]: Karma server started at
INFO [launcher]: Launching browsers FirefoxHeadless with concurrency unlimited
INFO [launcher]: Starting browser FirefoxHeadless
INFO [Firefox]: Connected on socket
...
Firefox: Executed 3 of 3 SUCCESS`
  ],
  config: ['pass-config.js', `
INFO [karma-server]: Karma server started at
INFO [launcher]: Launching browsers FirefoxHeadless with concurrency unlimited
INFO [launcher]: Starting browser FirefoxHeadless
INFO [Firefox]: Connected on socket
.
Firefox: Executed 1 of 1 SUCCESS`, { KARMA_QUNIT_CONFIG: '1' }
  ]
}, (assert, [file, expected, env = {}]) => {
  expected = expected.trim();
  let ret;
  try {
    ret = cp.execSync('npm test', {
      cwd: DIR,
      env: {
        PATH: process.env.PATH,
        KARMA_FILES: file,
        ...env
      },
      encoding: 'utf8'
    });
  } catch (e) {
    const actual = normalize(e.stdout);
    assert.pushResult({ result: false, actual, expected });
    return;
  }
  const actual = normalize(ret);
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
