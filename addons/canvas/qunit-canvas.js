(function (QUnit) {
	var slice = Array.prototype.slice;

	QUnit.extend( QUnit.assert, {
		pixelEqual: function (canvas, x, y, r, g, b, a, message) {
			var actual = slice.apply(canvas.getContext('2d').getImageData(x, y, 1, 1).data),
				expected = [r, g, b, a];

			// Based on assert.deepEqual, reproduced to preserve the expected number
			// of steps in the callstack from QUnit to test suite.
			QUnit.push(QUnit.equiv(actual, expected), actual, expected, message);
		}
	});

}(QUnit));
