const cp = require('child_process');
const path = require('path');
const DIR = path.join(__dirname, 'grunt-contrib-qunit');

QUnit.module('grunt-contrib-qunit', {
  before: () => {
    // Let this be quick for re-runs
    cp.execSync('npm install --prefer-offline --no-audit', { cwd: DIR, encoding: 'utf8' });
  }
});

QUnit.test('passing tests', assert => {
  assert.expect(0);
  cp.execSync('npm test', { cwd: DIR });
});

QUnit.test.each('failing tests', {
  assert: ['fail-assert', `Testing fail-assert.html F
>> example
>> Message: some message
>> Actual: false
>> Expected: true
>>   at `],
  'no-tests': ['fail-no-tests', `Testing fail-no-tests.html F
>> global failure
>> Message: No tests were run.
>> Actual: undefined
>> Expected: undefined
>> Error: No tests were run.
>>     at `],
  // FIXME: Error line is off by one in Chrome, broke betweeen Puppeteer 9 and 21.
  uncaught: ['fail-uncaught', `Testing fail-uncaught.html \n\
>> ReferenceError: boom is not defined
>>     at file:fail-uncaught.html:15`]
}, (assert, [command, expected]) => {
  try {
    const ret = cp.execSync('node_modules/.bin/grunt qunit:' + command, {
      cwd: DIR,
      encoding: 'utf8',
      env: {
        CHROMIUM_FLAGS: process.env.CHROMIUM_FLAGS,
        CI: process.env.CI,
        PATH: process.env.PATH,
        PUPPETEER_DOWNLOAD_PATH: process.env.PUPPETEER_DOWNLOAD_PATH
      }
    });
    assert.equal(ret, null);
  } catch (e) {
    const actual = e.stdout.replace(/at .*[/\\]([^/\\]+\.html)(:\d+)?.*$/gm, 'at file:$1$2');
    assert.pushResult({ result: actual.includes(expected), actual, expected }, 'stdout');
    assert.true(e.status > 0, 'non-zero exit code');
  }
});
