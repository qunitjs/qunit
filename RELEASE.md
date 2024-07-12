# Release process

This guide walks you through the QUnit release.

QUnit aims for its releases to be reproducible. Recent releases are automatically verified on a regular basis ([reproducible builds status](https://github.com/qunitjs/qunit/actions/workflows/reproducible.yaml)). Read more on [Wikipedia](https://en.wikipedia.org/wiki/Reproducible_builds), and [reproducible-builds.org](https://reproducible-builds.org/).

⚠️ **WARNING** ⚠️

> Before starting, make sure you have:
>
> * **Permission to publish to the jQuery CDN** via [jquery/codeorigin.jquery.com](https://github.com/jquery/codeorigin.jquery.com).
> * Permission to publish releases to npm for the [`qunit`](https://www.npmjs.com/package/qunit) npm package.
>
> System prerequisites:
>
> * Node.js 18, or later.
> * Git 2.11, or later.

Ensure that all changes for this release have been merged into the main branch. For patch releases, try landing any other bug fixes; for minor releases, ensure new features have been documented and tested. Major releases likely have their own checklist. Make sure the [full browsers-full job](https://github.com/qunitjs/qunit/actions/workflows/browsers-full.yaml) has run and is passing against the latest commit in the main branch. It runs every few days, but if you've made changes since, you can use "Run workflow" to trigger it now.

## Preparing the release

1. Create a local `release` branch, and ensure it is up-to-date:
   Verify that the canonical repository is cloned (not a fork):
   ```
   git remote -v
   # …
   # origin	git@github.com:qunitjs/qunit.git
   ```
   Create or reset the `release` branch:
   ```
   git remote update && git checkout -B release -t origin/main
   ```

1. Install dev dependencies:
   ```
   npm ci
   ```

1. Prepare for the release commit, and build release artefacts:
   ```
   node build/prep-release.js @VERSION
   ```

   This script does not need any credentials or permissions, and is compatible with running in an isolated container that only has read-write permissions to the current directory. The script will edit `package.json`, then execute `npm run build` to generate the release artifacts, then create a local clone of [jquery/codeorigin.jquery.com](https://github.com/jquery/codeorigin.jquery.com), and prepare a local commit for you to later push.

   * Use `git add -p` to review the changes.
   * In `AUTHORS.txt`, if you see duplicate entries, then use the `.mailmap` file to normalize them to a canonical name and e-mail address. Then run `git add .mailmap && git checkout .` to save the mailmap changes and undo other. Then re-run the above command.
   * Edit `History.md` to remove changes not relevant to end-users (e.g. changes relating to tests, build, internal refactoring, doc fixes, etc.).

1.  Review the release artifacts, compared to the previous release.
   ```
   node build/review-package.js @LAST_VERSION

   # … review package.json, qunit.js, and qunit.css
   ```

   Commit your changes with the following message (replace `@VERSION` with the release version):
   ```
   Release @VERSION
   ```

   Push the `release` branch to GitHub.
   Once CI is passing, push again, this time to the (protected) `main` branch.

## Publish the release

Verify that your local repo is on a clean main branch checkout with HEAD at the release commit:

```
git show
# Release x.y.z
# …
```

And that you have release artefacts from the previous step in your working directory (i.e. same version, and not a "dev" version). If you don't have this, go back to step 4 "Build the release".

```
head qunit/qunit.js
# /*!
#  * QUnit x.y.z
# …
```

5. Publish tag to GitHub.
   ```
   git tag -s "@VERSION" -m "Release @VERSION"
   git push --tags
   ```

6. Publish to npm:
   * Alpha releases:
   ```
   npm publish --tag @VERSION
   ```
   This will bundle the current directory and publish it to npm with the name and version specified in `package.json`.
   Verify that the alpha version is included, but not as the default/latest, at <https://www.npmjs.com/package/qunit?activeTab=versions>. If you accidentally used regular `npm publish`, you can undo this by running `npm dist-tag add qunit@LAST_STABLE_VERSION latest`.

   * Stable releases: Create tag and update 'latest' alias
   ```
   npm publish
   ````
   This will bundle the current directory and publish it to npm with the name and version specified in `package.json`.
   Verify that the release is displayed at <https://www.npmjs.com/package/qunit?activeTab=versions>.

7. Publish to the jQuery CDN:
   Review the commit and push it:
   ```
   cd __codeorigin
   git show
   git push
   ```
   Verify that the release is listed at <https://code.jquery.com/qunit/> and that you can open the JS/CSS files.

## Updating the website

After the release is published, we need to update the website. Run the following script, which will update download links and demos to use the new version:

```
qunit$ git remote update && git checkout -B docs -t origin/main
qunit$ node build/site-set-version.js @VERSION
```

Stage the changes it made, and commit with the following message:

```
Docs: Update url and version to @VERSION
```

Push the commit to a new branch on the origin, wait for CI checks to complete, then re-push to the main branch. Check the website after a few minutes to verify the change ([deployment log](https://github.com/qunitjs/qunit/deployments/activity_log?environment=github-pages)).

## Final steps

You're almost there! Make sure you update [GitHub releases](https://github.com/qunitjs/qunit/releases) using the changelog from `History.md`.

That's it! If you made it this far, congratulations you have successfully released a version of QUnit!

_If anything in the above was inaccurate or unclear, improve it to mmake future releases easier!_
