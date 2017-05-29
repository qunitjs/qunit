# Contributing

Welcome! Thanks for your interest in contributing to QUnit. This document is
intended to help make your experience smooth and enjoyable. If you feel
anything should be added or clarified, definitely let us know.

If this is your first time contributing to Open Source Software in general, then
you might want to start by looking at [jQuery's excellent contributing guide](http://contribute.jquery.org/open-source/).

## Contributor License Agreement

As a first step, in order to contribute to QUnit, you'll need to sign the JS
Foundation's [CLA for QUnit](https://cla.js.foundation/qunitjs/qunit).

## Development

In order to contribute any changes to the QUnit repo, you'll need to first
[fork the repository](https://help.github.com/articles/fork-a-repo/). After that
you should [create a branch](https://bocoup.com/blog/git-workflow-walkthrough-feature-branches)
for the change and commit any relevant changes.

Workflows for documentation or code changes are outlined below.

### Code

For code changes, you'll need to have [`node.js`](https://nodejs.org/en/) and
[`yarn`](https://yarnpkg.com/en/) installed on your machine.

Install dependencies in the repository via `yarn install`. Make your code
changes and run `yarn test` to lint and test the changes. To run tests as you
make changes to the code base, you can use `yarn dev` which will rebuild QUnit
and run tests any time you make a change to the source code.

Almost all code changes should be accompanied by new unit tests to verify the
changes being made. Assuming all existing and any new tests are passing, make a
commit, push it to GitHub and create a pull request. Be sure to include some
background for the change in the commit message and the message `Fixes #nnn`,
referring to the issue number you're addressing.

### Documentation

The API documentation for QUnit lives in the `docs` directory of this repository.
For the rest of the QUnit website, see the [qunitjs.com repo](https://github.com/qunitjs/qunitjs.com).

The API documentation in this repo uses [`jekyll`](https://jekyllrb.com/). If
you make a change to the documentation, use `jekyll serve` to verify how the
change will look when deployed to the website.
