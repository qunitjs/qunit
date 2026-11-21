/* globals document, Symbol */

QUnit.module('dump', {
  beforeEach: function () {
    // Run most tests without a limit
    QUnit.config.maxDepth = 0;
  },
  afterEach: function () {
    // Restore default
    QUnit.config.maxDepth = 5;
  }
});

QUnit.test('basic', function (assert) {
  assert.equal(QUnit.dump.parse([1, 2]), '[\n  1,\n  2\n]');
  assert.equal(QUnit.dump.parse({ top: 5, left: 0 }), '{\n  "left": 0,\n  "top": 5\n}');
});

// Regression: https://github.com/qunitjs/qunit/issues/1782
QUnit.test('object [throwing getter]', function (assert) {
  var object = {
    get x () { throw 42; },
    y: 1
  };

  // Same reference. == does not read properties, so this must not throw.
  assert.equal(object, object);

  assert.equal(
    QUnit.dump.parse(object),
    '{\n  "x": [Getter],\n  "y": 1\n}'
  );

  var safe = {
    get x () { return 2; }
  };
  assert.equal(QUnit.dump.parse(safe), '{\n  "x": 2\n}');

  var proto = {};
  Object.defineProperty(proto, 'hidden', {
    enumerable: true,
    get: function () { throw 42; }
  });
  var child = Object.create(proto);
  child.y = 1;
  assert.equal(
    QUnit.dump.parse(child),
    '{\n  "hidden": [Getter],\n  "y": 1\n}'
  );
});

QUnit.test('object [throwing getter for length]', function (assert) {
  var object = { y: 1 };
  Object.defineProperty(object, 'length', {
    enumerable: true,
    get: function () { throw 42; }
  });
  var output = QUnit.dump.parse(object);
  assert.notStrictEqual(output.indexOf('"length": [Getter]'), -1, 'getter is marked');
  assert.notStrictEqual(output.indexOf('"y": 1'), -1, 'later properties still render');
});

QUnit.test('object [throwing getter for constructor]', function (assert) {
  var object = { y: 1 };
  Object.defineProperty(object, 'constructor', {
    enumerable: true,
    get: function () { throw 42; }
  });
  var output = QUnit.dump.parse(object);
  assert.notStrictEqual(output.indexOf('"constructor": [Getter]'), -1, 'getter is marked');
  assert.notStrictEqual(output.indexOf('"y": 1'), -1, 'later properties still render');
});

QUnit.test('object [throwing getter for setInterval]', function (assert) {
  var object = { y: 1 };
  Object.defineProperty(object, 'setInterval', {
    enumerable: true,
    get: function () { throw 42; }
  });
  var output = QUnit.dump.parse(object);
  assert.notStrictEqual(output.indexOf('"setInterval": [Getter]'), -1, 'getter is marked');
  assert.notStrictEqual(output.indexOf('"y": 1'), -1, 'later properties still render');
});

QUnit.test('object [throwing getter for document]', function (assert) {
  var object = { y: 1 };
  object.setInterval = 1;
  Object.defineProperty(object, 'document', {
    enumerable: true,
    get: function () { throw 42; }
  });
  var output = QUnit.dump.parse(object);
  assert.notStrictEqual(output.indexOf('"document": [Getter]'), -1, 'getter is marked');
  assert.notStrictEqual(output.indexOf('"y": 1'), -1, 'later properties still render');
});

QUnit.test('object [throwing getter for nodeType]', function (assert) {
  var object = { y: 1 };
  Object.defineProperty(object, 'nodeType', {
    enumerable: true,
    get: function () { throw 42; }
  });
  var output = QUnit.dump.parse(object);
  assert.notStrictEqual(output.indexOf('"nodeType": [Getter]'), -1, 'getter is marked');
  assert.notStrictEqual(output.indexOf('"y": 1'), -1, 'later properties still render');
});

QUnit.test('object [throwing getter for item]', function (assert) {
  var object = { y: 1 };
  object.length = 0;
  Object.defineProperty(object, 'item', {
    enumerable: true,
    get: function () { throw 42; }
  });
  var output = QUnit.dump.parse(object);
  assert.notStrictEqual(output.indexOf('"item": [Getter]'), -1, 'getter is marked');
  assert.notStrictEqual(output.indexOf('"y": 1'), -1, 'later properties still render');
});

