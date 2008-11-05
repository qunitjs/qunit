/*
 * QUnit - jQuery unit testrunner
 * 
 * http://docs.jquery.com/QUnit
 *
 * Copyright (c) 2008 John Resig, Jörn Zaefferer
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Id$
 */

(function($) {
	
var config = {
	stats: {
		all: 0,
		bad: 0
	},
	queue: [],
	// block until document ready
	blocking: true,
	//restrict modules/tests by get parameters
	filters: location.search.length > 1 && $.map( location.search.slice(1).split('&'), decodeURIComponent ),
	isLocal: !!(window.location.protocol == 'file:')
};

// public API as global methods
$.extend(window, {
	test: test,
	module: module,
	expect: expect,
	ok: ok,
	equals: equals,
	start: start,
	stop: stop,
	reset: reset,
	isLocal: config.isLocal,
	same: function(a, b, message) {
		push(equiv(a, b), a, b, message);
	},
	QUnit: {
		equiv: equiv
	},
	// legacy methods below
	isSet: isSet,
	isObj: isObj,
	compare: function() {
		throw "compare is deprecated - use same() instead";
	},
	compare2: function() {
		throw "compare2 is deprecated - use same() instead";
	},
	serialArray: function() {
		throw "serialArray is deprecated - use jsDump.parse() instead";
	},
	q: q,
	t: t,
	url: url,
	triggerEvent: triggerEvent
});

$(window).load(function() {
	$('#userAgent').html(navigator.userAgent);
	var head = $('<div class="testrunner-toolbar"><label for="filter">Hide passed tests</label></div>').insertAfter("#userAgent");
	$('<input type="checkbox" id="filter" />').attr("disabled", true).prependTo(head).click(function() {
		$('li.pass')[this.checked ? 'hide' : 'show']();
	});
	runTest();	
});

function synchronize(callback) {
	config.queue.push(callback);
	if(!config.blocking) {
		process();
	}
}

function process() {
	while(config.queue.length && !config.blocking) {
		config.queue.shift()();
	}
}

function stop(timeout) {
	config.blocking = true;
	if (timeout)
		config.timeout = setTimeout(function() {
			ok( false, "Test timed out" );
			start();
		}, timeout);
}
function start() {
	// A slight delay, to avoid any current callbacks
	setTimeout(function() {
		if(config.timeout)
			clearTimeout(config.timeout);
		config.blocking = false;
		process();
	}, 13);
}

function validTest( name ) {
	var filters = config.filters;
	if( !filters )
		return true;

	var i = filters.length,
		run = false;
	while( i-- ){
		var filter = filters[i],
			not = filter.charAt(0) == '!';
		if( not ) 
			filter = filter.slice(1);
		if( name.indexOf(filter) != -1 )
			return !not;
		if( not )
			run = true;
	}
	return run;
}

function runTest() {
	config.blocking = false;
	var started = +new Date;
	config.fixture = document.getElementById('main').innerHTML;
	config.ajaxSettings = $.ajaxSettings;
	synchronize(function() {
		$('<p id="testresult" class="result">').html(['Tests completed in ',
			+new Date - started, ' milliseconds.<br/>',
			'<span class="bad">', config.stats.bad, '</span> tests of <span class="all">', config.stats.all, '</span> failed.</p>']
			.join(''))
			.appendTo("body");
		$("#banner").addClass(config.stats.bad ? "fail" : "pass");
	});
}

function test(name, callback) {
	if(config.currentModule)
		name = config.currentModule + " module: " + name;
	var lifecycle = $.extend({
		setup: function() {},
		teardown: function() {}
	}, config.moduleLifecycle);
	
	if ( !validTest(name) )
		return;
		
	synchronize(function() {
		config.assertions = [];
		config.expected = null;
		try {
			lifecycle.setup();
			callback();
			lifecycle.teardown();
		} catch(e) {
			if( typeof console != "undefined" && console.error && console.warn ) {
				console.error("Test " + name + " died, exception and test follows");
				console.error(e);
				console.warn(callback.toString());
			}
			config.assertions.push( {
				result: false,
				message: "Died on test #" + (config.assertions.length + 1) + ": " + e.message
			});
		}
	});
	synchronize(function() {
		try {
			reset();
		} catch(e) {
			if( typeof console != "undefined" && console.error && console.warn ) {
				console.error("reset() failed, following Test " + name + ", exception and reset fn follows");
				console.error(e);
				console.warn(reset.toString());
			}
		}
		
		if(config.expected && config.expected != config.assertions.length) {
			config.assertions.push({
				result: false,
				message: "Expected " + config.expected + " assertions, but " + config.assertions.length + " were run"
			});
		}
		
		var good = 0, bad = 0;
		var ol  = $("<ol/>").hide();
		config.stats.all += config.assertions.length;
		for ( var i = 0; i < config.assertions.length; i++ ) {
			var assertion = config.assertions[i];
			$("<li/>").addClass(assertion.result ? "pass" : "fail").text(assertion.message || "(no message)").appendTo(ol);
			assertion.result ? good++ : bad++;
		}
		config.stats.bad += bad;
	
		var b = $("<strong/>").html(name + " <b style='color:black;'>(<b class='fail'>" + bad + "</b>, <b class='pass'>" + good + "</b>, " + config.assertions.length + ")</b>")
		.click(function(){
			$(this).next().toggle();
		})
		.dblclick(function(event) {
			var target = $(event.target).filter("strong").clone();
			if ( target.length ) {
				target.children().remove();
				location.href = location.href.match(/^(.+?)(\?.*)?$/)[1] + "?" + encodeURIComponent($.trim(target.text()));
			}
		});
		
		$("<li/>").addClass(bad ? "fail" : "pass").append(b).append(ol).appendTo("#tests");
	
		if(bad) {
			$("#filter").attr("disabled", null);
		}
	});
}

// call on start of module test to prepend name to all tests
function module(name, lifecycle) {
	config.currentModule = name;
	config.moduleLifecycle = lifecycle;
}

/**
 * Specify the number of expected assertions to gurantee that failed test (no assertions are run at all) don't slip through.
 */
function expect(asserts) {
	config.expected = asserts;
}

/**
 * Resets the test setup. Useful for tests that modify the DOM.
 */
function reset() {
	$("#main").html( config.fixture );
	$.event.global = {};
	$.ajaxSettings = $.extend({}, config.ajaxSettings);
}

/**
 * Asserts true.
 * @example ok( $("a").size() > 5, "There must be at least 5 anchors" );
 */
function ok(a, msg) {
	config.assertions.push({
		result: !!a,
		message: msg
	});
}

/**
 * Asserts that two arrays are the same
 */
function isSet(a, b, msg) {
	function serialArray( a ) {
		var r = [];
		
		if ( a && a.length )
	        for ( var i = 0; i < a.length; i++ ) {
	            var str = a[i].nodeName;
	            if ( str ) {
	                str = str.toLowerCase();
	                if ( a[i].id )
	                    str += "#" + a[i].id;
	            } else
	                str = a[i];
	            r.push( str );
	        }
	
		return "[ " + r.join(", ") + " ]";
	}
	var ret = true;
	if ( a && b && a.length != undefined && a.length == b.length ) {
		for ( var i = 0; i < a.length; i++ )
			if ( a[i] != b[i] )
				ret = false;
	} else
		ret = false;
	config.assertions.push({
		result: ret,
		message: !ret ? (msg + " expected: " + serialArray(b) + " result: " + serialArray(a)) : msg
	});
}

/**
 * Asserts that two objects are equivalent
 */
function isObj(a, b, msg) {
	var ret = true;
	
	if ( a && b ) {
		for ( var i in a )
			if ( a[i] != b[i] )
				ret = false;

		for ( i in b )
			if ( a[i] != b[i] )
				ret = false;
	} else
		ret = false;

    config.assertions.push({
		result: ret,
		message: msg
	});
}

/**
 * Returns an array of elements with the given IDs, eg.
 * @example q("main", "foo", "bar")
 * @result [<div id="main">, <span id="foo">, <input id="bar">]
 */
function q() {
	var r = [];
	for ( var i = 0; i < arguments.length; i++ )
		r.push( document.getElementById( arguments[i] ) );
	return r;
}

/**
 * Asserts that a select matches the given IDs
 * @example t("Check for something", "//[a]", ["foo", "baar"]);
 * @result returns true if "//[a]" return two elements with the IDs 'foo' and 'baar'
 */
function t(a,b,c) {
	var f = $(b);
	var s = "";
	for ( var i = 0; i < f.length; i++ )
		s += (s && ",") + '"' + f[i].id + '"';
	isSet(f, q.apply(q,c), a + " (" + b + ")");
}

/**
 * Add random number to url to stop IE from caching
 *
 * @example url("data/test.html")
 * @result "data/test.html?10538358428943"
 *
 * @example url("data/test.php?foo=bar")
 * @result "data/test.php?foo=bar&10538358345554"
 */
function url(value) {
	return value + (/\?/.test(value) ? "&" : "?") + new Date().getTime() + "" + parseInt(Math.random()*100000);
}

/**
 * Checks that the first two arguments are equal, with an optional message.
 * Prints out both actual and expected values.
 *
 * Prefered to ok( actual == expected, message )
 *
 * @example equals( $.format("Received {0} bytes.", 2), "Received 2 bytes." );
 *
 * @param Object actual
 * @param Object expected
 * @param String message (optional)
 */
function equals(actual, expected, message) {
	push(expected == actual, actual, expected, message);
}

function push(result, actual, expected, message) {
	message = message || (result ? "okay" : "failed");
	config.assertions.push({
		result: result,
		message: result ? message + ": " + expected : message + ", expected: " + jsDump.parse(expected) + " result: " + jsDump.parse(actual)
	});
}

/**
 * Trigger an event on an element.
 *
 * @example triggerEvent( document.body, "click" );
 *
 * @param DOMElement elem
 * @param String type
 */
function triggerEvent( elem, type, event ) {
	if ( $.browser.mozilla || $.browser.opera ) {
		event = document.createEvent("MouseEvents");
		event.initMouseEvent(type, true, true, elem.ownerDocument.defaultView,
			0, 0, 0, 0, 0, false, false, false, false, 0, null);
		elem.dispatchEvent( event );
	} else if ( $.browser.msie ) {
		elem.fireEvent("on"+type);
	}
}

// Test for equality any JavaScript type.
// Discussions and reference: http://philrathe.com/articles/equiv
// Test suites: http://philrathe.com/tests/equiv
// Author: Philippe Rathé <prathe@gmail.com>

// About passing arguments:
//      when < 2   : return true
//      when 2     : return true if 1st equals 2nd
//      when > 2   : return true 1st equals 2nd, and 2nd equals 3rd,
//                      and 3rd equals 4th ... ans so on (by transition)
//

// Stack of constructors that enables us to skip or abort on functions value.
var objectCallerConstructorStack = [];
function equiv() {
    // we will need to use the array splice method,
    // so we need to convert arguments into a true array.
    var args = Array.prototype.slice.apply(arguments);
    var a, b; // compares a and b (1st and 2nd argument)
    var i; // for iterating over objects convenience
    var len; // for iterating array's length memoization
    // Memoized objects' properties.
    // Allow us to test for equivalence only in one way,
    // then to compare properties to make sure no one is missing.
    var aProperties, bProperties;


    if (args.length < 2) {
        return true; // nothing to compare together
    }

    a = args[0];
    b = args[1];

    return (function (a, b) {

        // Try to optimize the algo speed if ever both a and b are references
        // pointing to the same object (e..g. only for functions, arrays and objects)
        if (a === b) {
            return true;
        }
        
        // Must test for the null value before testing for the type of an object,
        // because null is also an object. Trapping null or undefined values here
        // is a good to avoid to much validations further in the code.
        if (a === null || b === null || typeof a === "undefined" || typeof b === "undefined") {
            return false; // Anyway (a === b) would have already caught it.
        }

        // Don't lose time and prevent further wrong type manipulation or unexpected results.
        if (typeof a !== typeof b) {
            return false;
        }

        // Must test if it's an array before testing for the type of an object,
        // because an array is also an object.
        if (a instanceof Array) {

            // Make sure b is also an array.
            // At this point b can be an object.
            // Prevent further arrays operation on object.
            if ( ! (b instanceof Array)) {
                return false;
            }

            len = a.length;
            if (len !== b.length) { // safe and faster
                return false;
            }
            for (i = 0; i < len; i++) {
                if( ! equiv(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        
        // NOTE:
        //      Must test if it's a date before testing if it is an object,
        //      because a date is also an object.
        //      We don't need to check if b is also an instance of Date because
        //      the "different type check" sooner in the code would have caught it and
        //      return false by evaluating ("object" !== "number") (or conversely) to true.
        if (a instanceof Date) {
            return a.valueOf() === b.valueOf();
        }

        // NOTE:
        //      Using toSource() to compare regexp only works in FF. It was working as well as the above.
        //      Must verify the constructor of a regexp before verifying it is an object.
        //      Notice those confusing true statements:
        //          var a = /./;
        //          a instanceof Object; // => true
        //          a instanceof RegExp; // => true
        //          typeof a === "function"; // => false in IE and Opera, true in FF and Safari
        //
        // There is 3 possible modifier for regular expressions (g, m and i)
        // The source property only returns the regular expression string without the modifier.
        if (a instanceof RegExp) {
            return b instanceof RegExp &&
                a.source === b.source &&
                a.global === b.global &&
                a.ignoreCase === b.ignoreCase &&
                a.multiline === b.multiline;
        }

        // typeof on some types returns sometimes unexpected type that we deals with.
        // We could have used instanceof instead of typeof but it comes with
        // other problems as mentioned above when testing for the RegExp constructor.
        // We explicitely don't use hasOwnProperty when iterating on the properties of
        // an object to allow a deeper equivalence (e.g. for instances particularly)
        if (typeof a === "object") {
            // Different constructors means a and b can't be equivalent instances.
            // We don't have any choice of comparing them in both ways because of inheritance
            // otherwise {} could be mistaken with []
            // NOTE this:
            //      var a = [];
            //      a instanceof Array;  // true
            //      a instanceof Object; // true
            if ( a.constructor !== b.constructor) {
                return false;
            }

            // Stack constructors before iterating over its properties
            objectCallerConstructorStack.push(a.constructor);

            aProperties = [];
            bProperties = [];

            // NOTE:
            //      We only need to compare propertie's equivalence in one way
            //      and ensures that all properties of a and b are the same.

            // Verify a's properties with b's properties equivalence.
            // Stack a's properties
            
            for (i in a) {
                aProperties.push(i);
                if (!equiv(a[i], b[i])) {
                    // Unstack current constructor when finished with the object
                    objectCallerConstructorStack.pop();
                    return false;
                }
            }

            // Stack also b's properties
            for (i in b) {
                bProperties.push(i);
            }

            // Unstack current constructor when finished with the object
            objectCallerConstructorStack.pop();

            // Ensures properties's name in both ways.
            // Must sort them because they may not be always in the same order!
            return equiv(aProperties.sort(), bProperties.sort());
        }

        // NOTE:
        //      Using the typeof operator will also catch a RegExp instance.
        //      Take no risk.
        if (a instanceof Function) {
            // BEHAVIOR when comparing functions.
            //      Being here means that a and b were were not the same references.
            //      At this level, functions won't be compared at all.
            //      - skip when they are properties of instances (not instantiates from the Object construtor)
            //      - abort otherwise
            //
            //      To Determine if a function is anonymous we use a regexp on the function sources.
            var currentObjectCallerConstructor =
                    objectCallerConstructorStack[objectCallerConstructorStack.length - 1];
            return currentObjectCallerConstructor !== Object &&
                    typeof currentObjectCallerConstructor !== "undefined";
        }

        // NaN is a number in JavaScript.
        // Because this statement is false: 0/0 === 0/0,
        // we must use the isNaN function which is the only way to know a number is NaN.
        // Note that it isn't the case with the Infinity number, and that 1/0 === 2/0.
        if (typeof a === "number" && isNaN(a)) {
            return isNaN(b);
        }

        // Compares Number, String or Boolean
        // Because sooner we have already tried:
        //          a === b (then return if it is the case)
        //            and
        //  typeof a !== typeof b (then return false if it is the case)
        // at this time a and b should be of the same type, but hold different values.
        // We can safely return false instead of returning a === b
        return false;

    }(a, b)) && equiv.apply(this, args.splice(1, args.length -1)); // apply transition with (1..n) arguments
}

})(jQuery);

/**
 * jsDump
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Licensed under BSD (http://www.opensource.org/licenses/bsd-license.php)
 * Date: 5/15/2008
 * @projectDescription Advanced and extensible data dumping for Javascript.
 * @version 1.0.0
 * @author Ariel Flesler
 * @link {http://flesler.blogspot.com/2008/05/jsdump-pretty-dump-of-any-javascript.html}
 */
(function(){
	function quote( str ){
		return '"' + str.toString().replace(/"/g, '\\"') + '"';
	};
	function literal( o ){
		return o + '';	
	};
	function join( pre, arr, post ){
		var s = jsDump.separator(),
			base = jsDump.indent();
			inner = jsDump.indent(1);
		if( arr.join )
			arr = arr.join( ',' + s + inner );
		if( !arr )
			return pre + post;
		return [ pre, inner + arr, base + post ].join(s);
	};
	function array( arr ){
		var i = arr.length,	ret = Array(i);					
		this.up();
		while( i-- )
			ret[i] = this.parse( arr[i] );				
		this.down();
		return join( '[', ret, ']' );
	};
	
	var reName = /^function (\w+)/;
	
	var jsDump = window.jsDump = {
		parse:function( obj, type ){//type is used mostly internally, you can fix a (custom)type in advance
			var	parser = this.parsers[ type || this.typeOf(obj) ];
			type = typeof parser;			
			
			return type == 'function' ? parser.call( this, obj ) :
				   type == 'string' ? parser :
				   this.parsers.error;
		},
		typeOf:function( obj ){
			var type = typeof obj,
				f = 'function';//we'll use it 3 times, save it
			return type != 'object' && type != f ? type :
				!obj ? 'null' :
				obj.exec ? 'regexp' :// some browsers (FF) consider regexps functions
				obj.getHours ? 'date' :
				obj.scrollBy ?  'window' :
				obj.nodeName == '#document' ? 'document' :
				obj.nodeName ? 'node' :
				obj.item ? 'nodelist' : // Safari reports nodelists as functions
				obj.callee ? 'arguments' :
				obj.call || obj.constructor != Array && //an array would also fall on this hack
					(obj+'').indexOf(f) != -1 ? f : //IE reports functions like alert, as objects
				'length' in obj ? 'array' :
				type;
		},
		separator:function(){
			return this.multiline ?	this.HTML ? '<br />' : '\n' : this.HTML ? '&nbsp;' : ' ';
		},
		indent:function( extra ){// extra can be a number, shortcut for increasing-calling-decreasing
			if( !this.multiline )
				return '';
			var chr = this.indentChar;
			if( this.HTML )
				chr = chr.replace(/\t/g,'   ').replace(/ /g,'&nbsp;');
			return Array( this._depth_ + (extra||0) ).join(chr);
		},
		up:function( a ){
			this._depth_ += a || 1;
		},
		down:function( a ){
			this._depth_ -= a || 1;
		},
		setParser:function( name, parser ){
			this.parsers[name] = parser;
		},
		// The next 3 are exposed so you can use them
		quote:quote, 
		literal:literal,
		join:join,
		//
		_depth_: 1,
		// This is the list of parsers, to modify them, use jsDump.setParser
		parsers:{
			window: '[Window]',
			document: '[Document]',
			error:'[ERROR]', //when no parser is found, shouldn't happen
			unknown: '[Unknown]',
			'null':'null',
			undefined:'undefined',
			'function':function( fn ){
				var ret = 'function',
					name = 'name' in fn ? fn.name : (reName.exec(fn)||[])[1];//functions never have name in IE
				if( name )
					ret += ' ' + name;
				ret += '(';
				
				ret = [ ret, this.parse( fn, 'functionArgs' ), '){'].join('');
				return join( ret, this.parse(fn,'functionCode'), '}' );
			},
			array: array,
			nodelist: array,
			arguments: array,
			object:function( map ){
				var ret = [ ];
				this.up();
				for( var key in map )
					ret.push( this.parse(key,'key') + ': ' + this.parse(map[key]) );
				this.down();
				return join( '{', ret, '}' );
			},
			node:function( node ){
				var open = this.HTML ? '&lt;' : '<',
					close = this.HTML ? '&gt;' : '>';
					
				var tag = node.nodeName.toLowerCase(),
					ret = open + tag;
					
				for( var a in this.DOMAttrs ){
					var val = node[this.DOMAttrs[a]];
					if( val )
						ret += ' ' + a + '=' + this.parse( val, 'attribute' );
				}
				return ret + close + open + '/' + tag + close;
			},
			functionArgs:function( fn ){//function calls it internally, it's the arguments part of the function
				var l = fn.length;
				if( !l ) return '';				
				
				var args = Array(l);
				while( l-- )
					args[l] = String.fromCharCode(97+l);//97 is 'a'
				return ' ' + args.join(', ') + ' ';
			},
			key:quote, //object calls it internally, the key part of an item in a map
			functionCode:'[code]', //function calls it internally, it's the content of the function
			attribute:quote, //node calls it internally, it's an html attribute value
			string:quote,
			date:quote,
			regexp:literal, //regex
			number:literal,
			'boolean':literal
		},
		DOMAttrs:{//attributes to dump from nodes, name=>realName
			id:'id',
			name:'name',
			'class':'className'
		},
		HTML:false,//if true, entities are escaped ( <, >, \t, space and \n )
		indentChar:'   ',//indentation unit
		multiline:true //if true, items in a collection, are separated by a \n, else just a space.
	};

})();
