/* eslint-env browser */
QUnit.module('QUnit.config [fixture=string]');

QUnit.config.reorder = false;
QUnit.config.fixture = '<p>Hi <strong>there</strong>, stranger!</p>';

QUnit.test('example [first]', function (assert) {
  var fixture = document.querySelector('#qunit-fixture');

  assert.strictEqual(fixture.textContent, 'Hi there, stranger!');

  fixture.querySelector('strong').remove();

  assert.strictEqual(fixture.textContent, 'Hi , stranger!');
});

QUnit.test('example [second]', function (assert) {
  var fixture = document.querySelector('#qunit-fixture');
  assert.strictEqual(fixture.textContent, 'Hi there, stranger!');
});
