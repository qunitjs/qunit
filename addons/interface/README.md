Interface - A QUnit Addon For Testing Object Structure
================================
This addon for QUnit adds `equalStructure`, `deepEqualStructure`, `notEqualStructure` and `notDeepEqualStructure` assertion methods, to test that
object structure (called Interface in static languages) are as you expect. Unlike equal and notEqual which also test the values of an object.

Motivation:

As a front end developer you are at the mercy of server-side devs providing, and most importantly NOT subsequently altering, the structure of your data objects.
Getting told that your work doesn't work because someone changed a name of a property at the server or even database level is never fun.
**Interface** comes to the rescue!

Usage:

+ `QUnit.equalStructure(actual, expected, [message])` message will default to _* is not a property of the actual object'_ or _The structures are equal._ if not provided.
+ `QUnit.deepEqualStructure(actual, expected, [howdeep], [message])` message will default to _* is not a property of the actual object'_ or _The structures are equal_ if not provided.
+ `QUnit.notEqualStructure(actual, expected, [message])` message will default to _okay_ if the test succeed or _The structures are equal_ if it fails.
+ `QUnit.notDeepEqualStructure(actual, expected, [howdeep],[message])` message will default to _okay_ if the test succeed or _The structures are equal_ if it fails.

\* is the property beeing tested.
`[howdeep]` is how many levels of nested objects/arrays you want to test the structure of, where 0 is the first level. 