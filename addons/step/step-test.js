QUnit.module("Step Addon");

QUnit.test("step", 3, function (assert) {
	assert.step(1, "step starts at 1");

	QUnit.stop();

	setTimeout(function () {
		QUnit.start();

		assert.step(3);

	}, 100);

	assert.step(2, "before the setTimeout callback is run");

});

QUnit.test("step counter", 1, function (assert) {
	assert.step(1, "each test has its own step counter");
});
