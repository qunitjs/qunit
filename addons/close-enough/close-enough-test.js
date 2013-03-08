module("CloseEnough Addon");

test("Close Numbers", function (assert) {
	var halfPi = Math.PI / 2,
		sqrt2 = Math.sqrt(2);

	assert.close(7, 7, 0);
	assert.close(7, 7.1, 0.1);
	assert.close(7, 7.1, 0.2);

	assert.close(3.141, Math.PI, 0.001);
	assert.close(3.1, Math.PI, 0.1);

	assert.close(halfPi, 1.57, 0.001);

	assert.close(sqrt2, 1.4142, 0.0001);

	assert.close(Infinity, Infinity, 1);
});

test("Distant Numbers", function (assert) {
	var halfPi = Math.PI / 2,
		sqrt2 = Math.sqrt(2);

	assert.notClose(6, 7, 0);
	assert.notClose(7, 7.2, 0.1);
	assert.notClose(7, 7.2, 0.19999999999);

	assert.notClose(3.141, Math.PI, 0.0001);
	assert.notClose(3.1, Math.PI, 0.001);

	assert.notClose(halfPi, 1.57, 0.0001);

	assert.notClose(sqrt2, 1.4142, 0.00001);

	assert.notClose(Infinity, -Infinity, 5);
});
