module.exports = {
	"no-change": `TAP version 13
ok 1 foo
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Stopping QUnit...`,

	"change-file": `TAP version 13
ok 1 foo
1..1
# pass 1
# skip 0
# todo 0
# fail 0
File update: watching/foo.js
Restarting...
TAP version 13
ok 1 bar
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Stopping QUnit...`,

	"add-file": `TAP version 13
ok 1 foo
1..1
# pass 1
# skip 0
# todo 0
# fail 0
File update: watching/bar.js
Restarting...
TAP version 13
ok 1 bar
ok 2 foo
1..2
# pass 2
# skip 0
# todo 0
# fail 0
Stopping QUnit...`,

	"remove-file": `TAP version 13
ok 1 bar
ok 2 foo
1..2
# pass 2
# skip 0
# todo 0
# fail 0
File remove: watching/bar.js
Restarting...
TAP version 13
ok 1 foo
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Stopping QUnit...`,

	"file-extensions": `TAP version 13
ok 1 foo
1..1
# pass 1
# skip 0
# todo 0
# fail 0
File update: watching/x.cjs
File update: watching/x.js
File update: watching/x.json
File update: watching/x.mjs
File update: watching/tests/foo.js
File update: watching/tests/setup.js
Restarting...
TAP version 13
ok 1 foo2
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Stopping QUnit...`,

	"change-file-mid-run": `TAP version 13
File update: watching/bar.js
Finishing current test and restarting...
ok 1 Foo > one
1..2
# pass 2
# skip 0
# todo 0
# fail 0
TAP version 13
ok 1 Foo > one
ok 2 Foo > two
1..2
# pass 2
# skip 0
# todo 0
# fail 0
Stopping QUnit...`,

	"add-file-after-run": `TAP version 13
ok 1 Module > Test
1..1
# pass 1
# skip 0
# todo 0
# fail 0
File update: watching/tests/foo.js
File update: watching/bar.js
Restarting...
TAP version 13
ok 1 Module > Test
1..1
# pass 1
# skip 0
# todo 0
# fail 0
File update: watching/bar.js
Restarting...
TAP version 13
ok 1 Module > Test
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Stopping QUnit...`
};
