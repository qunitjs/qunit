QUnit.extend( QUnit, function() {
	var _testingForProperty = "", _depth = 0;
	/**
	 * Iterate over the properties of the expected object and look for corresponding properties on the actual object.
	 * If the optional deep argument is truthy then the function calls itself recursively to check nested properties. 
	 * @param {Object} actual
	 * @param {Object} expected
	 * @param {Boolean} [deep] OPTIONAL
	 * @param {Number} [howdeep] OPTIONAL Where 0 is the first level
	 * @return {Boolean} true if equal structure, false if not
	 */
	function checkInterface(actual, expected, deep, howdeep) {
		howdeep = howdeep || 100;	// is there any use-case where we need to check more than a hundred nested objects?
		for (var prop in expected) {
			_testingForProperty = prop;
			if(deep && _depth <= howdeep && typeof actual[prop] === 'object') {
				++_depth;			// count the current depth
				if(!checkInterface(actual[prop], expected[prop], true, howdeep)) {
					_depth = 0;		// reset depth before exit
					return false;	// not equal
				}
			} else {
				if(!actual[prop]) {
					return false;	//  not equal
				}
			}
		}
		_depth = 0;					// reset depth before exit
		return true;				// equal
	}
	return {
		/**
		 * Iterate over the properties of the expected object and look for corresponding properties on the actual object. 
		 * @param {Object} actual
		 * @param {Object} expected
		 * @param {Object} [message] If not supplied then message will tell you which property that didn't exist on the actual object or 'The structures are equal' if the test succeed
		 */
		equalStructure: function(actual, expected, message) {
			if(checkInterface(actual, expected)) {
				QUnit.push(true, actual, expected, message || 'The structures are equal');
			} else {
				QUnit.push(false, actual, expected, message || _testingForProperty + ' is not a property of the actual object');
			}
		},
		/**
		 * Iterate over the properties of the expected object and look for corresponding properties on the actual object. 
		 * @param {Object} actual
		 * @param {Object} expected
		 * @param {Number} [howdeep] Where 0 is the first level
		 * @param {Object} [message] If not supplied then message will tell you which property that didn't exist on the actual object or 'The structures are equal' if the test succeed
		 */
		deepEqualStructure: function(actual, expected, howdeep, message) {
			if(howdeep && isNaN(howdeep)) {	// this check is put here to give the correct line number
				throw new TypeError('the howdeep argument (argument 3) is not a number');
			}
			if(checkInterface(actual, expected, true, howdeep)) {
				QUnit.push(true, actual, expected, message || 'The structures are equal');
			} else {				
				QUnit.push(false, actual, expected, message || _testingForProperty + ' is not a property of the actual object');
			}
		},
		/**
		 * Iterate over the properties of the expected object and look for corresponding properties on the actual object. 
		 * @param {Object} actual
		 * @param {Object} expected
		 * @param {Object} [message] If not supplied then message will default to 'The structures are equal' if the test fails
		 */
		notEqualStructure: function(actual, expected, message) {
			if(checkInterface(actual, expected)) {
				QUnit.push(false, actual, expected, message || 'The structures are equal');
			} else {
				QUnit.push(true, actual, expected, message);
			}
		},
		/**
		 * Iterate over the properties of the expected object and look for corresponding properties on the actual object. 
		 * @param {Object} actual
		 * @param {Object} expected
		 * @param {Number} [howdeep] Where 0 is the first level
		 * @param {Object} [message] If not supplied then message will default to 'The structures are equal' if the test fails
		 */
		notDeepEqualStructure: function(actual, expected, howdeep, message) {
			if(howdeep && isNaN(howdeep)) {	// this check is put here to give the correct line number
				throw new TypeError('the howdeep argument (argument 3) is not a number');
			}
			if(checkInterface(actual, expected, true, howdeep)) {
				QUnit.push(false, actual, expected, message || 'The structures are equal');
			} else {
				QUnit.push(true, actual, expected, message);
			}
		}
	}
}());
