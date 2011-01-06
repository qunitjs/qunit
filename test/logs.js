// TODO disable reordering for this suite!

var moduleStart = 0,
	moduleDone = 0;

QUnit.moduleStart = function() {
	moduleStart++;
};
QUnit.moduleDone = function() {
	moduleDone++;
};
QUnit.testStart = function() {
	ok(true, "testStart called once per test");
};
QUnit.testDone = function() {
	ok(true, "testDone called once per test");
};

module("logs 1");

test("test1", 3, function() {
	equal(moduleStart, 1, "moduleStart called once per module");
	equal(moduleDone, 0, "moduleDone called once per module");
});
test("test2", 3, function() {
	equal(moduleStart, 1, "moduleStart called once per module");
	equal(moduleDone, 0, "moduleDone called once per module");
});

module("logs 2");
	
test("test1", 3, function() {
	equal(moduleStart, 2, "moduleStart called once per module");
	equal(moduleDone, 1, "moduleDone called once per module");
});
test("test2", 3, function() {
	equal(moduleStart, 2, "moduleStart called once per module");
	equal(moduleDone, 1, "moduleDone called once per module");
});