// eslint-disable-next-line compat/compat -- Checked before use
var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;

QUnit.test.if('object [throwing getter for Symbol.toStringTag]', hasToStringTag, function (assert) {
  var object = { y: 1 };
  Object.defineProperty(object, hasToStringTag, {
    get: function () { throw 42; }
  });
  assert.strictEqual(QUnit.dump.parse(object), '{\n  "y": 1\n}');
});

QUnit.test('error [throwing getter for message]', function (assert) {
  var err = new Error('boom');
  Object.defineProperty(err, 'message', {
    get: function () { throw 42; }
  });
  var errOutput = QUnit.dump.parse(err);
  assert.notStrictEqual(errOutput.indexOf('"message": [Getter]'), -1, 'getter is marked');
  assert.notStrictEqual(errOutput.indexOf('"name": "Error"'), -1, 'error name still renders');

  var fakeError = { constructor: Error, y: 1 };
  Object.defineProperty(fakeError, 'message', {
    enumerable: true,
    get: function () { throw 42; }
  });
  var fakeOutput = QUnit.dump.parse(fakeError);
  assert.notStrictEqual(fakeOutput.indexOf('"message": [Getter]'), -1, 'getter is marked');
  assert.notStrictEqual(fakeOutput.indexOf('"y": 1'), -1, 'later properties still render');
});

QUnit.test('node [throwing getter for nodeName]', function (assert) {
  var object = { nodeType: 1, y: 1 };
  Object.defineProperty(object, 'nodeName', {
    enumerable: true,
    get: function () { throw 42; }
  });
  var output = QUnit.dump.parse(object);
  assert.notStrictEqual(output.indexOf('"nodeName": [Getter]'), -1, 'getter is marked');
  assert.notStrictEqual(output.indexOf('"y": 1'), -1, 'later properties still render');
});

QUnit.test('object [shallow]', function (assert) {
  var obj = {
    top: {
      middle: {
        bottom: 0
      }
    },
    left: 0
  };
  QUnit.config.maxDepth = 1;
  assert.equal(QUnit.dump.parse(obj), '{\n  "left": 0,\n  "top": [object Object]\n}');

  QUnit.config.maxDepth = 2;
  assert.equal(
    QUnit.dump.parse(obj),
    '{\n  "left": 0,\n  "top": {\n    "middle": [object Object]\n  }\n}'
  );

  QUnit.config.maxDepth = 3;
  assert.equal(
    QUnit.dump.parse(obj),
    '{\n  "left": 0,\n  "top": {\n    "middle": {\n      "bottom": 0\n    }\n  }\n}'
  );

  QUnit.config.maxDepth = 5;
  assert.equal(
    QUnit.dump.parse(obj),
    '{\n  "left": 0,\n  "top": {\n    "middle": {\n      "bottom": 0\n    }\n  }\n}'
  );
});

QUnit.test('QUnit.dump.maxDepth alias', function (assert) {
  assert.strictEqual(QUnit.dump.maxDepth, 0, 'alias matches initial config');

  QUnit.config.maxDepth = 1;
  assert.strictEqual(QUnit.dump.maxDepth, 1, 'change alias via config');

  QUnit.dump.maxDepth = 2;
  assert.strictEqual(QUnit.config.maxDepth, 2, 'change config via alias');

  var obj = {
    top: {
      middle: {
        bottom: 0
      }
    },
    left: 0
  };
  assert.equal(
    QUnit.dump.parse(obj),
    '{\n  "left": 0,\n  "top": {\n    "middle": [object Object]\n  }\n}',
    'object shallow with effective maxDepth=2'
  );
});

QUnit.test('error [Error]', function (assert) {
  assert.equal(
    QUnit.dump.parse(new Error('foo')),
    'Error("foo")');
});

