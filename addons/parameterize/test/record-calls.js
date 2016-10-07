var recordCalls = function(qunit, methodName, action) {
	var realMethod = qunit[methodName];
	var callsArguments = [];

	qunit[methodName] = function() {
		callsArguments.push(arguments);
	};

	try {
		action();
	}
	finally {
		qunit[methodName] = realMethod;
	}
	
	return {
		getArguments : function() { return callsArguments; },
		neverCalled : function() { return callsArguments.length == 0; },
	};
};
