[![Build Status: spider-check](https://github.com/qunitjs/qunit/actions/workflows/spider-check.yaml/badge.svg)](https://github.com/qunitjs/qunit/actions/workflows/spider-check.yaml)

# [api.qunitjs.com](https://api.qunitjs.com/)

## Table of contents

<!-- For in-repo browsing convenience: -->

* [Main methods](./QUnit/)
* [Assertions](./assert/)
* [Configuration tools](./config/)
* [Callback events](./callbacks/)

## Contribute

The API documentation site is hosted at <https://api.qunitjs.com> using GitHub Pages.

#### Requirements

* [Ruby](https://www.ruby-lang.org/) (tested with Ruby 2.7)
* [Bundler](https://bundler.io/) (if missing, install with `gem install bundler`)

To install Jekyll and plugins the first time:

```shell
bundle install
```

To update Jekyll and any plugins (e.g. after changes to `Gemfile`):

```shell
bundle update
```

To regenerate the site and serve locally at <http://127.0.0.1:4000/>:

```shell
bundle exec jekyll serve
```
