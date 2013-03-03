module("Step Addon");

test("step", 3, function (assert) {
	assert.step(1, "step starts at 1");
	setTimeout(function () {
		start();
		assert.step(3);
	}, 100);
	assert.step(2, "before the setTimeout callback is run");
	stop();
});

test("step counter resets", 1, function (assert) {
	assert.step(1, "each test has its own step counter");
});
