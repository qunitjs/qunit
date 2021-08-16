---
layout: page-api
title: QUnit.config.filter
excerpt: Decide which tests should run based on a substring or pattern match.
groups:
  - config
version_added: "1.0.0"
---

Decide selectively which tests should run based on a substring or pattern match.

## Description

<table>
<tr>
  <th>type</th>
  <td markdown="span">`string` or `undefined`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`undefined`</td>
</tr>
</table>

<p class="note" markdown="1">This option is available as [CLI option](https://qunitjs.com/cli/), as control in the [HTML Reporter](https://qunitjs.com/intro/#in-the-browser), and supported as URL query parameter.</p>

Only run tests of which the module name or test name have a case-insensitive substring match for the provided string. You can inverse the filter, to run all tests that don't contain the string, by prefixing a bang character (`!`) to the string.

You can also match via a regular expression by setting the filter to a regular expression literal in string form, encloses by slashes, such as `/(this|that)/i`.

While substring filters are always **case-insensitive**, a regular expression is only insensitive when passing the `/i` flag.

See also:
* [QUnit.config.module](./module.md)

## Examples

### Example: Substring filter

The below matches `QUnit.module( "FooBar" )` and `QUnit.test( "createFooBar" )`.

```js
QUnit.config.filter = 'foo';
```

As inverted filter, the below would skip `QUnit.module( "FooBar" )` and `QUnit.test( "createFooBar" )`, but match `QUnit.module( "Bar" )` and `QUnit.test( "createBar" )`.

```js
QUnit.config.filter = '!foo';
```

### Example: Regular expression filter

The below would match `QUnit.test( "foo" )`, but not `QUnit.test( "Foo" )`.

```js
QUnit.config.filter = '/foo/';
```

The below would both match `QUnit.test( "foo" )` and `QUnit.test( "Foo" )`.

```js
QUnit.config.filter = '/foo/i';
```
