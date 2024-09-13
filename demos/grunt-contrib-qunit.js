const cp = require('child_process');
const path = require('path');
const DIR = path.join(__dirname, 'grunt-contrib-qunit');

// Fast re-runs
process.env.npm_config_prefer_offline = 'true';
process.env.npm_config_update_notifier = 'false';
process.env.npm_config_audit = 'false';

QUnit.module('grunt-contrib-qunit', {
  before: () => {
    cp.execSync('npm install', { cwd: DIR, encoding: 'utf8' });
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
  'no-tests': ['fail-no-tests', `Testing fail-no-tests.html 
>> Error: No tests were run.
>>     at `],
  uncaught: ['fail-uncaught', `Testing fail-uncaught.html \n\
>> ReferenceError: boom is not defined
>>     at file:fail-uncaught.html:16`]
}, (assert, [command, expected]) => {
  try {
    // This will use env CI, CHROMIUM_FLAGS, and PUPPETEER_CACHE_DIR
    const ret = cp.execSync('node_modules/.bin/grunt qunit:' + command, {
      cwd: DIR,
      encoding: 'utf8'
    });
    assert.equal(ret, null);
  } catch (e) {
    const actual = e.stdout.replace(/at .*[/\\]([^/\\]+\.html)(:\d+)?.*$/gm, 'at file:$1$2');
    assert.pushResult({ result: actual.includes(expected), actual, expected }, 'stdout');
    assert.true(e.status > 0, 'non-zero exit code');
  }
});
