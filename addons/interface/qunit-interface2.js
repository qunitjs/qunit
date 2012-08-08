QUnit.extend( QUnit, function() {
	var _testingForProperty = "";
	/**
	 * Iterate over the properties of the expected object and look for corresponding properties on the actual object.
	 * If the optional deep argument is truthy then the function calls itself recursively to check nested properties. 
	 * @param {Object} actual
	 * @param {Object} expected
	 * @param {Boolean} [deep] OPTIONAL
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
		/**
		 * Iterate over the properties of the expected object and look for corresponding properties on the actual object. 
		 * @param {Object} actual
		 * @param {Object} expected
		 * @param {Object} [message] If not supplied then message will tell you which property that didn't exist on the actual object
		 */
		equalStructure: function(actual, expected, message) {
			if(checkInterface(actual, expected)) {
				QUnit.push(true, actual, expected, message);
			} else {
				QUnit.push(false, actual, expected, message || _testingForProperty + ' is not a property of the actual object');
			}
		},
		/**
		 * Iterate over the properties of the expected object and look for corresponding properties on the actual object. 
		 * @param {Object} actual
		 * @param {Object} expected
		 * @param {Object} [message] If not supplied then message will tell you which property that didn't exist on the actual object
		 */
		deepEqualStructure: function(actual, expected, message) {
			if(checkInterface(actual, expected, true)) {
				QUnit.push(true, actual, expected, message);
			} else {				
				QUnit.push(false, actual, expected, message || _testingForProperty + ' is not a property of the actual object');
			}
		},
		/**
		 * Iterate over the properties of the expected object and look for corresponding properties on the actual object. 
		 * @param {Object} actual
		 * @param {Object} expected
		 * @param {Object} [message] If not supplied then message will default to okay if the test succeed
		 */
		notEqualStructure: function(actual, expected, message) {
			if(checkInterface(actual, expected)) {
				QUnit.push(false, actual, expected, message);
			} else {
				QUnit.push(true, actual, expected, message);
			}
		},
		/**
		 * Iterate over the properties of the expected object and look for corresponding properties on the actual object. 
		 * @param {Object} actual
		 * @param {Object} expected
		 * @param {Object} [message] If not supplied then message will default to okay if the test succeed
		 */
		notDeepEqualStructure: function(actual, expected, message) {
			if(checkInterface(actual, expected, true)) {
				QUnit.push(false, actual, expected, message);
			} else {
				QUnit.push(true, actual, expected, message);
			}
		}
	}
}());