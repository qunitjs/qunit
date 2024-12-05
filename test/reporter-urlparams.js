/* eslint-env browser */
if (!location.search) {
  location.replace('?implicit&explicit=yes&array=A&array=B&escaped%20name&toString=string&' +
    'module=urlParams+module&filter=urlParams%20module&notrycatch&' +
    'custom&customArray=a&customArray=b&customMenu=b&customMenuUnknown=c');
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
  }
);

// Don't change this module name without also changing the module parameter when loading this suite
QUnit.module('urlParams module', function () {
  QUnit.test('parsing', function (assert) {
    assert.strictEqual(QUnit.urlParams.implicit, true, 'implicit true value');
    assert.strictEqual(QUnit.urlParams.explicit, 'yes', 'explicit value');
    assert.deepEqual(QUnit.urlParams.array, ['A', 'B'], 'multiple values');
    assert.true(QUnit.urlParams['escaped name'], 'escape sequences in name');
    assert.strictEqual(QUnit.urlParams.toString, 'string', 'Object.prototype property');
    assert.strictEqual(QUnit.urlParams.module, 'urlParams module', 'escaped space as +');
    assert.strictEqual(QUnit.urlParams.filter, 'urlParams module', 'escaped space as %20');
  });

  QUnit.module('QUnit.config properties', function () {
    QUnit.test('setting standard properties', function (assert) {
      assert.strictEqual(QUnit.config.module, 'urlParams module', 'module');
      assert.strictEqual(QUnit.config.filter, 'urlParams module', 'filter');
      assert.strictEqual(QUnit.config.notrycatch, true, 'notrycatch');
    });

    QUnit.test('setting custom properties', function (assert) {
      assert.strictEqual(QUnit.config.custom, true, 'implicit boolean');
      assert.deepEqual(QUnit.config.customArray, ['a', 'b'], 'multiple values');
    });

    QUnit.test('ignoring non-config parameters', function (assert) {
      assert.strictEqual(QUnit.config.implicit, undefined, 'implicit boolean');
      assert.strictEqual(QUnit.config.explicit, undefined, 'explicit value');
      assert.strictEqual(QUnit.config.array, undefined, 'multiple values');
      assert.strictEqual(QUnit.config['escaped name'], undefined, 'escaped name');
    });
  });
});
