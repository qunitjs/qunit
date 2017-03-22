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
TAP version 13
ok 1 foo
1..1
# pass 1
# skip 0
# todo 0
# fail 0
Stopping QUnit...`
};
