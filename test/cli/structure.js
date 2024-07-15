const fs = require('fs');
const path = require('path');

const glob = require('tiny-glob/sync');

// This is a meta test to validate structural expectations of our
// tests, such as checking for fixture files that aren't used or
// missing from one of the test targets.
QUnit.module('structure', () => {
  QUnit.module('test/main/', () => {
    const files = fs.readdirSync(path.join(__dirname, '..', 'main'))
      .map(file => `main/${file}`);

    QUnit.test('files', assert => {
      assert.true(files.length > 5, 'found files');
      assert.deepEqual(
        files.filter(file => file.endsWith('.js') || file.endsWith('.mjs')),
        files,
        'JS files only'
      );
    });

    QUnit.test('test/index.html', assert => {
      const contents = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
      files.forEach(file => {
        assert.true(contents.includes(file), file);
      });
    });

    QUnit.test('test/index-es5.html', assert => {
      const contents = fs.readFileSync(path.join(__dirname, '..', 'index-es5.html'), 'utf8');
      files.forEach(file => {
        assert.true(contents.includes(file), file);
      });
    });

    QUnit.test('test/index-xhtml.xhtml', assert => {
      const contents = fs.readFileSync(path.join(__dirname, '..', 'index-xhtml.xhtml'), 'utf8');
      files.forEach(file => {
        assert.true(contents.includes(file), file);
      });
    });

    QUnit.test('Gruntfile.js#test-on-node', assert => {
      const raw = fs.readFileSync(path.join(__dirname, '..', '..', 'Gruntfile.js'), 'utf8');
      const contents = raw.match(/test-on-node.*?\{.*?\}/s)[0];

      files.forEach(file => {
        assert.true(contents.includes(file), file);
      });
    });

    QUnit.test('test/mozjs.js', assert => {
      const contents = fs.readFileSync(path.join(__dirname, '..', 'mozjs.js'), 'utf8');
      files.forEach(file => {
        assert.true(contents.includes(file), file);
      });
    });

    QUnit.test('test/mozjs.mjs', assert => {
      const contents = fs.readFileSync(path.join(__dirname, '..', 'mozjs.mjs'), 'utf8');
      files.forEach(file => {
        assert.true(contents.includes(file), file);
      });
    });

    QUnit.test('test/webWorker-worker.js', assert => {
      const contents = fs.readFileSync(path.join(__dirname, '..', 'webWorker-worker.js'), 'utf8');
      files.forEach(file => {
        assert.true(contents.includes(file), file);
      });
    });
  });

  QUnit.module('test/**.html', () => {
    // Get a list of the HTML files, including in subdirectories (e.g. "test/browser-runner/").
    const files = glob('**/*.html', {
      cwd: path.join(__dirname, '..'),
      filesOnly: true
    })
      // Normalize Windows-style line endings as yielded by glob.
      // The expected HTML paths use Unix-style line ending, as per HTTP.
      .map(file => file.replace(/\\/g, '/'))
      // Ignore file names containing "--", which are subresources (e.g. iframes).
      // Ignore test/benchmark, which is unrelated.
      .filter(file => !file.includes('--') && !file.includes('benchmark'))
      .map(file => `test/${file}`);

    QUnit.test('files', assert => {
      assert.true(files.length > 5, 'found files');
    });

    QUnit.test('Gruntfile', assert => {
      const raw = fs.readFileSync(path.join(__dirname, '..', '..', 'Gruntfile.js'), 'utf8');
      const contents = raw.match(/@HTML_FILES.*?\[.*?\]/s)[0];

      files.forEach(file => {
        assert.true(contents.includes(file), file);
      });
    });
  });
});