QUnit.test('error [subclass]', function (assert) {
  function CustomError (message) {
    this.message = message;
  }

  CustomError.prototype.toString = function () {
    return this.message;
  };
  var customError = new CustomError('sad puppy');
  var typeError = new TypeError('crying kitten');
  var expectedCustomMessage = '"message": "sad puppy"';
  var expectedTypeMessage = '"message": "crying kitten"';
  var expectedTypeName = '"name": "TypeError"';

  var dumpedCustomError = QUnit.dump.parse(customError);
  assert.pushResult({
    result: dumpedCustomError.indexOf(expectedCustomMessage) >= 0,
    actual: dumpedCustomError,
    expected: expectedCustomMessage,
    message: 'custom error contains message field'
  });

  var dumpedTypeError = QUnit.dump.parse(typeError);
  assert.pushResult({
    result: dumpedTypeError.indexOf(expectedTypeMessage) >= 0,
    actual: dumpedTypeError,
    expected: expectedTypeMessage,
    message: 'type error contains message field'
  });
  assert.pushResult({
    result: dumpedTypeError.indexOf(expectedTypeName) >= 0,
    actual: dumpedTypeError,
    expected: expectedTypeName,
    message: 'type error contains name field'
  });

  // Test when object has some enumerable properties by adding one
  typeError.hasCheeseburger = true;
  var dumpedTypeErrorWithEnumerable = QUnit.dump.parse(typeError);
  assert.pushResult({
    result: dumpedTypeErrorWithEnumerable.indexOf(expectedTypeMessage) >= 0,
    actual: dumpedTypeErrorWithEnumerable,
    expected: expectedTypeMessage,
    message: 'type error with enumerable field contains message field'
  });
});

QUnit.test('regex', function (assert) {
  assert.equal(QUnit.dump.parse(/foo/), '/foo/');
});

QUnit.test('date', function (assert) {
  var date = new Date('2020-11-10T03:24:00');
  assert.equal(QUnit.dump.parse(date), '"' + date + '"');
});

QUnit.test.if('symbol', typeof Symbol === 'function', function (assert) {
  // eslint-disable-next-line compat/compat -- Checked above
  var sym = Symbol('Example');
  assert.equal(QUnit.dump.parse(sym), 'Symbol(Example)');
});

QUnit.test('function [named]', function (assert) {
  var f = function foo () {};
  assert.equal(QUnit.dump.parse(f), 'function foo(){\n  [code]\n}');
});

QUnit.test('function [args]', function (assert) {
  // eslint-disable-next-line no-unused-vars
  var f = function f (foo, bar) {};
  assert.equal(QUnit.dump.parse(f), 'function f( a, b ){\n  [code]\n}');
});

QUnit.test('function [unnamed]', function (assert) {
  // eslint-disable-next-line no-unused-vars
  var f = function (foo, bar) {};

  // Modern browsers are very smart, they are usually able to
  // come up with a name based on the assignment. To test the
  // code path for where there is no name, we will force it.
  delete f.name;

  assert.equal(QUnit.dump.parse(f), 'function( a, b ){\n  [code]\n}');
});

QUnit.test('window, document, node [fake]', function (assert) {
  var fakeWindow = {
    setInterval: [],
    document: {},
    nodeType: undefined
  };
  assert.equal(QUnit.dump.parse(fakeWindow), '[Window]');

  var fakeDocument = { nodeType: 9 };
  assert.equal(QUnit.dump.parse(fakeDocument), '[Document]');

  var fakeTextNode = {
    nodeType: 3,
    nodeName: 'fakeTextNode',
    nodeValue: 'fakeValue'
  };
  assert.equal(
    QUnit.dump.parse(fakeTextNode),
    '<faketextnode>fakeValue</faketextnode>');
});

QUnit.test.if('node [real DOM]', typeof document !== 'undefined', function (assert) {
  var node = document.createElement('h1');
  node.id = 'example-header';
  node.innerHTML = '<span>Hello</span>';
  document.querySelector('#qunit-fixture').appendChild(node);
  var nodelist = document.querySelector('#qunit-fixture').getElementsByTagName('h1');

  assert.equal(
    QUnit.dump.parse(node),
    '<h1 id="example-header"></h1>'
  );
  assert.equal(
    QUnit.dump.parse(nodelist),
    '[\n  <h1 id="example-header"></h1>\n]'
  );
});

QUnit.test('setParser [custom]', function (assert) {
  var parser = 'dummy value';
  QUnit.dump.setParser('CustomObject', parser);

  assert.equal(QUnit.dump.parsers.CustomObject, parser);
});

