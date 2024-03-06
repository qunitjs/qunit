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

This assertion registers a passing assertion with the provided string. This and any other steps should be verified later in the test via [`assert.verifySteps()`](./verifySteps.md).

The Step API provides an easy way to verify execution logic to a high degree of accuracy and precision, whether for asynchronous code, event-driven code, or callback-driven code.

## Examples

```js
QUnit.test('example', function (assert) {
  var maker = new WordMaker();
  maker.on('start', () => {
    assert.step('start');
  });
  maker.on('data', (word) => {
    assert.step(word);
  });
  maker.on('end', () => {
    assert.step('end');
  });

  maker.process('3.1');

  assert.verifySteps([ 'start', '3', 'point', '1', 'end' ]);
});
```

_Note: See [`assert.verifySteps()`](./verifySteps.md) for more detailed examples._
