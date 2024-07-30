const cp = require('child_process');
const path = require('path');
const DIR = path.join(__dirname, 'bundlers');

function normalize (str) {
  return str
    .replace(/^localhost:\d+/g, 'localhost:8000')
    .replace(/\b\d+ms\b/g, '42ms');
}

QUnit.module('bundlers', {
  before: async (assert) => {
    assert.timeout(60_000);

    cp.execSync('npm install --no-audit --update-notifier=false', { cwd: DIR, encoding: 'utf8' });

    await import('./bundlers/build.mjs');
  }
});

QUnit.test.each('test in Node.js [direct]', [
  './tmp/import-default.cjs.js',
  './tmp/import-named.cjs.js',
  './tmp/require-default.cjs.js'
], function (assert, fileName) {
  const actual = cp.execFileSync(process.execPath,
    [
      '--input-type=module',
      '-e',
      `import ${JSON.stringify(fileName)}; QUnit.start();`
    ],
    { cwd: DIR, env: { qunit_config_reporters_tap: 'true' }, encoding: 'utf8' }
  );
  const expected = `
1..1
# pass 1
# skip 0
# todo 0
# fail 0`.trim();

  assert.pushResult({ result: actual.includes(expected), actual, expected }, 'stdout');
});

QUnit.test.each('test in Node.js [indirect]', [
  './tmp/import-indirect.cjs.js',
  './tmp/require-indirect.cjs.js'
], function (assert, fileName) {
  const actual = cp.execFileSync(process.execPath,
    [
      '--input-type=module',
      '-e',
      `import ${JSON.stringify(fileName)}; QUnit.start();`
    ],
    { cwd: DIR, env: { qunit_config_reporters_tap: 'true' }, encoding: 'utf8' }
  );
  const expected = `
1..4
# pass 4
# skip 0
# todo 0
# fail 0`.trim();

  assert.pushResult({ result: actual.includes(expected), actual, expected }, 'stdout');
});

QUnit.test('test in browser', function (assert) {
  const expected = `Running "connect:all" (connect) task
Started connect web server on http://localhost:8000

Running "qunit:all" (qunit) task
Testing http://localhost:8000/tmp/test-import-default.es.html .OK
>> passed test "import-default"
Testing http://localhost:8000/tmp/test-import-default.iife.html .OK
>> passed test "import-default"
Testing http://localhost:8000/tmp/test-import-default.umd.html .OK
>> passed test "import-default"
Testing http://localhost:8000/tmp/test-import-default.webpack.html .OK
>> passed test "import-default"
Testing http://localhost:8000/tmp/test-import-indirect.es.html ....OK
>> passed test "import-default"
>> passed test "import-named"
>> passed test "require-default"
>> passed test "import-indirect"
Testing http://localhost:8000/tmp/test-import-indirect.iife.html ....OK
>> passed test "import-default"
>> passed test "import-named"
>> passed test "require-default"
>> passed test "import-indirect"
Testing http://localhost:8000/tmp/test-import-indirect.umd.html ....OK
>> passed test "import-default"
>> passed test "import-named"
>> passed test "require-default"
>> passed test "import-indirect"
Testing http://localhost:8000/tmp/test-import-indirect.webpack.html ....OK
>> passed test "import-default"
>> passed test "import-named"
>> passed test "require-default"
>> passed test "import-indirect"
Testing http://localhost:8000/tmp/test-import-named.es.html .OK
>> passed test "import-named"
Testing http://localhost:8000/tmp/test-import-named.iife.html .OK
>> passed test "import-named"
Testing http://localhost:8000/tmp/test-import-named.umd.html .OK
>> passed test "import-named"
Testing http://localhost:8000/tmp/test-import-named.webpack.html .OK
>> passed test "import-named"
Testing http://localhost:8000/tmp/test-require-default.es.html .OK
>> passed test "require-default"
Testing http://localhost:8000/tmp/test-require-default.iife.html .OK
>> passed test "require-default"
Testing http://localhost:8000/tmp/test-require-default.umd.html .OK
>> passed test "require-default"
Testing http://localhost:8000/tmp/test-require-default.webpack.html .OK
>> passed test "require-default"
Testing http://localhost:8000/tmp/test-require-indirect.es.html ....OK
>> passed test "import-default"
>> passed test "import-named"
>> passed test "require-default"
>> passed test "require-indirect"
Testing http://localhost:8000/tmp/test-require-indirect.iife.html ....OK
>> passed test "import-default"
>> passed test "import-named"
>> passed test "require-default"
>> passed test "require-indirect"
Testing http://localhost:8000/tmp/test-require-indirect.umd.html ....OK
>> passed test "import-default"
>> passed test "import-named"
>> passed test "require-default"
>> passed test "require-indirect"
Testing http://localhost:8000/tmp/test-require-indirect.webpack.html ....OK
>> passed test "import-default"
>> passed test "import-named"
>> passed test "require-default"
>> passed test "require-indirect"
>> 44 tests completed in 42ms, with 0 failed, 0 skipped, and 0 todo.

Done.`;

  const actual = cp.execSync('node_modules/.bin/grunt test', {
    cwd: DIR,
    env: { PATH: process.env.PATH },
    encoding: 'utf8'
  });
  assert.equal(normalize(actual).trim(), expected);
});
