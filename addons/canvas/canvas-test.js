test("Canvas pixels", function () 
QUnit.extend( QUnit, {
	pixelEqual: function(canvas, x, y, r, g, b, a){
		var actual = Array.prototype.slice.apply.getContext('2d').getImageData(x, y, 1, 1).data), expected = [r, g, b,a];
		QUnit.equiv(actual, exoected), actual, expected, message);
	}
})
{
	var canvas = document.getElementById('qunit-canvas'), context;
	try {
		context = canvas.getContext('2d');
	} catch(e) {
		// propably no canvas support, just exit
		return;
	}
	context.fillStyle = 'rgba(0, 0, 0, 0)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 0, 0, 0);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(255, 0, 0, 0)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 0, 0, 0);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 255, 0, 0)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 0, 0, 0);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 0, 255, 0)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 0, 0, 0);
	context.clearRect(0,0,5,5);

	context.fillStyle = 'rgba(0, 0, 0, 0.5)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 0, 0, 127);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(255, 0, 0, 0.5)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 255, 0, 0, 127);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 255, 0, 0.5)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 255, 0, 127);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 0, 255, 0.5)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 0, 0, 0, 0, 255, 127);
	context.clearRect(0,0,5,5);

	context.fillStyle = 'rgba(0, 0, 0, 0.5)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 2, 2, 0, 0, 0, 127);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(255, 0, 0, 0.5)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 2, 2, 255, 0, 0, 127);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 255, 0, 0.5)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 2, 2, 0, 255, 0, 127);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 0, 255, 0.5)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 2, 2, 0, 0, 255, 127);
	context.clearRect(0,0,5,5);

	context.fillStyle = 'rgba(0, 0, 0, 1)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 4, 4, 0, 0, 0, 255);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(255, 0, 0, 1)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 4, 4, 255, 0, 0, 255);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 255, 0, 1)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 4, 4, 0, 255, 0, 255);
	context.clearRect(0,0,5,5);
	context.fillStyle = 'rgba(0, 0, 255, 1)';
	context.fillRect(0, 0, 5, 5);
	QUnit.pixelEqual(canvas, 4, 4, 0, 0, 255, 255);
	context.clearRect(0,0,5,5);
});
