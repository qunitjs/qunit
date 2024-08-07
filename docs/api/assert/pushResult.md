---
layout: page-api
title: assert.pushResult()
excerpt: Report the result of a custom assertion.
groups:
  - assert
  - extension
redirect_from:
  - "/pushResult/"
  - "/assert/pushResult/"
version_added: "1.22.0"
---

`pushResult( data )`

Report the result of a custom assertion.

| name | description |
|------|-------------|
| `data.result` (boolean) | Result of the assertion |
| `data.actual` | Expression being tested (optional) |
| `data.expected` | Known comparison value (optional) |
| `data.message` (string or undefined) | Short description of the assertion |

## Examples

### Create a QUnit assert plugin

With a custom assertion method, you can control how an assertion should be evaluated, separately from how its actual and expected values are described in case of a failure.

This provides more helpful and transparent diagnostic information when test failures are presented. It also lets you avoid duplication and separate concerns between your test requirements and the way specific a generic and re-usable check is implemented.

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

QUnit.test('example', assert => {
  const result = 42;
  assert.between(result, 1, 10, 'result');
  // Example test failure
  // > actual: 42
  // > expected: between 1 and 10
});
```

### When to create an assertion

If there isn't a built-in QUnit assertion for something that you need to check, you can always freely express it using inline JavaScript within your test. It is recommended to, whenever possible, end your ad-hoc logic with two values that you can pass to [`assert.strictEqual()`](./strictEqual.md), or pass a boolean result to [`assert.true()`](./true.md).

```js
QUnit.test('remainder example [bad]', assert => {
  const actual = 4;

  const result = (actual % 3) === 2;
  assert.true(result);

  // Example failure:
  // > Actual: false
  // > Expected: true
});

QUnit.test('remainder example [good]', assert => {
  const actual = 4;

  const result = (actual % 3);
  assert.strictEqual(result, 2, 'remainder of mod 3');

  // Example failure:
  // > Message: remainder of mod 3
  // > Actual: 1
  // > Expected: 2
});

QUnit.test('between example', assert => {
  const actual = 42;

  const isBetween = actual >= 1 && actual <= 10;
  assert.true(isBetween);

  // Example failure:
  // > Actual: false
  // > Expected: true
});
```

Writing a custom expression like this is perfectly fine occasionally. But, if you need to do this a lot, you do take on additional risks and costs over time:

* Risk of subtle bugs or false positives due to logic duplication.
  With a plugin, you can write/document/test it once, and then re-use.
* No mention of the actual number.
* No mention of the expected value(s).
* No description of the problem.
* No (useful) diff.

This is likely to increase the cost of debugging, requiring an issue to first be reproduced and stepped-through locally before the failure is understood. You can compensate for this by maintaining a copy of the most important information in the "message" field of your assertions.

When you create an assertion plugin instead, this is automated as part of the "actual" and "expected" values, which you can control separately from the boolean result.
