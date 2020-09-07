# Release Process

This guide walks you through a QUnit release.

⚠️ **WARNING** ⚠️

> Before attempting the process below, make sure you have:
>
> * **Permission to publish to the jQuery CDN** via [jquery/codeorigin.jquery.com](https://github.com/jquery/codeorigin.jquery.com).
> * Permission to publish releases to npm for the [`qunit`](https://www.npmjs.com/package/qunit) npm package.
> * Permission to publish the website via [qunitjs/qunit.com](https://github.com/qunitjs/qunitjs.com).

Prerequisites:

* Node.js 12, or later.
* Git 2.11, or later.
* [git-extras](https://github.com/tj/git-extras), for the `git changelog` utility.

1. Ensure that all changes for this release have been merged into the main branch. For patch releases, try landing any other bug fixes; for minor releases, ensure new features have been documented and tested. Major releases likely have their own checklist.

2. Ensure that you have a prestine copy of the canonical repo (not a fork), and create a local  `release` branch:
   * Run `git remote -v` and verify the following:
   ```
   origin	git@github.com:qunitjs/qunit.git
   ```
   * Create or reset your `release` branch:
   ```
   git remote update && git checkout -B release -t origin/master
   ```

3. Install dev dependencies and run the tests:
   ```
   npm ci && npm test
   ```
   Run the tests in various real browsers as well, either locally or via [BrowserStack](https://www.browserstack.com/):
   ```
   npm run serve
   open 'http://localhost:4000/test/'
   ```

4. Create and push the release preparation commit:

   1. Run `git changelog -s <SHA1 of last preparation commit>` to update `History.md`. Clean up:
      * Replace `n.n.n` in the top section with the next release,
      * Ensure the previous release notes are still there,
      * Ensure there is no leading or trailing whitespace on blank lines,
      * Remove any "Build", "Tests" and other commits not relevant to users,
      * Refer to the formatting of previous entries when in doubt.
   2. Update the package.json and AUTHORS.txt files, by running the below command (replace `@VERSION` with the release version):
      ```
      node build/prep-release.js @VERSION
      ```
      Review the difference in the `AUTHORS.txt` file. If you see duplicate entries proposed, then use the `.mailmap` file to normamlize those entries to a canonical name or e-mail address, and then re-run the above command.
   3. Commit all of the above with the following message (replace `@VERSION` with the release version):
      ```
      Build: Prepare @VERSION release, including authors and history update
      ```
   4. Push your `release` branch to GitHub.
   5. Create a pull request, approve it, and merge it once Travis CI is passing.

## Performing the release

1. Create a local  `release` branch, and ensure you're working on the canonical repo (not a fork):
   * Run `git remote -v` and verify the following:
   ```
   origin git@github.com:qunitjs/qunit.git
   ```
   * Create or reset your `release` branch:
   ```
   git remote update && git checkout -B release -t origin/master
   ```

2. Ensure that the latest commit is your release preparation commit:
   ```
   git show
   # Build: Prepare x.y.z release
   # …
   ```

3. Set the release version for npm and Bower metadata, by running the below command (replace `@VERSION` with the release version):
   ```
   node build/set-release.js @VERSION
   ```
   This script will edit `package.json` and `bower.json` for you. It does not require any credentials or permissions, apart from read-write in the project directory.

4. Generate the release artifacts:
   ```
   npm run build
   ```

5. Rename `dist/` to `qunit/`:
   ```
   mv dist/ qunit/
   ```

6. Create the release commit, tag it, and push the tag to GitHub (replace `@VERSION` with the release version).<br>⚠️ Do not commit or push release artifacts to the main branch!
   ```
   git add package.json bower.json qunit/
   git commit -m "Release @VERSION"
   git tag -s "@VERSION" -m "Release @VERSION"
   git push --tags
   ```

7. Verify that Bower sees the release, by running `bower info qunit` and checking that the latest
   version is indeed the version we just published.

8. Publish the release to npm:
   * Use `git status` to confirm once more that your checkout is clean apart from the release artifacts in `qunit/`.
   * Run `npm publish`, this will bundle the current directory and publish it to npm with the name and version specified in `package.json`.
   * Verify that the release is displayed at <https://www.npmjs.com/package/qunit>.

9. Publish the release to the jQuery CDN:
   * Prepare the commit locally:
   ```
   node build/auth-cdn-commit.js real @VERSION
   ```
   This will clone [jquery/codeorigin.jquery.com](https://github.com/jquery/codeorigin.jquery.com), copy the `qunit/` release artifacts and rename them to `qunit-@VERSION`, and create a local commit.
   * Review the commit and push it:
   ```
   cd __codeorigin
   git show
   # …
   git push
   ```
   * Verify via <https://code.jquery.com/qunit/qunit-x.y.z.js>

## Updating the website

Once you have successfully published the new release, we need to update the website.

    git clone git@github.com:qunitjs/qunitjs.com.git
    cd qunitjs.com

Checkout the latest `master` branch of the website repo.

Do a find and replace of the previous version number and insert the new version number. Commit these changes with the following message:

	All: Update url and version to @VERSION

Then push the commit:

	git push

Check the website in a few minutes after a build completes to verify it is updated.

## Final steps

You're almost there! Make sure you update [GitHub releases](https://github.com/qunitjs/qunit/releases) using the changelog from `History.md`.

Finally, make an announcement on the [@qunitjs](https://twitter.com/qunitjs) Twitter account. Mention highlights of the release if possible and feel free to include a second tweet if needed, but be sure to include a link to the release page like so:

	Released @VERSION: https://github.com/qunitjs/qunit/releases/tag/x.y.z

That's it! If you made it this far, congratulations you have successfully released a version of QUnit!

_If anything in the above was inaccurate or unclear, improve it to mmake future releases easier!_
