---
layout: home
home_img: /img/logo-text.svg
home_primary_btn:
  name: Get Started
  href: /intro/
home_secondary_btn:
  name: View the Docs
  href: /api/
---

<section class="grid grid--small home-highlights">
  <div>
    <h2>Easy</h2>
    <p>Zero configuration and setup for any Node.js project, and minimal setup for Browser-based projects.</p>
  </div>

  <div>
    <h2>Universal</h2>
    <p>QUnit can run anywhere; web browsers, Node, SpiderMonkey, even in a Web Worker! Test your code where it runs.</p>
  </div>

  <div>
    <h2>Extensible</h2>
    <p>Flexible APIs for custom assertions, runners, and reporters mean you can extend QUnit to fit your needs.</p>
  </div>
</section>

---

## A Quick Example

```js
function add (a, b) {
  return a + b;
}

QUnit.module('add', (hooks) => {
  QUnit.test('two numbers', (assert) => {
    assert.equal(add(1, 2), 3);
  });
});
```

<div class="grid grid--split" markdown="1">

<div class="example-result" markdown="1">

### Browser Result

<iframe loading="lazy" title="The example test code running in the browser" src="/resources/example-add.html"></iframe>

</div>

<div class="example-result" markdown="1">

### CLI Result

```tap
TAP version 13
ok 1 add > two numbers
1..1
# pass 1
# skip 0
# todo 0
# fail 0
```

</div>

</div>

---

## Current Release

<p class="lead lead--center">v2.24.2 (<a href="https://github.com/qunitjs/qunit/blob/2.24.2/History.md">changelog</a>)</p>

These are the official [release channels](intro.md#download) for QUnit:

* Download: [`qunit-2.24.2.js`](https://code.jquery.com/qunit/qunit-2.24.2.js) and [`qunit-2.24.2.css`](https://code.jquery.com/qunit/qunit-2.24.2.css)
* npm: `npm install --save-dev qunit`
* Yarn: `yarn add --dev qunit`

---

## Join the Community

<p class="lead" markdown="1">Follow us on [Mastodon](https://fosstodon.org/@qunit) or [Bluesky](https://bsky.app/profile/qunitjs.com)</p>

* [Support & Chat](./intro.md#support), for if you get stuck or need help.
* [Watch the repository](https://github.com/qunitjs/qunit), to find out about new release.
* The source of this website is in the ["docs/" directory](https://github.com/qunitjs/qunit/tree/main/docs).

---

<p class="cta">What are you waiting for? <a href="{% link intro.md %}" class="button">Get started!</a></p>
