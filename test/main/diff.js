QUnit.module('diff');

QUnit.test('throws if arguments are not strings', function (assert) {
  assert.throws(function () { QUnit.diff({}, ''); });
  assert.throws(function () { QUnit.diff('', {}); });
});

QUnit.test('different strings', function (assert) {
  var a = 'abcd';
  var b = 'xkcd';

  assert.equal(
    QUnit.diff(a, b),
    '<del>ab</del><ins>xk</ins><span>cd</span>',
    "QUnit.diff( 'abcd', 'xkcd' )"
  );
  assert.equal(
    QUnit.diff(b, a),
    '<del>xk</del><ins>ab</ins><span>cd</span>',
    "QUnit.diff( 'xkcd', 'abcd' )"
  );

  assert.equal(
    QUnit.diff(a, ''),
    '<del>abcd</del>',
    "QUnit.diff( 'abcd', '' )"
  );
  assert.equal(
    QUnit.diff('', a),
    '<ins>abcd</ins>',
    "QUnit.diff( '', 'abcd' )"
  );

  assert.equal(
    QUnit.diff('false', 'true'),
    '<del>fals</del><ins>tru</ins><span>e</span>',
    "QUnit.diff( 'false', 'true' )"
  );

  assert.equal(
    QUnit.diff('true', 'false'),
    '<del>tru</del><ins>fals</ins><span>e</span>',
    "QUnit.diff( 'true', 'false' )"
  );

  assert.equal(
    QUnit.diff(a, 'a<b/>cd'),
    '<span>a</span><del>b</del><ins>&lt;b/></ins><span>cd</span>',
    "QUnit.diff( 'abcd', 'a<b/>cd' )"
  );

  assert.equal(
    QUnit.diff(a, 'a&lt;b/&gt;cd'),
    '<span>a</span><del>b</del><ins>&amp;lt;b/&amp;gt;</ins><span>cd</span>',
    "QUnit.diff( 'abcd', 'a&lt;b/&gt;cd' )"
  );
});

QUnit.test('additions', function (assert) {
  var a = 'do less!';
  var b = 'do less, write more!';

  assert.equal(
    QUnit.diff(a, b),
    '<span>do less</span><ins>, write more</ins><span>!</span>',
    "QUnit.diff( 'do less!', 'do less, write more!' )"
  );
});

QUnit.test('removals', function (assert) {
  var a = 'do less, write more!';
  var b = 'do less!';

  assert.equal(
    QUnit.diff(a, b),
    '<span>do less</span><del>, write more</del><span>!</span>',
    "QUnit.diff( 'do less, write more!', 'do less!' )"
  );
});

QUnit.test('equality shifts', function (assert) {
  // A<ins>BA</ins>C -> <ins>AB</ins>AC
  var a = 'AC';
  var b = 'ABAC';

  assert.equal(
    QUnit.diff(a, b), '<ins>AB</ins><span>AC</span>'
  );
});

QUnit.test('test with line mode on long strings', function (assert) {
  var a = 'QUnit is a powerful, easy-to-use JavaScript unit testing framework. ' +
    "It's used by the jQuery, jQuery UI and jQuery Mobile projects and is " +
    'capable of testing any generic JavaScript code, including itself!';

  var b = 'QUnit is a very powerful, easy-to-use JavaScript unit testing framework. ' +
    "It's used by the jQuery Core, jQuery UI and jQuery Mobile projects and is " +
    'capable of testing any JavaScript code, including itself!' +
    'QUnit was originally developed by John Resig as part of jQuery. In 2008 ' +
    'it got its own home, name and API documentation, allowing others to use it ' +
    'for their unit testing as well. At the time it still depended on jQuery. ' +
    'A rewrite in 2009 fixed that, and now QUnit runs completely standalone. ';

  assert.equal(
    QUnit.diff(a, b),
    '<span>QUnit is a </span><ins>very </ins><span>powerful, easy-to-use ' +
    'JavaScript unit testing framework. It\'s used by the jQuery</span><ins> ' +
    'Core</ins><span>, jQuery UI and jQuery Mobile projects and is capable of' +
    ' testing any </span><del>generic </del><span>JavaScript code, including ' +
    'itself!</span>' +
    '<ins>QUnit was originally developed by John Resig as part of jQuery. In ' +
    '2008 it got its own home, name and API documentation, allowing others to' +
    ' use it for their unit testing as well. At the time it still depended on' +
    ' jQuery. A rewrite in 2009 fixed that, and now QUnit runs completely ' +
    'standalone. </ins>'
  );
});

