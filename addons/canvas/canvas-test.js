QUnit.module("Canvas Addon");

QUnit.asyncTest("Canvas pixels", function (assert) {
	var context,
		canvas = document.getElementById('qunit-canvas'),
		imageObj = new Image();
	try {
		context = canvas.getContext('2d');
	} catch(e) {
		// probably no canvas support, just exit
		return;
	}

	QUnit.expect(17);

	// how to use pixelEqual() in conjunction with HTML drawing
	context.fillStyle = 'rgba(0, 0, 0, 0)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 0, 0, 0, 0, 0, 0);
	context.clearRect(0, 0, 5, 5);
	context.fillStyle = 'rgba(255, 0, 0, 0)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 0, 0, 0, 0, 0, 0);
	context.clearRect(0, 0, 5, 5);
	context.fillStyle = 'rgba(0, 255, 0, 0)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 0, 0, 0, 0, 0, 0);
	context.clearRect(0, 0, 5, 5);
	context.fillStyle = 'rgba(0, 0, 255, 0)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 0, 0, 0, 0, 0, 0);
	context.clearRect(0, 0, 5, 5);

	context.fillStyle = 'rgba(0, 0, 0, 0.6)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 0, 0, 0, 0, 0, 153);
	context.clearRect(0, 0, 5, 5);
	context.fillStyle = 'rgba(255, 0, 0, 0.6)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 0, 0, 255, 0, 0, 153);
	context.clearRect(0, 0, 5, 5);
	context.fillStyle = 'rgba(0, 255, 0, 0.6)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 0, 0, 0, 255, 0, 153);
	context.clearRect(0, 0, 5, 5);
	context.fillStyle = 'rgba(0, 0, 255, 0.6)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 0, 0, 0, 0, 255, 153);
	context.clearRect(0, 0, 5, 5);

	context.fillStyle = 'rgba(0, 0, 0, 0.6)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 2, 2, 0, 0, 0, 153);
	context.clearRect(0, 0, 5, 5);
	context.fillStyle = 'rgba(255, 0, 0, 0.6)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 2, 2, 255, 0, 0, 153);
	context.clearRect(0, 0, 5, 5);
	context.fillStyle = 'rgba(0, 255, 0, 0.6)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 2, 2, 0, 255, 0, 153);
	context.clearRect(0, 0, 5, 5);
	context.fillStyle = 'rgba(0, 0, 255, 0.6)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 2, 2, 0, 0, 255, 153);
	context.clearRect(0, 0, 5, 5);

	context.fillStyle = 'rgba(0, 0, 0, 1)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 4, 4, 0, 0, 0, 255);
	context.clearRect(0, 0, 5, 5);
	context.fillStyle = 'rgba(255, 0, 0, 1)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 4, 4, 255, 0, 0, 255);
	context.clearRect(0, 0, 5, 5);
	context.fillStyle = 'rgba(0, 255, 0, 1)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 4, 4, 0, 255, 0, 255);
	context.clearRect(0, 0, 5, 5);
	context.fillStyle = 'rgba(0, 0, 255, 1)';
	context.fillRect(0, 0, 5, 5);
	assert.pixelEqual(canvas, 4, 4, 0, 0, 255, 255);
	context.clearRect(0, 0, 5, 5);

	// how to use pixelEqual() in conjunction with drawImage()
	imageObj.onload = function() {
		context.drawImage( imageObj, 0, 0 );
		assert.pixelEqual( canvas, 3, 3, 0, 255, 0, 255, "green pixel" );
		QUnit.start();
	};
	imageObj.src = "./0-255-0.gif";
});
