/**
 * It's hard to see a use-case for the not* methods other than testing the test code it self. But then the methods should share code :-S 
 */

QUnit.extend( QUnit, {
	equalStructure: function(actual, expected, message) {
		for(var prop in expected) {
			if(!actual[prop]) {
				QUnit.push(false, actual, expected, message || prop + ' is not a property of the actual object');
				return false; // if we continue and expected number of tests is set, then continuing will trigger an "Expected assertions run" failure
			}
		}
		QUnit.push(true, actual, expected, message);
	},
	deepEqualStructure: function(actual, expected, message) {
		this.structureTestingFor += ""; // create variable in QUnit
		for (var prop in expected) {
			//testProperty instanceof Object && typeof testProperty != 'function'
			if(typeof actual[prop] === 'object') {
				this.structureTestingFor = prop;
				if(!QUnit.deepEqualStructure(actual[prop], expected[prop], message)) {
					return false; // fail
				}
			} else {
				if(!actual[prop]) {
					QUnit.push(false, actual, expected, message || 'Expected ' + (this.structureTestingFor || prop) + ' but found ' + prop + '.');
					return false; // fail
				}
				//continue;
			}
		}
		delete this.structureTestingFor; // clean up variable in QUnit
		QUnit.push(true, actual, expected, message);
	},
	notEqualStructure: function(actual, expected, message) {
		for(var prop in expected) {
			if(!actual[prop]) {
				QUnit.push(true, actual, expected, message || prop + ' is not a property of the actual object');
				return;	// if we continue and expected number of tests is set, then continuing will trigger an "Expected assertions run" failure
			}
		}
		QUnit.push(false, actual, expected, message || 'The structures are equal at the first level.');
	},
	notDeepEqualStructure: function(actual, expected, message) {
		for (var prop in expected) {
			if(typeof actual[prop] === 'object') {
				return QUnit.notDeepEqualStructure(actual[prop], expected[prop], message)
			} else {
				if(!actual[prop]) {
					QUnit.push(true, actual, expected, message || prop + ' is not a property of the actual object.');
					return true;	// yes they doesn't have equal structure
				}
			}
		}
		QUnit.push(false, actual, expected, message || 'The structures are equal.');
	}
})