QUnit.test('simplified diffs', function (assert) {
  assert.equal(
    QUnit.diff('BXYD', 'AXYC'),
    '<del>BXYD</del><ins>AXYC</ins>',
    'return is not <del>B</del><ins>A</ins><span>XY</span><del>D</del><ins>C</ins>'
  );

  assert.equal(
    QUnit.diff('XD', 'AXC'),
    '<del>XD</del><ins>AXC</ins>',
    'return is not <ins>A</ins><span>X</span><del>D</del><ins>C</ins>'
  );

  assert.equal(
    QUnit.diff('A BC ', ' B'),
    '<del>A</del><span> B</span><del>C </del>',
    'Swap insertions for deletions if diff is reversed'
  );

  assert.equal(
    QUnit.diff('abcxxx', 'xxxdef'),
    '<del>abc</del><span>xxx</span><ins>def</ins>'
  );

  assert.equal(
    QUnit.diff('xxxabc', 'defxxx'),
    '<ins>def</ins><span>xxx</span><del>abc</del>'
  );

  assert.equal(
    QUnit.diff(
      'before 0foobarbaz0foobarbaz0foobarbaz0foobarbaz0foobarbaz0foobarbaz0foobarbaz more than 100 chars\nsecond_line',
      'after 1foobarbaz1foobarbaz1foobarbaz1foobarbaz1foobarbaz1foobarbaz1foobarbaz more than 100 chars\ndifferent_end'
    ),
    '<del>before 0</del><ins>after 1</ins>' +
      '<span>foobarbaz</span><del>0</del><ins>1</ins>' +
      '<span>foobarbaz</span><del>0</del><ins>1</ins>' +
      '<span>foobarbaz</span><del>0</del><ins>1</ins>' +
      '<span>foobarbaz</span><del>0</del><ins>1</ins>' +
      '<span>foobarbaz</span><del>0</del><ins>1</ins>' +
      '<span>foobarbaz</span><del>0</del><ins>1</ins>' +
      '<span>foobarbaz more than 100 chars\n</span>' +
      '<del>second_line</del><ins>different_end</ins>',
    'simplify longer multi-line diffs'
  );
});

QUnit.test('equal values', function (assert) {
  assert.equal(
    QUnit.diff('abc', 'abc'),
    '<span>abc</span>'
  );

  assert.equal(
    QUnit.diff('', ''),
    ''
  );
});

QUnit.test('Edge cases', function (assert) {
  assert.throws(
    function () {
      QUnit.diff('abc', null);
    },
    /Error: Cannot diff null input/);

  // this hits several hard-to-reach cases for the sake of code coverage
  var X = repeat('x', 100);
  var Y = repeat('y', 100);
  assert.equal(
    QUnit.diff(
      'A\nB\n' + X + '\nD',
      'A\nCCC\nB\nCCC\n' + Y + '\nD'
    ),
    '<span>A\n</span><del>B\n' + X + '</del>' +
    '<ins>CCC\nB\nCCC\n' + Y + '</ins>' +
    '<span>\nD</span>');

  function repeat (substr, n) {
    if (substr.repeat) {
      return substr.repeat(n);
    }

    // polyfill for IE
    var r = '';
    for (var i = 0; i < n; i++) {
      r += substr;
    }
    return r;
  }
});
