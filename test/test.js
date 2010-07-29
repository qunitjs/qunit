test("module without setup/teardown (default)", function() {
	expect(1);
	ok(true);
});

test("expect in test", 3, function() {
	ok(true);
	ok(true);
	ok(true);
});

test("expect in test", 1, function() {
	ok(true);
});

module("setup test", {
	setup: function() {
		ok(true);
	}
});

test("module with setup", function() {
	expect(2);
	ok(true);
});

var state;

module("setup/teardown test", {
	setup: function() {
		state = true;
		ok(true);
	},
	teardown: function() {
		ok(true);
	}
});

test("module with setup/teardown", function() {
	expect(3);
	ok(true);
});

module("setup/teardown test 2");

test("module without setup/teardown", function() {
	expect(1);
	ok(true);
});

if (typeof setTimeout !== 'undefined') {
state = 'fail';

module("teardown and stop", {
	teardown: function() {
		equal(state, "done", "Test teardown.");
	}
});

test("teardown must be called after test ended", function() {
	expect(1);
	stop();
	setTimeout(function() {
		state = "done";
		start();
	}, 13);
});

module("async setup test", {
	setup: function() {
	  stop();
		setTimeout(function(){
	    ok(true);
			start();
		}, 500);
	}
});

asyncTest("module with async setup", function() {
	expect(2);
	ok(true);
	start();
});

module("async teardown test", {
	teardown: function() {
  	stop();
		setTimeout(function(){
	    ok(true);
		  start();
		}, 500);
	}
});

asyncTest("module with async teardown", function() {
	expect(2);
	ok(true);
	start();
});
} // end setTimeout tests

if (typeof asyncTest !== 'undefined') {
module("asyncTest");

asyncTest("asyncTest", function() {
	expect(2);
	ok(true);
	setTimeout(function() {
		state = "done";
		ok(true);
		start();
	}, 13);
});

asyncTest("asyncTest", 2, function() {
	ok(true);
	setTimeout(function() {
		state = "done";
		ok(true);
		start();
	}, 13);
});
} // end asyncTest tests

module("save scope", {
	setup: function() {
		this.foo = "bar";
	},
	teardown: function() {
		deepEqual(this.foo, "bar");
	}
});
test("scope check", function() {
	expect(2);
	deepEqual(this.foo, "bar");
});

module("simple testEnvironment setup", {
	foo: "bar",
	bugid: "#5311" // example of meta-data
});
test("scope check", function() {
	deepEqual(this.foo, "bar");
});
test("modify testEnvironment",function() {
	this.foo="hamster";
});
test("testEnvironment reset for next test",function() {
	deepEqual(this.foo, "bar");
});

module("testEnvironment with object", {
	options:{
		recipe:"soup",
		ingredients:["hamster","onions"]
	}
});
test("scope check", function() {
	deepEqual(this.options, {recipe:"soup",ingredients:["hamster","onions"]}) ;
});
test("modify testEnvironment",function() {
	// since we do a shallow copy, the testEnvironment can be modified
	this.options.ingredients.push("carrots");
});
test("testEnvironment reset for next test",function() {
	deepEqual(this.options, {recipe:"soup",ingredients:["hamster","onions","carrots"]}, "Is this a bug or a feature? Could do a deep copy") ;
});


module("testEnvironment tests");

function makeurl() {
	var testEnv = QUnit.current_testEnvironment;
	var url = testEnv.url || 'http://example.com/search';
	var q   = testEnv.q   || 'a search test';
	return url + '?q='+encodeURIComponent(q);
}

test("makeurl working",function() {
	equal( QUnit.current_testEnvironment, this, 'The current testEnvironment is global');
	equal( makeurl(), 'http://example.com/search?q=a%20search%20test', 'makeurl returns a default url if nothing specified in the testEnvironment');
});

module("testEnvironment with makeurl settings", {
	url:'http://google.com/',
q:'another_search_test'
});
test("makeurl working with settings from testEnvironment", function() {
	equal( makeurl(), 'http://google.com/?q=another_search_test', 'rather than passing arguments, we use test metadata to form the url');
});
test("each test can extend the module testEnvironment", {
	q:'hamstersoup'
}, function() {
	equal( makeurl(), 'http://google.com/?q=hamstersoup', 'url from module, q from test');	
});

module("jsDump");
test("jsDump output", function() {
	equals( QUnit.jsDump.parse([1, 2]), "[ 1, 2 ]" );
	equals( QUnit.jsDump.parse({top: 5, left: 0}), "{ \"top\": 5, \"left\": 0 }" );
	if (typeof document !== 'undefined') {
		equals( QUnit.jsDump.parse(document.getElementById("qunit-header")), "<h1 id=\"qunit-header\"></h1>" );
		equals( QUnit.jsDump.parse(document.getElementsByTagName("h1")), "[ <h1 id=\"qunit-header\"></h1> ]" );
	}
});

module("diff");
test("basics", function() {
	var expected = "<em>the</em> quick <del>brown </del> fox <del>jumped </del><del><strong>over</strong> </del><ins>jumps </ins><ins><strong>o</strong>ver </ins>",
		// for some reason, the diff output has some misleading whitespace; doesn't matter when outputting html
		actual = QUnit.diff("<em>the</em> quick brown fox jumped <strong>over</strong>", "<em>the</em> quick fox jumps <strong>o</strong>ver").replace(/^\s+/, '').replace(/\s+$/, '');
	equal(actual, expected); 
});

module("assertions");
test("raises", function() {
	function thrower1() {
		throw 'Errored!';
	}
	function thrower2() {
		throw new TypeError("Type!");
	}
	function thrower3() {
		throw {message:"Custom!"};
	}
	raises(thrower1, 'Errored!', 'throwing string');
	raises(thrower2, 'Type!', 'throwing TypeError instance');
	raises(thrower3, 'Custom!', 'throwing custom object');
});

/* currently fixture reset depends on jQuery's html() method, can't test that, yet
module("fixture");
test("setup", function() {
	document.getElementById("qunit-fixture").innerHTML = "foobar";
});
test("basics", function() {
	equal( document.getElementById("qunit-fixture").innerHTML, "test markup", "automatically reset" );
});
*/