var empty_me = ['start'];

module("multiple async tests with setup", {
	setup: function() {
		empty_me = [];
	}
});

asyncTest("async A", function() {
	equal(empty_me.length, 0, "setup should have emptied the array.");
	empty_me.push('A');
	start();
});

asyncTest("async B", function() {
	equal(empty_me.length, 0, "setup should have emptied the array.");
	empty_me.push('B');
	start();
});

asyncTest("async C", function() {
	equal(empty_me.length, 0, "setup should have emptied the array.");
	empty_me.push('C');
	start();
});


