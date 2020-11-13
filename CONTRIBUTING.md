# Contributing

Welcome! Thanks for your interest in contributing to QUnit. This document is
intended to help make your experience smooth and enjoyable. If you feel
anything should be added or clarified, definitely let us know.

If this is your first time contributing to open-source software, you might want
to take a look at the [GitHub Guides](https://guides.github.com/).

## Contributor License Agreement

As a first step, in order to contribute to QUnit, you will need to sign the JS
Foundation's [CLA for QUnit](https://cla.js.foundation/qunitjs/qunit).

## Code

For code changes, you'll need to have [Node.js](https://nodejs.org/en/) installed.

Install dependencies in the repository via `npm ci`. Make your code
changes and run `npm test` which will validate the syntax and coding style,
and run unit and integration tests.

In general, code changes should be accompanied by a unit tests to verify the
change in functionality. Once the new tests are passing, make a commit, push it
to your GitHub fork, and create the pull request.

## Documentation

The API documentation for QUnit lives in the `docs/` directory of this
repository. For the rest of the QUnit website, see the [qunitjs.com repo](https://github.com/qunitjs/qunitjs.com).

See [docs/README.md](docs/README.md) for how to preview the API documentation.

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

* `All`
* `Assert`
* `Build`
* `CLI`
* `Core`
* `Docs`
* `Dump`
* `HTML Reporter`
* `Release`
* `Tests`

See also [Commit message guidelines](https://www.mediawiki.org/wiki/Gerrit/Commit_message_guidelines).
