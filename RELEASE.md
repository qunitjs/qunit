# Release process

This guide walks you through the QUnit release.

⚠️ **WARNING** ⚠️

> Before starting, make sure you have:
>
> * **Permission to publish to the jQuery CDN** via [jquery/codeorigin.jquery.com](https://github.com/jquery/codeorigin.jquery.com).
> * Permission to publish releases to npm for the [`qunit`](https://www.npmjs.com/package/qunit) npm package.
> * Permission to publish the website via [qunitjs/qunit.com](https://github.com/qunitjs/qunitjs.com).
>
> System prerequisites:
>
> * Node.js 12, or later.
> * Git 2.11, or later.

1. Ensure that all changes for this release have been merged into the main branch. For patch releases, try landing any other bug fixes; for minor releases, ensure new features have been documented and tested. Major releases likely have their own checklist.

2. Create a local  `release` branch, and ensure it is up-to-date:
   * Verify that the canonical repository is cloned (not a fork):
   ```
   git remote -v
   # …
   # origin	git@github.com:qunitjs/qunit.git
   ```
   * Create or reset the `release` branch:
   ```
   git remote update && git checkout -B release -t origin/master
   ```

3. Install dev dependencies and run the tests:
   ```
   npm ci && npm test
   ```
   Run the tests in various real browsers, either locally or via [BrowserStack](https://www.browserstack.com/):
   ```
   python3 -m http.server 4000
   # or:
   # php -S localhost:4000

   open http://localhost:4000/test/
   ```

4. Create and push the release preparation commit:

   1. Update the package.json and AUTHORS.txt files, by running the below command (replace `@VERSION` with the release version):
      ```
      node build/prep-release.js @VERSION
      ```
      * Use `git add -p` to review the changes.
      * In `AUTHORS.txt`, if you see duplicate entries, then use the `.mailmap` file to normalize them to a canonical name and e-mail address, and then re-run the above command.
      * Edit `History.md` to remove change not relevant to end-users (e.g. changes relating to tests, build, internal refactoring, doc fixes, etc.).
   2. Commit the above changes with the following message (replace `@VERSION` with the release version):
      ```
      Build: Prepare @VERSION release
      ```
   3. Push the `release` branch to GitHub.
   4. Create a pull request, and merge it once Travis CI is passing.

## Performing the release

5. Create a local  `release` branch, and ensure it is up-to-date:
   * Run `git remote -v` and verify the following:
   ```
   origin git@github.com:qunitjs/qunit.git
   ```
   * Create or reset the `release` branch:
   ```
   git remote update && git checkout -B release -t origin/master
   ```
   * Verify that the latest commit is your release preparation commit:
   ```
   git show
   # Build: Prepare x.y.z release
   # …
   ```

6. Make changes for the release commit:
   * Set the release version for npm and Bower metadata (replace `@VERSION` with the release version):
   ```
   node build/set-release.js @VERSION
   ```
   This script will edit `package.json` and `bower.json`. It does not need any credentials or permissions, apart from read-write in the project directory.

   * Generate the release artifacts:
   ```
   export SOURCE_DATE_EPOCH="$(git log -s --format=%at -1)"
   npm run build
   ```

   * Rename `dist/` to `qunit/`:
   ```
   mv dist/ qunit/
   ```

   * Review the changes to the package and library files, compared to the previous release.
   ```
   node build/review-package.js @LAST_VERSION

   # … reviews package.json, qunit.js, and qunit.css
   ```

7. Commit and publish the release to GitHub.<br>⚠️ Do not push to the main branch!
   ```
   git add package.json bower.json qunit/
   git commit -m "Release @VERSION"
   git tag -s "@VERSION" -m "Release @VERSION"
   git push --tags
   ```

8. Verify that Bower sees the release, by running `bower info qunit` and checking that the latest
   version is indeed the version we just published.

9. Publish the release to npm:
   * Use `git status` to confirm once more that you have a clean working copy, apart from release artifacts in `qunit/`.
   * Run `npm publish`, this will bundle the current directory and publish it to npm with the name and version specified in `package.json`.
   * Verify that the release is displayed at <https://www.npmjs.com/package/qunit>.

10. Publish the release to the jQuery CDN:
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
   * Verify that the release is listed at <https://code.jquery.com/qunit/> and accessible via <https://code.jquery.com/qunit/qunit-x.y.z.js>

## Updating the website

After the release is published, we need to update the website.

Check out the main branch of the [qunitjs/qunitjs.com](https://github.com/qunitjs/qunitjs.com) repository, and ensure it is clean and up-to-date. Update release links and demos to use the version we just released, using this script:

```
qunitjs.com$ node build/set-version.js <version>
```

Stage the changes it made, and commit with the following message:

```
All: Update url and version to <version>
```

Push the commit, and check the website in a few minutes to verify the change ([deployment log](https://github.com/qunitjs/qunitjs.com/deployments/activity_log?environment=github-pages)).

## Final steps

You're almost there! Make sure you update [GitHub releases](https://github.com/qunitjs/qunit/releases) using the changelog from `History.md`.

Finally, make an announcement on the [@qunitjs](https://twitter.com/qunitjs) Twitter account. Mention highlights of the release if possible, andinclude a link to the release page.

That's it! If you made it this far, congratulations you have successfully released a version of QUnit!

_If anything in the above was inaccurate or unclear, improve it to mmake future releases easier!_
