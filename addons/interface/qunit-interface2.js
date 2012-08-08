QUnit.extend( QUnit, function() {
	var _testingForProperty = "";
	/**
	 * 
	 * @param {Object} actual
	 * @param {Object} expected
	 * @param {Boolean} deep
	 * @return {Boolean} true if equal structure, false if not
	 */
	function checkInterface(actual, expected, deep) {
		for (var prop in expected) {
			_testingForProperty = prop;
			if(deep && typeof actual[prop] === 'object') {
				if(!checkInterface(actual[prop], expected[prop], true)) {
					return false;	// not equal
				}
			} else {
				if(!actual[prop]) {
					return false;	//  not equal
				}
			}
		}
		return true;
	}
	return {
		equalStructure: function(actual, expected, message) {
			if(checkInterface(actual, expected)) {
				QUnit.push(true, actual, expected, message);
			} else {
				QUnit.push(false, actual, expected, message || _testingForProperty + ' is not a property of the actual object');
			}
		},
		deepEqualStructure: function(actual, expected, message) {
			if(checkInterface(actual, expected, true)) {
				QUnit.push(true, actual, expected, message);
			} else {				
				QUnit.push(false, actual, expected, message || _testingForProperty + ' is not a property of the actual object');
			}
		},
		notEqualStructure: function(actual, expected, message) {
			if(checkInterface(actual, expected)) {
				QUnit.push(false, actual, expected, message || _testingForProperty + ' is not a property of the actual object');
			} else {
				QUnit.push(true, actual, expected, message);
			}
		},
		notDeepEqualStructure: function(actual, expected, message) {
			if(checkInterface(actual, expected, true)) {
				QUnit.push(false, actual, expected, message || _testingForProperty + ' is not a property of the actual object');
			} else {
				QUnit.push(true, actual, expected, message);
			}
		}
	}
}());