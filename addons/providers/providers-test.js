QUnit.module('Providers Addon');

// First test -- data array
(function(i, args) {
	QUnit.testWithProvider('Test data array', args, function(arg) {
		QUnit.equal(arg, args[i++], 'The correct argument is received in the test');
	});
}(0, [1, 2, 3]));

// Second test -- nested arrays
(function(i, args) {
	QUnit.testWithProvider('Test data array', args, function(arg) {
		QUnit.equal(arg, args[i++][0], 'The correct argument is received in the test');
	});
}(0, [[1], [2], [3]]));

// Third test -- array inception
(function(i, args) {
	QUnit.testWithProvider('Test data array', args, function(arg) {
		QUnit.deepEqual(arg, args[i++][0], 'The correct argument is received in the test');
	});
}(0, [[[1, 2, 3]], [[4, 5, 6]], [[7, 8, 9]]]));

// Fourth test -- function
(function(i, args) {
	QUnit.testWithProvider('Test data array', args, function(arg) {
		QUnit.deepEqual(arg, args()[i++][0], 'The correct argument is received in the test');
	});
}(0,
	// This returns the array inception
	function() {
		return [[[1, 2, 3]], [[4, 5, 6]], [[7, 8, 9]]];
	}));
