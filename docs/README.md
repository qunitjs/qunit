[![Build Status: spider-check](https://github.com/qunitjs/qunit/actions/workflows/spider-check.yaml/badge.svg)](https://github.com/qunitjs/qunit/actions/workflows/spider-check.yaml)

# [qunitjs.com](https://qunitjs.com/)

This directory houses the content and code for the [qunitjs.com](https://qunitjs.com/) website.

## Table of contents

<!-- For in-repo browsing convenience: -->

* [Main methods](./QUnit/)
* [Assertions](./assert/)
* [Callback events](./callbacks/)
* [Configuration options](./config/)
* [Extension interface](./extension/)

## Contribute

### Requirements

* [Ruby](https://www.ruby-lang.org/) (tested with Ruby 2.7)
* [Bundler](https://bundler.io/) (if missing, install with `gem install bundler`)

To install or update Jekyll and plugins:

```shell
qunit/docs/$ bundle update
```

To regenerate the site and serve locally at <http://localhost:4000/>:

```shell
qunit/docs/$ bundle exec jekyll serve
```

### Update plugins

```shell
qunit/$ node build/site-update-plugins.js
```

### Update QUnit version

```shell
qunit/$ node build/site-set-version.js VERSION
```
