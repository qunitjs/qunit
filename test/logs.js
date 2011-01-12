// TODO disable reordering for this suite!


var begin = 0,
	moduleStart = 0,
	moduleDone = 0,
	testStart = 0,
	testDone = 0,
	log = 0,
	moduleName,
	testName;

QUnit.begin = function() {
	begin++;
};
QUnit.done = function() {
};
QUnit.moduleStart = function(name) {
	moduleStart++;
	moduleName = name;
};
QUnit.moduleDone = function() {
	moduleDone++;
};
QUnit.testStart = function(name) {
	testStart++;
	testName = name;
};
QUnit.testDone = function() {
	testDone++;
};
QUnit.log = function() {
	log++;
};

var logs = ["begin", "testStart", "testDone", "log", "moduleStart", "moduleDone", "done"];
for (var i = 0; i < logs.length; i++) {
	(function() {
		var log = logs[i],
			logger = QUnit[log];
		QUnit[log] = function() {
			console.log(log, arguments);
			logger.apply(this, arguments);
		};
	})();
}

module("logs1");

test("test1", 8, function() {
	equal(begin, 1);
	equal(moduleStart, 1);
	equal(testStart, 1);
	equal(testDone, 0);
	equal(moduleDone, 0);
	equal(moduleName, "logs1");
	equal(testName, "test1");
	equal(log, 7);
});
test("test2", 8, function() {
	equal(begin, 1);
	equal(moduleStart, 1);
	equal(testStart, 2);
	equal(testDone, 1);
	equal(moduleDone, 0);
	equal(moduleName, "logs1");
	equal(testName, "test2");
	equal(log, 15);
});

module("logs2");
	
test("test1", 8, function() {
	equal(begin, 1);
	equal(moduleStart, 2);
	equal(testStart, 3);
	equal(testDone, 2);
	equal(moduleDone, 1);
	equal(moduleName, "logs2");
	equal(testName, "test1");
	equal(log, 23);
});
test("test2", 8, function() {
	equal(begin, 1);
	equal(moduleStart, 2);
	equal(testStart, 4);
	equal(testDone, 3);
	equal(moduleDone, 1);
	equal(moduleName, "logs2");
	equal(testName, "test2");
	equal(log, 31);
});
