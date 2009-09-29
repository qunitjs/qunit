test("module without setup/teardown (default)", function() {
	expect(1);
	ok(true);
});

module("setup test", {
	setup: function() {
		ok(true);
	}
});

test("module with setup", function() {
	expect(2);
	ok(true);
})

module("setup/teardown test", {
	setup: function() {
		window.fail = true;
		ok(true);
	},
	teardown: function() {
		delete window.fail;
		ok(true);
	}
});

test("module with setup/teardown", function() {
	expect(3);
	ok(true);
})

module("setup/teardown test 2");

test("module without setup/teardown", function() {
	expect(1);
	ok(true);
});

var state;

module("teardown and stop", {
	teardown: function() {
		ok(state == "done");
	}
});

test("teardown must be called after test ended", function() {
	
	expect(1);
	stop();
	setTimeout(function() {
		state = "done";
		start();
	}, 0);
});

module("save scope", {
	setup: function() {
		this.foo = "bar";
	},
	teardown: function() {
		same(this.foo, "bar");
	}
});
test("scope check", function() {
	expect(2);
	same(this.foo, "bar");
});
