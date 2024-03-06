---
layout: page-api
title: QUnit.config.filter
excerpt: Select tests to run based on a substring or pattern match.
groups:
  - config
redirect_from:
  - "/config/filter/"
version_added: "1.0.0"
---

Select tests to run based on a substring or pattern match.

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

<p class="note" markdown="1">

This option is available as [CLI option](../../cli.md), as control in the [HTML Reporter](../../intro.md#in-the-browser), and supported as URL query parameter.

</p>

QUnit only runs tests of which the module name or test name are a case-insensitive substring match for the filter string. You can invert the filter by prefixing an exclamation mark (`!`) to the string, in which case we skip the matched tests, and run the tests that don't match the filter.

You can also match via a regular expression by setting the filter to a regular expression literal, enclosed by slashes, such as `/(this|that)/`.

While substring filters are always **case-insensitive**, a regular expression is case-sensitive by default.

See also:
* [QUnit.config.module](./module.md)

## Examples

### Substring filter

The below matches `FooBar` and `foo > bar`, because string matching is case-insensitive.

```js
QUnit.config.filter = 'foo';
```

As inversed filter, the below skips `FooBar` and `foo > bar`, but runs `Bar` and `bar > sub`.

```js
QUnit.config.filter = '!foo';
```

### Regular expression filter

The below matches `foo` but not `Foo`, because regexes are case-sensitive by default.

```js
QUnit.config.filter = '/foo/';
```

The below matches both `foo` and `Foo`.

```js
QUnit.config.filter = '/foo/i';
```

The below skips both `foo` and `Foo`.

```js
QUnit.config.filter = '!/foo/i';
```

The below matches `foo`, `foo > sub`, and `foo.sub`, but skips `bar`, `bar.foo`, and `FooBar`.

```js
QUnit.config.filter = '/^foo/';
```
