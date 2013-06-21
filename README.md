[![Build Status](http://jenkins.jquery.com/job/QUnit/badge/icon)](http://jenkins.jquery.com/job/QUnit/)

# [QUnit](http://qunitjs.com) - A JavaScript Unit Testing Framework.

QUnit is a powerful, easy-to-use, JavaScript unit testing framework. It's used by the jQuery
project to test its code and plugins but is capable of testing any generic
JavaScript code (and even capable of testing JavaScript code on the server-side).

QUnit is especially useful for regression testing: Whenever a bug is reported,
write a test that asserts the existence of that particular bug. Then fix it and
commit both. Every time you work on the code again, run the tests. If the bug
comes up again - a regression - you'll spot it immediately and know how to fix
it, because you know what code you just changed.

Having good unit test coverage makes safe refactoring easy and cheap. You can
run the tests after each small refactoring step and always know what change
broke something.

QUnit is similar to other unit testing frameworks like JUnit, but makes use of
the features JavaScript provides and helps with testing code in the browser, e.g.
with its stop/start facilities for testing asynchronous code.

If you are interested in helping developing QUnit, you are in the right place.
For related discussions, visit the
[QUnit and Testing forum](http://forum.jquery.com/qunit-and-testing).

## Development

To submit patches, fork the repository, create a branch for the change. Then implement
the change, run `grunt` to lint and test it, then commit, push and create a pull request.

Include some background for the change in the commit message and `Fixes #nnn`, referring
to the issue number you're addressing.

To run `grunt`, you need `node` and `npm`, then `npm install grunt -g`. That gives you a global
grunt binary. For additional grunt tasks, also run `npm install`.

## Releases

Install [git-extras](https://github.com/visionmedia/git-extras) and run `git changelog` to update History.md. Clean up the changelog, removing merge commits or whitespace cleanups.

Update qunit/qunit.js|css and package.json to the release version, commit ("Release $version") and
tag (Put the 'v' in front of the tag, e.g. `v1.8.0`), update them again to
the next version ("Bump post-release version"), commit and push commits and tags:

	git push --tags origin master

To upload to code.jquery.com (replace $version accordingly), ssh to jq03 (swarm.jquery.org).

Clone or fetch QUnit, checkout the tag you created, then:

	sudo cp qunit/qunit.js /var/www/html/code.jquery.com/qunit/qunit-$version.js
	sudo cp qunit/qunit.css /var/www/html/code.jquery.com/qunit/qunit-$version.css

Then update /var/www/html/code.jquery.com/index.html and purge it with:

	curl -s http://code.origin.jquery.com/?reload

Update web sites, replacing previous versions with new ones:

* jquery/jquery-wp-content themes/jquery/footer-qunit.php
* jquery/qunitjs.com pages/index.html

Publish to npm via

	npm publish

Finally announce on Twitter @qunitjs

	Released v1.12.0: https://github.com/jquery/qunit/tree/v1.12.0
	Changelog: https://github.com/jquery/qunit/blob/v1.12.0/History.md