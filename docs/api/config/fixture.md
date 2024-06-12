---
layout: page-api
title: QUnit.config.fixture
excerpt: HTML content to render before each test.
groups:
  - config
redirect_from:
  - "/config/fixture/"
version_added: "1.0.0"
---

In browser environments, this HTML will be rendered in the `#qunit-fixture` element before each test.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`string` or `null` or `undefined`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`undefined`</td>
</tr>
</table>

QUnit automatically resets the contents of `<div id="qunit-fixture">`. This gives every test a fresh start, and automatically cleans up any additions or other changes from your tests. As long as you append or insert your elements inside the fixture, you will never have to manually clean up after your tests to keep them atomic.

By starting with an empty fixture in your test HTML file, you effectively give each test a clean start, as QUnit will automatically remove anything that was added there before the next test begins.

If many of your tests require the same markup, you can also set it inside the fixture ahead of time. This reduces duplication between tests. QUnit guruantees that each test will start with a fresh copy of the original fixture, undoing any changes that happened during any previous tests.

You can define a custom fixture in one of two ways:

* In HTML: By writing it as HTML inside the `<div id="qunit-fixture">` element.
* In JavaScript: Set `QUnit.config.fixture` to a string from an [inline or bootstrap script](./index.md).

By default, if `QUnit.config.fixture` is not set, QUnit will look for the `#qunit-fixture` element when the test run begins, and assign its contents to `QUnit.config.fixture`. The initially observed content is then restored before each test.

To disable QUnit's fixture resetting behaviour, set the option to `null`.

## Example

### Automatic teardown

Starting with an empty fixture. Any additions are automatically removed.

```html
<body>
  <div id="qunit"></div>
  <div id="qunit-fixture"></div>

  <script src="test/example.js"></script>
</body>
```
```js
// test/example.js

QUnit.test('example [first]', function (assert) {
  const fixture = document.querySelector('#qunit-fixture');

  const resultA = document.querySelectorAll('#first');
  assert.strictEqual(resultA.length, 0, 'initial');

  const div = document.createElement('div');
  div.id = 'first';
  fixture.append(div);

  const resultB = document.querySelectorAll('#first');
  assert.strictEqual(resultB.length, 1, 'after append');
});

QUnit.test('example [second]', function (assert) {
  const fixture = document.querySelector('#qunit-fixture');

  // The previous elements were automatically detached.
  const result = document.querySelectorAll('#first');
  assert.strictEqual(result.length, 0, 'initial is back to zero');
});
```


### qunit-fixture HTML

```html
<body>
  <div id="qunit"></div>
  <div id="qunit-fixture">
    <p>
      <span class="marty"><strong>Marty McFly</strong>: Listen, you got a back door to this place?</span><br>
      <span class="bar"><strong>Bartender</strong>: Yeah, it's in the <em>back</em>.</span>
    </p>
  </div>
</body>
```

```js
function findText (element, tagName) {
  let ret = '';
  for (const emNode of element.querySelectorAll(tagName)) {
    ret += emNode.textContent + ' ';
  }
  return ret.trim() || null;
}

QUnit.test('findText [strong]', function (assert) {
  const fixture = document.querySelector('#qunit-fixture');

  assert.strictEqual(
    findText(fixture, 'strong'),
    'Marty McFly Bartender',
    'initial'
  );

  fixture.querySelector('.bar').remove();

  assert.strictEqual(
    findText(fixture, 'strong'),
    'Marty McFly',
    'removed bar'
  );
});

QUnit.test('findText [code]', function (assert) {
  const fixture = document.querySelector('#qunit-fixture');
  fixture.innerHTML = '<p>You can <code>add</code> two <em>numbers</em>.</p>';

  assert.strictEqual(
    findText(fixture, 'code'),
    'add'
  );

  assert.strictEqual(
    findText(fixture, 'strong'),
    null
  );
});

// The first test removed <span class=bar> and its <em> child.
// The second test replaced the fixture entirely.
// The fixture is clean and restored before each test starts.
QUnit.test('findText [em]', function (assert) {
  const fixture = document.querySelector('#qunit-fixture');

  assert.strictEqual(
    findText(fixture, 'em'),
    'back',
    'initial content was restored'
  );
});
```

### dynamic qunit-fixture

```html
<body>
  <div id="qunit"></div>
  <div id="qunit-fixture"></div>

  <script src="test/bootstrap.js"></script>
  <script src="test/example.js"></script>
</body>
```
```js
// test/bootstrap.js

QUnit.config.fixture = '<p>Hi <strong>there</strong>, stranger!</p>';

// test/example.js

QUnit.test('example [first]', function (assert) {
  const fixture = document.querySelector('#qunit-fixture');

  assert.strictEqual(fixture.textContent, 'Hi there, stranger!');

  fixture.querySelector('strong').remove();

  assert.strictEqual(fixture.textContent, 'Hi , stranger!');
});

QUnit.test('example [second]', function (assert) {
  const fixture = document.querySelector('#qunit-fixture');

  // The fixture starts fresh on each test!
  assert.strictEqual(fixture.textContent, 'Hi there, stranger!');
});
```
