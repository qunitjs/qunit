/* globals gc */

const v8 = require('v8');

// Hold explicit references as well so that V8 will consistently
// not be able to GC them until we ask it to. This allows us to
// verify that our heap logic works correctly by asserting both
// presence and absence.
const foos = new Set();
class Foo {
  constructor () {
    this.id = `FooNum${foos.size}`;
    foos.add(this);
  }

  getId () {
    return this.id.slice(0, 3);
  }
}

function streamToString (stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

// Regression test for https://github.com/qunitjs/qunit/pull/1708
//
// Unlike the module-closure.js case, this one can't use a second QUnit.test
// to check the memory, because this one isn't about whether the memory is
// released soon/at all, but about whether it is released specifically for
// even the last test that executes. As soon as another async test begins,
// the underlying root cause (config.timeoutHandler) is released when it is
// replaced by the next test's timeout handler.
//
// The v8.getHeapSnapshot() function is async, so we can't use a synchronous
// test either. Instead, use the QUnit.done() hook and rely on global errors
// to communicate a failure.
QUnit.done(async function () {
  // The snapshot is expected to contain entries like this:
  // > "FooNum<integer>"
  // It is important that the regex uses \d and that the above
  // comment doesn't include a number, as otherwise we will also
  // get matches for the memory of this function's source code.
  const reHeap = /^.*FooNum\d.*$/gm;

  let snapshot = await streamToString(v8.getHeapSnapshot());
  let matches = snapshot.match(reHeap) || [];
  if (matches.length === 0) {
    QUnit.onUncaughtException(new Error('Heap before GC must contain matches'));
    return;
  }
  if (foos.size !== 1) {
    QUnit.onUncaughtException(new Error(`Registry must contain 1 Foo, but found ${foos.size}`));
  }

  snapshot = matches = null;

  // Comment out the below to test the failure mode
  foos.clear();

  // Requires `--expose-gc` flag to function properly.
  gc();

  snapshot = await streamToString(v8.getHeapSnapshot());
  matches = snapshot.match(reHeap);
  if (matches !== null) {
    QUnit.onUncaughtException(new Error(`Heap after GC must have no Foo left, but found ${matches.join(', ')}`));
  }
});

QUnit.module('test-object', function () {
  QUnit.test('example test', function (assert) {
    // assert.async() calls test.internalStop(), which if timeout is non-zero,
    // will set global QUnit.config.timeoutHandler, which holds a reference
    // to the last internal Test object. While the timeout is cancelled
    // after the test finishes, the handler property used to be kept.
    assert.timeout(1000);
    const done = assert.async();
    this.foo1 = new Foo();
    assert.equal(this.foo1.getId(), 'Foo');
    setTimeout(done);
  });
});
