---
layout: page-api
title: assert.pushResult()
excerpt: Report the result of a custom assertion.
groups:
  - assert
redirect_from:
  - "/assert/pushResult/"
version_added: "1.22.0"
---

`pushResult( data )`

Report the result of a custom assertion.

| name | description |
|------|-------------|
| `data.result` (boolean) | Result of the assertion |
| `data.actual` | Expression being tested |
| `data.expected` | Known comparison value |
| `data.message` (string or undefined) | Short description of the assertion |

## Examples

If you need to express an expectation that is not abstracted by a built-in QUnit assertion, you can perform your own logic ad-hoc in an expression, and then pass two directly comparable values to [`assert.strictEqual()`](./strictEqual.md), or pass your own representative boolean result to [`assert.true()`](./true.md).

```js
QUnit.test('bad example of remainder', assert => {
  const result = 4;
  const actual = (result % 3) === 2;
  assert.true(actual, 'remainder');
  // In case of failure:
  // > Actual: false
  // > Expected: true
  //
  // No mention of the actual remainder.
  // No mention of the expected value.
});

QUnit.test('good example of remainder', assert => {
  const result = 4;
  assert.strictEqual(result % 3, 2, 'remainder');
  // In case of failure:
  // > Actual: 1
  // > Expected: 2
});

QUnit.test('bad example of between', assert => {
  const actual = 3;
  const isBetween = (actual >= 1 && actual <= 10);
  assert.true(isBetween, 'result between 1 and 10');
  // In case of failure:
  // > Actual: false
  // > Expected: true
  //
  // No mention of the actual remainder.
  // No mention of the expected value.
  // Cannot be expressed in a useful way with strictEqual()
});
```

### Custom assertion

With a custom assertion method, you can control how an assertion should be evaluated, separately from how its actual and expected values are described in case of a failure.

For example:

```js
QUnit.assert.between = function (actual, from, to, message) {
  const isBetween = (actual >= from && actual <= to);

  this.pushResult({
    result: isBetween,
    actual: actual,
    expected: `between ${from} and ${to} inclusive`,
    message: message
  });
};

QUnit.test('custom assertion example', assert => {
  const result = 3;
  assert.between(result, 1, 10, 'result');
  // Example of failure if result is out of range
  // > actual: 42
  // > expected: between 1 and 10
});
```
