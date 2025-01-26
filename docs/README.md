[![Build Status: spider-check](https://github.com/qunitjs/qunit/actions/workflows/spider-check.yaml/badge.svg)](https://github.com/qunitjs/qunit/actions/workflows/spider-check.yaml)

# qunitjs.com

[qunitjs.com](https://qunitjs.com/) is built using [Jekyll](https://jekyllrb.com/).

## Table of contents

<!-- For in-repo browsing convenience: -->

* [Main methods](./api/QUnit/)
* [Assertions](./api/assert/)
* [Callback events](./api/callbacks/)
* [Configuration options](./api/config/)
* [Reporters](./api/reporters/)
* [Extension interface](./api/extension/)

## Contribute

Prerequisites:
* [Ruby](https://www.ruby-lang.org/) 2.7 or later. Install from Apt on Linux, or [Homebrew](https://brew.sh/) on macOS.
* [Bundler](https://bundler.io/), e.g. `gem install bundler`.

To regenerate the site and serve locally at <http://localhost:4000/>:

```shell
cd qunit/docs/
bundle update && bundle exec jekyll serve
```

This will start the server in watch mode and regenerate the site on-the-fly.

### Update plugins page

```shell
node build/site-update-plugins.js
```

This will fetch search results from npmjs.org and save them to [_data/plugins.json](./_data/plugins.json).

### Update QUnit version

```shell
node build/site-set-version.js VERSION
```
