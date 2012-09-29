JUnit Logger
============

A QUnit extension that produces JUnit-style XML output for test results, for integration into tools like Jenkins.

## Usage

Include the addon script after QUnit itself, and implement the hook to do something with the XML string, for example uploading it to a server somewhere:

```js
QUnit.jUnitReport = function(data) {
	console.log(data.xml);
};
```

As you might guess, this isn't a full-blown solution, yet.

## Alternatives

If you're using Grunt, you should take a look at its [qunit task](https://github.com/cowboy/grunt/blob/master/docs/task_qunit.md). Or use [John Bender's grunt-junit plugin](https://github.com/johnbender/grunt-junit) to have the `qunit` task output JUnit-style XML, as this reporter does.