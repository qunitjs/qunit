---
layout: page-api
title: assert.step()
excerpt: Record a step for later verification.
groups:
  - assert
redirect_from:
  - "/assert/step/"
version_added: "2.2.0"
---

`step( value )`

Record a step for later verification.

| name | description |
|------|-------------|
| `value` (string) | Relevant string value, or short description, to mark this step. |

This and any later steps must be verified before the end of the test via [`assert.verifySteps()`](./verifySteps.md).

The Step API provides an easy way to verify execution logic to a high degree of accuracy and precision, whether for asynchronous code, event-driven code, or callback-driven code.

## Changelog

| UNRELEASED | [assert.expect()](./expect.md) now counts `assert.verifySteps()` as one assertion. Steps no longer count separately.

## Examples

```js
QUnit.test('example', function (assert) {
  const finder = new WordFinder();
  finder.on('start', () => {
    assert.step('start');
  });
  finder.on('data', (word) => {
    assert.step(word);
  });
  finder.on('end', () => {
    assert.step('end');
  });
  finder.on('error', (e) => {
    assert.step('error: ' + e);
  });

  finder.process('Hello, 3.1. Great!');

  assert.verifySteps(['start', 'Hello', 'Great', 'end']);
});
```

_Note: See [`assert.verifySteps()`](./verifySteps.md) for more detailed examples._
