QUnit.extend( QUnit, {
	structure: function(actual, expected, message) {
		for(var prop in expected) {
			if(!actual[prop]) {
				QUnit.push(false, actual, expected, message || prop + ' is not a property of the actual object');
				return; // if we continue and expected number of tests is set, then continuing will trigger an "Expected assertions run" failure
			}
		}
		QUnit.push(true, actual, expected, message);
	},
	structureDeep: function(actual, expected, message) {
		for (var prop)
	}
});