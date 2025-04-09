---
layout: page-api
title: assert.closeTo()
excerpt: Compare that a number is equal within a given tolerance.
groups:
  - assert
redirect_from:
  - "/assert/closeTo/"
version_added: "2.21.0"
---

`closeTo( actual, expected, delta, message = "" )`

Compare that a number is equal to a known target number within a given tolerance.

| name | description |
|------|-------------|
| `actual` (number) | Expression being tested |
| `expected` (number) | Known target number |
| `delta` (number) | The maximum difference between the expected and actual number |
| `message` (string) | Optional description of the actual expression |

The `assert.closeTo()` assertion checks that the actual expression approximates the expected number, allowing it to be off by at most the specified amount ("delta"). This can be used to assert that two numbers are roughly or almost equal to each other.

The actual number may be either above or below the expected number, as long as it is within the `delta` difference (inclusive).

While non-strict assertions like this are [often discouraged](https://timotijhof.net/posts/2015/qunit-anti-patterns/), it may be necessary to account for limitations in how fractional numbers are represented in JavaScript. For example, `0.1 + 0.2` is actually `0.30000000000000004`. This because math operations in JavaScript adhere to the "IEEE floating-point" standard.

To learn how floating-point numbers work internally, refer to [Double-precision floating-point format](https://en.wikipedia.org/wiki/Double-precision_floating-point_format) on Wikipedia. To learn when and why floating-point numbers experience these side effects, refer to "[What Every Computer Scientist Should Know About Floating-Point Arithmetic](http://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html)" by David Goldberg.

## Examples

```js
QUnit.test('example', function (assert) {
  const x = 0.1 + 0.2; // 0.30000000000000004

  // passing: x is between 0.299 and 0.301
  assert.closeTo(x, 0.3, 0.001);

  // passing: 3.14159 is between 3.140 and 3.142
  assert.closeTo(Math.PI, 3.141, 0.001);

  const y = 20.13;
  // passing: y is between 20.05 and 20.15 inclusive
  assert.closeTo(y, 20.10, 0.05);
});
```

```js
QUnit.test('failing example', function (assert) {
  const x = 20.7;
  assert.closeTo(x, 20.1, 0.1);
  // must be between 20.0 and 20.2 inclusive

  // message: value should be within 0.1 inclusive
  // actual  : 20.7
  // expected: 20.1

  const y = 2018;
  assert.closeTo(y, 2012, 2);
  // must be between 2010 and 2014 inclusive

  // message: value should be within 2 inclusive
  // actual  : 2018
  // expected: 2012
});
```

## See also

* Use [`assert.propContains()`](./propContains.md) to partially compare an object.

## External links

* Mocha [`expect.within()`](https://www.chaijs.com/api/bdd/#method_within), Jasmine [`expect().toBeCloseTo()`](https://jasmine.github.io/api/edge/matchers.html), and Deno [assertAlmostEquals](https://deno.land/std@0.210.0/testing/asserts.ts?s=assertAlmostEquals) are similar to `assert.closeTo()` in QUnit.
* PHPUnit [`assertEqualsWithDelta`](https://docs.phpunit.de/en/12.0/assertions.html#assertequalswithdelta), is similar to QUnit `assert.closeTo()` in JavaScript.
* Python [`assertAlmostEqual`](https://docs.python.org/3/library/unittest.html#unittest.TestCase.assertAlmostEqual), is similar QUnit `assert.closeTo()` in JavaScript.
