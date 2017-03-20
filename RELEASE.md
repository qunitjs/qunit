# Release Process

The following guide walks you through releasing a new version of QUnit. If anything in the following process is found to be inaccurate or unclear, please update this document after you finish the release process so that future releases are easier.

## Preparing the Release

Ensure that all requested changes have made it into the `master` branch of the repo for the pending release. For patch releases, ensure all bug fixes have landed; for minor releases, ensure all features have been included. Major releases will likely have their own special checklist.

Next, checkout the current `master` version of the repo and do the following:

* Install [git-extras](https://github.com/visionmedia/git-extras) and run `git changelog` to update `History.md`. Clean up the changelog, removing merge commits, whitespace cleanups or other irrelevant commits. Refer to the formatting of previous entries when in doubt.
* Run `grunt authors` and manually add any new authors to `AUTHORS.txt`. The order of this list doesn't change, so you should compare starting at the end.
* Update the version property in `package.json` to have the right `-pre` version (e.g., if releasing version `2.3.0`, the version should be `2.3.0-pre`). This is not necessary for patch releases.

Commit all of the above with the following message:

	Build: Prepare @VERSION release, including authors and history update

Replace `@VERSION` with the version number you are releasing.

For the final preparatory step, push your new commit to `master` on GitHub. In order to do this, you'll need to disable branch protections for administrators. This can be done [here](https://github.com/qunitjs/qunit/settings/branches/master).

## Performing the Release

For the actual release, we will use [QUnit's fork of jquery-release](https://github.com/qunitjs/jquery-release).

:warning: **WARNING** :warning:
> Before attempting the process below, make sure you have the proper permissions to publish to the jQuery CDN or else you will run into issues. If you have any doubts, ask someone who has done a release before to verify for you.

Always start this process from a fresh clone of the release repo:

	git clone https://github.com/qunitjs/jquery-release.git
	cd jquery-release

Then simply run the script:

	node release.js --remote=qunitjs/qunit

Follow the prompts along the way and you should be all good. This process will create a new release and tag, push it to GitHub, and publish it to NPM, Bower, and the jQuery CDN.

You can verify all of the above were correctly published by using the following:

- Bower: `bower info qunit`
- NPM: `npm view qunitjs`
- CDN: visit `https://code.jquery.com/qunit/qunit-x.x.x.js`

## Updating the Website

Once you have successfully published the new release, we need to update the website.

As with QUnit itself, checkout the current `master` version of the website repo, ensuring that any necessary updates for this release have made it into the code.

Next, do a find and replace of the previous version number and insert the new version number (excluding `package.json`, it will be updated separately). Commit those changes with the following message:

	All: Update url and version to @VERSION

Next, update the website version to the next logical number. Usually, this will be the same as `@VERSION`, but occassionally the website will be a patch version ahead if a bug occurred in the website itself:

	npm version @WEBSITE_VERSION

The above command will change the version in `package.json`, commit it, and tag it. Next, just push the new version to `master`:

	git push --tags

It is _important_ that you push the tag as that is what triggers a new website build and deployment.

Check the website in a few minutes after a build completes to verify it is updated.

If the website does not appear to be updating, you should check the Webhook to ensure a build was properly triggered. This can be done by going to the [Webhook Settings](https://github.com/qunitjs/qunitjs.com/settings/hooks) and ensuring the two "builder" hooks are "green".

## Updating the API Documentation

After updating the website, ensure you update the API documentation site as well. The process is the same as for the actual website _except_ you do _not_ need to do a find and replace of the previous version. Just ensure that all necessary updates are included that relate to the new release.

Some QUnit releases, usually patch releases, will not require any API documentation changes, in which case you can skip this section. Don't worry about the versions not matching exactly.

## Final Steps

You're almost there! Make sure you update [GitHub releases](https://github.com/qunitjs/qunit/releases) using the changelog from `History.md`.

Finally, make an announcement on the [@qunitjs](https://twitter.com/qunitjs) Twitter account. Mention highlights of the release if possible and feel free to include a second tweet if needed, but be sure to include a link to the release notes like so:

	Released @VERSION: https://github.com/qunitjs/qunit/releases/tag/x.x.x

That's it! If you made it this far, congratulations you have successfully released a new version fo QUnit!