function WrapFn (x) {
  this.wrap = x;
  if (x === undefined) {
    this.first = true;
  }
}

function chainwrap (depth, first, prev) {
  depth = depth || 0;
  var last = prev || new WrapFn();
  first = first || last;

  if (depth === 1) {
    first.wrap = last;
  }
  if (depth > 1) {
    last = chainwrap(depth - 1, first, new WrapFn(last));
  }

  return last;
}

QUnit.test('object [recursion]', function (assert) {
  var noref = chainwrap(0);
  var nodump = QUnit.dump.parse(noref);
  assert.equal(nodump, '{\n  "first": true,\n  "wrap": undefined\n}');

  var selfref = chainwrap(1);
  var selfdump = QUnit.dump.parse(selfref);
  assert.equal(selfdump, '{\n  "first": true,\n  "wrap": recursion(-1)\n}');

  var parentref = chainwrap(2);
  var parentdump = QUnit.dump.parse(parentref);
  assert.equal(parentdump,
    '{\n  "wrap": {\n    "first": true,\n    "wrap": recursion(-2)\n  }\n}'
  );

  var circref = chainwrap(10);
  var circdump = QUnit.dump.parse(circref);
  assert.true(new RegExp('recursion\\(-10\\)').test(circdump),
    '(' + circdump + ') should show -10 recursion level'
  );
});

QUnit.test('object equal/deepEqual [recursion]', function (assert) {
  var noRecursion = chainwrap(0);
  assert.equal(noRecursion, noRecursion, 'I should be equal to me.');
  assert.deepEqual(noRecursion, noRecursion, '... and so in depth.');

  var selfref = chainwrap(1);
  assert.equal(selfref, selfref, 'Even so if I nest myself.');
  assert.deepEqual(selfref, selfref, '... into the depth.');

  var circref = chainwrap(10);
  assert.equal(circref, circref, 'Or hide that through some levels of indirection.');
  assert.deepEqual(circref, circref, '... and checked on all levels!');
});

QUnit.test('array [basic]', function (assert) {
  assert.equal(QUnit.dump.parse([[]]), '[\n  []\n]');

  assert.equal(
    QUnit.dump.parse([1, 2]),
    '[\n  1,\n  2\n]'
  );
});

QUnit.test('array [shallow]', function (assert) {
  QUnit.config.maxDepth = 1;
  assert.equal(
    QUnit.dump.parse([[]]),
    '[\n  [object Array]\n]');
});

QUnit.test('array [recursion]', function (assert) {
  // Pure array self-ref
  var arr = [];
  arr.push(arr);

  var arrdump = QUnit.dump.parse(arr);

  assert.equal(arrdump, '[\n  recursion(-1)\n]');
  assert.equal(arr, arr[0], 'no endless stack when trying to dump arrays with circular ref');

  // Mix obj-arr circular ref
  var obj = {};
  var childarr = [obj];
  obj.childarr = childarr;

  var objdump = QUnit.dump.parse(obj);
  var childarrdump = QUnit.dump.parse(childarr);

  assert.equal(objdump, '{\n  "childarr": [\n    recursion(-2)\n  ]\n}');
  assert.equal(childarrdump, '[\n  {\n    "childarr": recursion(-2)\n  }\n]');

  assert.equal(obj.childarr, childarr,
    'no endless stack when trying to dump array/object mix with circular ref'
  );
  assert.equal(childarr[0], obj,
    'no endless stack when trying to dump array/object mix with circular ref'
  );
});

// Regression test: https://github.com/qunitjs/qunit/pull/105
QUnit.test('object [circular reference]', function (assert) {
  function MyObject () {}
  MyObject.prototype.parent = function (obj) {
    if (obj === undefined) {
      return this._parent;
    }
    this._parent = obj;
  };
  MyObject.prototype.children = function (obj) {
    if (obj === undefined) {
      return this._children;
    }
    this._children = obj;
  };

  var a = new MyObject();
  var b = new MyObject();

  var barr = [b];
  a.children(barr);
  b.parent(a);

  assert.equal(a.children(), barr);
  assert.deepEqual(a.children(), [b]);
});
