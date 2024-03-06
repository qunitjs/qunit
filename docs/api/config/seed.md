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

<p class="note" markdown="1">This option is also available as [CLI option](../../cli.md), and as URL query parameter in the browser.</p>

When set to boolean true, or a string, QUnit will run tests in a [seeded-random order](https://en.wikipedia.org/wiki/Random_seed).

The provided string will be used as the seed in a pseudo-random number generator to ensure that results are reproducible. The randomization will also respect the [reorder](./reorder.md) option if enabled and re-run failed tests first without randomizing them.

Randomly ordering your tests can help identify non-atomic tests which either depend on a previous test or are leaking state to subsequent tests.

If `seed` is boolean true (or set as URL query parameter without a value), then QUnit will generate on-demand a new random value to use as seed. You can then read the seed at runtime from the configuration value, and use it to reproduce the same test sequence later.
