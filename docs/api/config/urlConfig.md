---
layout: page-api
title: QUnit.config.urlConfig
excerpt: Register additional input fields in the toolbar (HTML Reporter).
groups:
  - config
  - extension
redirect_from:
  - "/config/urlConfig/"
version_added: "1.0.0"
---

In the HTML Reporter, this array is used to create additional input fields in the toolbar.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`array`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`[]`</td>
</tr>
</table>

This property controls which form controls display in the QUnit toolbar. By default, the `noglobals` and `notrycatch` checkboxes are registered. By adding to this array, the HTML Reporter will add extra checkboxes and select dropdowns for your custom configuration.

Each array item should be an object shaped as follows:

```js
({
  id: string,
  label: string,
  tooltip: string, // optional
  value: undefined | string | array | object // optional
});
```

* The `id` property is used as URL query parameter name, and corresponding key under `QUnit.urlParams`.
* The `label` property is used as text for the HTML label element in the user interface.
* The optional `tooltip` property is used as the `title` attribute and should explain what you code will do with this option.

Each item may also have a `value` property:

If `value` is undefined, the option will render as a checkbox. The corresponding URL parameter will be set to "true" when the checkbox is checked, and otherwise will be absent.

If `value` is a string, the option will render as a checkbox. The corresponding URL parameter will be set to the value when the checkbox is checked, and otherwise will be absent.

If `value` is an array, the option will render as a "select one" menu with an empty value as first default option, followed by one option for each item in the array. The corresponding URL parameter will be absent when the empty option is selected, and otherwise will be set to the value of the selected array item.

```js
value = [ 'foobar', 'baz' ];
```

If `value` is an object, the option will render as a "select one" menu as for an array. The keys will be used as option values, and the values will be used as option display labels. The corresponding URL parameter will be absent when the empty option is selected, and otherwise will be set to the object key of the selected property.

```js
value = {
  foobar: 'Foo with bar',
  baz: 'Baz'
};
```

## Examples

### Add toolbar checkbox

Add a new checkbox to the toolbar. You can then use the `QUnit.config.min` property in your code to implement a behaviour based on it.

```js
QUnit.config.urlConfig.push({
  id: 'min',
  label: 'Minified source',
  tooltip: 'Load minified source files instead of the regular unminified ones.'
});
```

### Add dropdown menu

Add a dropdown to the toolbar.

```js
QUnit.config.urlConfig.push({
  id: 'jquery',
  label: 'jQuery version',
  value: [ '1.7.2', '1.8.3', '1.9.1' ],
  tooltip: 'Which jQuery version to test against.'
});
```
