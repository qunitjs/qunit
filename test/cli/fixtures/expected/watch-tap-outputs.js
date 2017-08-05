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
File changed: watching/foo.js
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
File added: watching/bar.js
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
File removed: watching/bar.js
Restarting...
TAP version 13
ok 1 foo
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Stopping QUnit...`,

	"change-file-mid-run": `TAP version 13
File changed: watching/bar.js
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
File changed: watching/tests/foo.js
File added: watching/bar.js
Restarting...
TAP version 13
ok 1 Module > Test
1..1
# pass 1
# skip 0
# todo 0
# fail 0
File changed: watching/bar.js
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
