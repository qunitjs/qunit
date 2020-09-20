# Contributing

Welcome! Thanks for your interest in contributing to QUnit. This document is
intended to help make your experience smooth and enjoyable. If you feel
anything should be added or clarified, definitely let us know.

If this is your first time contributing to open-source software, you might want
to take a look at the [GitHub Guides](https://guides.github.com/).

## Contributor License Agreement

As a first step, in order to contribute to QUnit, you will need to sign the JS
Foundation's [CLA for QUnit](https://cla.js.foundation/qunitjs/qunit).

### Code

For code changes, you'll need to have [Node.js](https://nodejs.org/en/) installed.

Install dependencies in the repository via `npm ci`. Make your code
changes and run `npm test` which will validate the syntax and coding style,
and run unit and integration tests.

In general, code changes should be accompanied by a unit tests to verify the
change in functionality. Once the new tests are passing, make a commit, push it
to your GitHub fork, and create the pull request.

### Documentation

The API documentation for QUnit lives in the `docs/` directory of this
repository. For the rest of the QUnit website, see the [qunitjs.com repo](https://github.com/qunitjs/qunitjs.com).

See [docs/README.md](docs/README.md) for how to preview the API documentation.
