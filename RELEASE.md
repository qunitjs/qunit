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

Ensure that all changes for this release have been merged into the main branch. For patch releases, try landing any other bug fixes; for minor releases, ensure new features have been documented and tested. Major releases likely have their own checklist.

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

2. Install dev dependencies:
   ```
   npm ci
   ```

3. Prepare for the release commit:
   ```
   node build/prep-release.js @VERSION
   ```

   * Use `git add -p` to review the changes.
   * In `AUTHORS.txt`, if you see duplicate entries, then use the `.mailmap` file to normalize them to a canonical name and e-mail address, and then re-run the above command.
   * Edit `History.md` to remove changes not relevant to end-users (e.g. changes relating to tests, build, internal refactoring, doc fixes, etc.).

4. Build the release:
   ```
   node build/build-release.js @VERSION
   ```
   This script does not need any credentials or permissions, and may be run in a container that can only read-write the current directory. This will edit `package.json`, then execute `npm run build` to generate the release artifacts, then create a local clone of [jquery/codeorigin.jquery.com](https://github.com/jquery/codeorigin.jquery.com), and prepare a local commit for you to later push.

   Review the release artifacts, compared to the previous release.
   ```
   node build/review-package.js @LAST_VERSION

   # … review package.json, qunit.js, and qunit.css
   ```

   Commit your changes with the following message (replace `@VERSION` with the release version):
   ```
   Release @VERSION
   ```

   Push a `release` branch to GitHub.
   Once CI is passing, push again, this time to the (protected) `stable-2.x` branch.

## Publish the release

Verify that your local repo is on a clean checkout with HEAD at the release commit:

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
   ```
   npm publish
   ````
   This will bundle the current directory and publish it to npm with the name and version specified in `package.json`.
   Verify that the release is displayed at <https://www.npmjs.com/package/qunit>.

7. Publish to the jQuery CDN:
   Review the commit and push it:
   ```
   cd __codeorigin
   git show
   git push
   ```
   Verify that the release is listed at <https://code.jquery.com/qunit/> and that you can open the JS/CSS files.

## Final steps

You're almost there! Make sure you update [GitHub releases](https://github.com/qunitjs/qunit/releases) using the changelog from `History.md`.

That's it! If you made it this far, congratulations you have successfully released a version of QUnit!

_If anything in the above was inaccurate or unclear, improve it to mmake future releases easier!_
