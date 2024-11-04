<p align="center"><img src="/docs/img/logo-with-colored-dark-text.svg" height="width" height="125" alt="QUnit"></p>

# Contributing

Welcome! Thanks for your interest in contributing to QUnit. This document is
intended to help make your experience smooth and enjoyable. If you feel
anything should be added or clarified, definitely let us know.

If this is your first time contributing to open-source software, you might want
to take a look at the [GitHub Guides](https://guides.github.com/).

If you get stuck or need help, you can always [chat with us](https://gitter.im/qunitjs/qunit).

## Where to begin

We've labelled some open issues as a "[good first issue](https://github.com/qunitjs/qunit/labels/good%20first%20issue)", which are issues that have a straight-forward outcome, don't require
much knowledge of JavaScript, and don't require previous experience with QUnit.

Issues marked as "[help welcome](https://github.com/qunitjs/qunit/labels/help%20welcome)" may require
a bit more JavaScript experience, and either don't need detailed knowledge of our code, or serve as
good ways to gain familiarity with just one or two areas of the code.

You're also welcome to start on any other [open issue](https://github.com/qunitjs/qunit/issues).
Feel free to comment in that case to ask for directions.

## Contributor License Agreement

As a first step, in order to contribute to QUnit, you will need to sign the JS
Foundation's [CLA for QUnit](https://cla.js.foundation/qunitjs/qunit).

## Code

For code changes, you'll need to have [Node.js](https://nodejs.org/en/) installed.

Install dependencies in the repository via `npm install`. Make your code
changes and run `npm test` which will validate the syntax and coding style,
and run unit and integration tests.

In general, code changes should be accompanied by a unit test to verify the
change in functionality. Once the new tests are passing, make a commit, push it
to your GitHub fork, and create the pull request.

## Documentation

The website lives in the `docs/` directory of this repository.

Check [docs/README.md](docs/README.md) for how to locally preview the API documentation site.

## Commit messages

If you're a new contributor, don't worry if you're unsure about
the commit message. The team will edit or write it for you as part
of their code review and merge activities. If you're a regular
contributor, do try to follow this structure as it helps others to
more quickly find, understand, and merge your changes. Thanks!

Structure:

```
Component: Short subject line about what is changing

Additional details about the commit are placed after a new line
in the commit message body. That's this paragraph here.

As well as any additional paragraphs. The last block is the footer,
which is reserved for any "Ref", "Fixes" or "Closes" instructions
(one per line).

Fixes #1.
```

The subject line should use the [imperative mood](https://en.wikipedia.org/wiki/Imperative_mood),
and start with one of the following components:

* `Assert`
* `Build`
* `CLI`
* `Core`
* `Demos`
* `Docs`
* `HTML Reporter`
* `Test`

See also [Commit message guidelines](https://www.mediawiki.org/wiki/Gerrit/Commit_message_guidelines).
