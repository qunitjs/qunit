HTML - A QUnit addon for testing HTML strings
================================

This addon for QUnit adds `QUnit.htmlEqual` and `QUnit.notHtmlEqual` assertion methods to test that
two HTML strings are equivalent (or not) after a basic normalization process.

### Usage ###

```js
QUnit.htmlEqual(actual, expected_, message_);
QUnit.notHtmlEqual(actual, expected_, message_);
```

### Example ###

```js
QUnit.htmlEqual('<B TITLE=test>test</B>', '<b title="test">test</b>');
```

For more examples, refer to the unit tests.