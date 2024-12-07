---
layout: page-api
title: QUnit.config.seed
excerpt: Enable randomized ordering of tests.
groups:
  - config
redirect_from:
  - "/config/seed/"
version_added: "1.23.0"
---

Enable randomized ordering of tests.

<table>
<tr>
  <th>type</th>
  <td markdown="span">`string` or `boolean` or `undefined`</td>
</tr>
<tr>
  <th>default</th>
  <td markdown="span">`undefined`</td>
</tr>
</table>

<p class="note" markdown="1">

This option is also available as [CLI option](../../cli.md), and as URL query parameter in the [browser](../../browser.md).

</p>

When enabled QUnit will run tests in a [seeded-random order](https://en.wikipedia.org/wiki/Random_seed).

Randomly ordering your tests can help identify non-atomic tests which either depend on a previous test or are leaking state to subsequent tests.

The provided string will be used as the seed in a pseudo-random number generator to ensure that results are reproducible. The randomization will respect the [reorder](./reorder.md) option if enabled, such that previously failed tests still run first instead of being shuffled.

If `seed` is set to `true` (or add `?seed` to the URL, without any value), then QUnit will generate a new random seed every time you run the tests. To reproduce a specific random sequence, access the seed from `QUnit.config.seed` via the console.

## Changelog

| [QUnit 2.23.1](https://github.com/qunitjs/qunit/releases/tag/2.23.1) | Add support for CLI `--seed=true`, URL `?seed=true`, and [flat preconfig](./index.md#preconfiguration) `qunit_config_seed=true`.
| [QUnit 2.21.0](https://github.com/qunitjs/qunit/releases/tag/2.21.0) | Introduce [flat preconfig](./index.md#preconfiguration), including `qunit_config_seed=<value>`.
| [QUnit 2.3.0](https://github.com/qunitjs/qunit/releases/tag/2.3.0) | Introduce [QUnit CLI](../../cli.md), including `--seed <value>`.
| [QUnit 2.1.0](https://github.com/qunitjs/qunit/releases/tag/2.1.0) | Introduce [object preconfig](./index.md#preconfiguration), including `QUnit.config.seed = true`.
| [QUnit 1.23.0](https://github.com/qunitjs/qunit/releases/tag/1.23.0) | Introduce `QUnit.config.seed`, with `?seed` as way to generate a new random seed.

## See also

* [QUnit.config.reorder](./reorder.md)
