/* eslint-env browser */
if (!location.search) {
  location.replace('?implicit&explicit=yes&array=A&array=B&escaped%20name&toString=string&'
    + 'module=urlParams+module&filter=urlParams%20module&notrycatch&'
    + 'custom&customArray=a&customArray=b&customMenu=b&customMenuUnknown=c&altertitle=x&collapse=x');
}

QUnit.config.urlConfig.push(
  'custom',
  'customArray',
  {
    id: 'customMenu',
    label: 'Menu',
    value: ['a', 'b']
  },
  {
    id: 'customMenuUnknown',
    label: 'Menu unknown',
    value: ['a', 'b']
  },
  'altertitle'
);

// Don't change this module name without also changing the module parameter when loading this suite
QUnit.module('urlParams module', function () {
  QUnit.test('parsing', function (assert) {
    assert.propEqual(QUnit.urlParams, {
      // implicit true value
      implicit: true,
      explicit: 'yes',
      array: ['A', 'B'],
      'escaped name': true,
      // fix conflict with reserved Object.prototype name
      toString: 'string',
      // escaped space as +
      module: 'urlParams module',
      // escaped space as %20
      filter: 'urlParams module',
      notrycatch: true,
      // user-defined urlConfig
      custom: true,
      customArray: ['a', 'b'],
      customMenu: 'b',
      customMenuUnknown: 'c',
      // user-defined urlConfig with reserved QUnit.config name
      altertitle: 'x',
      // unregistered with reserved QUnit.config name
      collapse: 'x'
    });
  });

  QUnit.test('standard urlConfig', function (assert) {
    assert.strictEqual(QUnit.config.module, 'urlParams module', 'set module');
    assert.strictEqual(QUnit.config.filter, 'urlParams module', 'set filter');
    assert.strictEqual(QUnit.config.notrycatch, true, 'set notrycatch');
  });

  QUnit.test('custom urlConfig', function (assert) {
    // New user-defined urlConfig keys are automatically added to QUnit.config for back-compat.
    assert.strictEqual(QUnit.config.custom, true, 'set custom boolean');
    assert.deepEqual(QUnit.config.customArray, ['a', 'b'], 'set custom array');
    assert.strictEqual(QUnit.config.customMenu, 'b', 'set custom menu');
    assert.strictEqual(QUnit.config.customMenuUnknown, 'c', 'set custom menu, unknown value');

    // User-defined urlConfig keys that conflict with built-in QUnit.config are ignored
    // and accessible through QUnit.urlParams only.
    assert.strictEqual(QUnit.config.altertitle, true, 'conflicting key preserves default');
  });

  QUnit.test('unregistered parameters', function (assert) {
    assert.strictEqual(QUnit.config.implicit, undefined, 'implicit boolean');
    assert.strictEqual(QUnit.config.explicit, undefined, 'explicit value');
    assert.strictEqual(QUnit.config.array, undefined, 'multiple values');
    assert.strictEqual(QUnit.config['escaped name'], undefined, 'escaped name');

    assert.strictEqual(QUnit.config.collapse, true, 'conflicting key preserves default');
  });

  QUnit.test.each('HtmlReporter integration checkbox', {
    notrycatch: ['notrycatch', true],
    custom: ['custom', true],
    customArray: ['customArray', true],
    altertitle: ['altertitle', true]
  }, function (assert, dataset) {
    var element = document.querySelector('#qunit');
    var node = element.querySelector('#qunit-urlconfig-' + dataset[0]);
    assert.strictEqual(node.nodeName.toUpperCase(), 'INPUT');
    assert.strictEqual(node.checked, dataset[1]);
  });

  QUnit.test.each('HtmlReporter integration select', {
    customMenu: ['customMenu', 'b'],
    customMenuUnknown: ['customMenuUnknown', 'c']
  }, function (assert, dataset) {
    var element = document.querySelector('#qunit');
    var node = element.querySelector('#qunit-urlconfig-' + dataset[0]);
    assert.strictEqual(node.nodeName.toUpperCase(), 'SELECT');
    assert.strictEqual(node.value, dataset[1]);
  });
});
