QUnit.module( "propEquiv" );

QUnit.test("Primitive types and constants", function ( assert ) {
	assert.equal( QUnit.equiv.props( null, null ), true, "null" );
	assert.equal( QUnit.equiv.props( null, {} ), false, "null" );
	assert.equal( QUnit.equiv.props( null, undefined ), false, "null" );
	assert.equal( QUnit.equiv.props( null, 0 ), false, "null" );
	assert.equal( QUnit.equiv.props( null, false ), false, "null" );
	assert.equal( QUnit.equiv.props( null, "" ), false, "null" );
	assert.equal( QUnit.equiv.props( null, [] ), false, "null" );

	assert.equal( QUnit.equiv.props( undefined, undefined ), true, "undefined" );
	assert.equal( QUnit.equiv.props( undefined, null ), false, "undefined" );
	assert.equal( QUnit.equiv.props( undefined, 0 ), false, "undefined" );
	assert.equal( QUnit.equiv.props( undefined, false ), false, "undefined" );
	assert.equal( QUnit.equiv.props( undefined, {} ), false, "undefined" );
	assert.equal( QUnit.equiv.props( undefined, [] ), false, "undefined" );
	assert.equal( QUnit.equiv.props( undefined, "" ), false, "undefined" );
});

QUnit.test( "Objects basics", function( assert ) {
	assert.equal( QUnit.equiv.props( {}, {} ), true );
	assert.equal( QUnit.equiv.props( {}, null ), false );
	assert.equal( QUnit.equiv.props( {}, undefined ), false );
	assert.equal( QUnit.equiv.props( {}, 0 ), false );
	assert.equal( QUnit.equiv.props( {}, false ), false );

	// This test is a hard one, it is very important
	// REASONS:
	//      1) They are of the same type "object"
	//      2) [] instanceof Object is true
	//      3) Their properties are the same (doesn't exists)
	assert.equal( QUnit.equiv.props( {}, [] ), false );

	assert.equal( QUnit.equiv.props( { a: 1 }, { a: 1 } ), true );
	assert.equal( QUnit.equiv.props( { a: 1 }, { a: "1" } ), false );
	assert.equal( QUnit.equiv.props( { a: [] }, { a: [] } ), true );
	assert.equal( QUnit.equiv.props( { a: {} }, { a: null } ), false );
	assert.equal( QUnit.equiv.props( { a: 1 }, {} ), false );
	assert.equal( QUnit.equiv.props( {}, { a: 1 } ), false );

	// Hard ones
	assert.equal( QUnit.equiv.props( { a: undefined }, {} ), false );
	assert.equal( QUnit.equiv.props( {}, { a: undefined } ), false );
	assert.equal( QUnit.equiv.props(
		{
			a: [ { bar: undefined } ]
		},
		{
			a: [ { bat: undefined } ]
		}
	), false );

	// Objects with no prototype, created via Object.create(null), are used e.g. as dictionaries.
	// Being able to test equivalence against object literals is quite useful.
	if ( typeof Object.create === "function" ) {
		assert.equal( QUnit.equiv.props( Object.create( null ), {} ), true, "empty object without prototype VS empty object" );

		var nonEmptyWithNoProto = Object.create( null );
		nonEmptyWithNoProto.foo = "bar";

		assert.equal( QUnit.equiv.props( nonEmptyWithNoProto, { foo: "bar" } ), true, "object without prototype VS object" );
	}
});

QUnit.test( "Objects with different prototype", function( assert ) {
	var objectCreate = Object.create || function( origin ) {
		function O() {}
		O.prototype = origin;
		var r = new O();
		return r;
	};

	function Foo( x, y, z ) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	Foo.prototype.doA = function() {};
	Foo.prototype.doB = function() {};
	Foo.prototype.bar = "prototype";

	function Bar() {
	}
	Bar.prototype = objectCreate( Foo.prototype );
	Bar.prototype.constructor = Bar;

	assert.propEqual(
		new Foo( 1, "2", [] ),
		{
			x: 1,
			y: "2",
			z: []
		}
	);

	assert.notPropEqual(
		new Foo( "1", 2, 3 ),
		{
			x: 1,
			y: "2",
			z: 3
		},
		"Primitive values are strictly compared"
	);

	assert.notPropEqual(
		new Foo( 1, "2", [] ),
		{
			x: 1,
			y: "2",
			z: {}
		},
		"Array type is preserved"
	);

	assert.notPropEqual(
		new Foo( 1, "2", {} ),
		{
			x: 1,
			y: "2",
			z: []
		},
		"Empty array is not the same as empty object"
	);

	assert.propEqual(
		new Foo( 1, "2", new Foo( [ 3 ], new Bar(), null ) ),
		{
			x: 1,
			y: "2",
			z: {
				x: [ 3 ],
				y: {},
				z: null
			}
		},
		"Complex nesting of different types, inheritance and constructors"
	);
});


QUnit.test( "Complex objects", function( assert ) {

	function fn1() {
		return "fn1";
	}
	function fn2() {
		return "fn2";
	}

	// Try to invert the order of some properties to make sure it is covered.
	// It can failed when properties are compared between unsorted arrays.
	assert.equal( QUnit.equiv.props(
		{
			a: 1,
			b: null,
			c: [ {} ],
			d: {
				a: 3.14159,
				b: false,
				c: {
					e: fn1,
					f: [[[]]],
					g: {
						j: {
							k: {
								n: {
									r: "r",
									s: [ 1, 2, 3 ],
									t: undefined,
									u: 0,
									v: {
										w: {
											x: {
												y: "Yahoo!",
												z: null
											}
										}
									}
								},
								q: [],
								p: 1 / 0,
								o: 99
							},
							l: undefined,
							m: null
						}
					},
					d: 0,
					i: true,
					h: "false"
				}
			},
			e: undefined,
			g: "",
			h: "h",
			f: {},
			i: []
		},
		{
			a: 1,
			b: null,
			c: [ {} ],
			d: {
				b: false,
				a: 3.14159,
				c: {
					d: 0,
					e: fn1,
					f: [[[]]],
					g: {
						j: {
							k: {
								n: {
									r: "r",
									t: undefined,
									u: 0,
									s: [ 1, 2, 3 ],
									v: {
										w: {
											x: {
												z: null,
												y: "Yahoo!"
											}
										}
									}
								},
								o: 99,
								p: 1 / 0,
								q: []
							},
							l: undefined,
							m: null
						}
					},
					i: true,
					h: "false"
				}
			},
			e: undefined,
			g: "",
			f: {},
			h: "h",
			i: []
		}
	), true);

	assert.equal( QUnit.equiv.props(
		{
			a: 1,
			b: null,
			c: [ {} ],
			d: {
				a: 3.14159,
				b: false,
				c: {
					d: 0,
					e: fn1,
					f: [[[]]],
					g: {
						j: {
							k: {
								n: {
									//r: "r",   // different: missing a property
									s: [ 1, 2, 3 ],
									t: undefined,
									u: 0,
									v: {
										w: {
											x: {
												y: "Yahoo!",
												z: null
											}
										}
									}
								},
								o: 99,
								p: 1 / 0,
								q: []
							},
							l: undefined,
							m: null
						}
					},
					h: "false",
					i: true
				}
			},
			e: undefined,
			f: {},
			g: "",
			h: "h",
			i: []
		},
		{
			a: 1,
			b: null,
			c: [ {} ],
			d: {
				a: 3.14159,
				b: false,
				c: {
					d: 0,
					e: fn1,
					f: [[[]]],
					g: {
						j: {
							k: {
								n: {
									r: "r",
									s: [ 1, 2, 3 ],
									t: undefined,
									u: 0,
									v: {
										w: {
											x: {
												y: "Yahoo!",
												z: null
											}
										}
									}
								},
								o: 99,
								p: 1 / 0,
								q: []
							},
							l: undefined,
							m: null
						}
					},
					h: "false",
					i: true
				}
			},
			e: undefined,
			f: {},
			g: "",
			h: "h",
			i: []
		}
	), false);

	assert.equal( QUnit.equiv.props(
		{
			a: 1,
			b: null,
			c: [ {} ],
			d: {
				a: 3.14159,
				b: false,
				c: {
					d: 0,
					e: fn1,
					f: [[[]]],
					g: {
						j: {
							k: {
								n: {
									r: "r",
									s: [ 1, 2, 3 ],
									t: undefined,
									u: 0,
									v: {
										w: {
											x: {
												y: "Yahoo!",
												z: null
											}
										}
									}
								},
								o: 99,
								p: 1 / 0,
								q: []
							},
							l: undefined,
							m: null
						}
					},
					h: "false",
					i: true
				}
			},
			e: undefined,
			f: {},
			g: "",
			h: "h",
			i: []
		},
		{
			a: 1,
			b: null,
			c: [ {} ],
			d: {
				a: 3.14159,
				b: false,
				c: {
					d: 0,
					e: fn1,
					f: [[[]]],
					g: {
						j: {
							k: {
								n: {
									r: "r",
									s: [ 1, 2, 3 ],
									//t: undefined,                 // different: missing a property with an undefined value
									u: 0,
									v: {
										w: {
											x: {
												y: "Yahoo!",
												z: null
											}
										}
									}
								},
								o: 99,
								p: 1 / 0,
								q: []
							},
							l: undefined,
							m: null
						}
					},
					h: "false",
					i: true
				}
			},
			e: undefined,
			f: {},
			g: "",
			h: "h",
			i: []
		}
	), false);

	assert.equal( QUnit.equiv.props(
		{
			a: 1,
			b: null,
			c: [ {} ],
			d: {
				a: 3.14159,
				b: false,
				c: {
					d: 0,
					e: fn1,
					f: [[[]]],
					g: {
						j: {
							k: {
								n: {
									r: "r",
									s: [ 1, 2, 3 ],
									t: undefined,
									u: 0,
									v: {
										w: {
											x: {
												y: "Yahoo!",
												z: null
											}
										}
									}
								},
								o: 99,
								p: 1 / 0,
								q: []
							},
							l: undefined,
							m: null
						}
					},
					h: "false",
					i: true
				}
			},
			e: undefined,
			f: {},
			g: "",
			h: "h",
			i: []
		},
		{
			a: 1,
			b: null,
			c: [ {} ],
			d: {
				a: 3.14159,
				b: false,
				c: {
					d: 0,
					e: fn1,
					f: [[[]]],
					g: {
						j: {
							k: {
								n: {
									r: "r",
									s: [ 1, 2, 3 ],
									t: undefined,
									u: 0,
									v: {
										w: {
											x: {
												y: "Yahoo!",
												z: null
											}
										}
									}
								},
								o: 99,
								p: 1 / 0,
								q: {}           // different was []
							},
							l: undefined,
							m: null
						}
					},
					h: "false",
					i: true
				}
			},
			e: undefined,
			f: {},
			g: "",
			h: "h",
			i: []
		}
	), false );

	var same1 = {
			a: [
				"string", null, 0, "1", 1, {
					prop: null,
					foo: [ 1, 2, null, {}, [], [ 1, 2, 3 ] ],
					bar: undefined
				}, 3, "Hey!", "ÎšÎ¬Î½Îµ Ï€Î¬Î½Ï„Î± Î³Î½Ï‰ÏÎ¯Î¶Î¿Ï…Î¼Îµ Î±Ï‚ Ï„Ï‰Î½, Î¼Î·Ï‡Î±Î½Î®Ï‚ ÎµÏ€Î¹Î´Î¹ÏŒÏÎ¸Ï‰ÏƒÎ·Ï‚ ÎµÏ€Î¹Î´Î¹Î¿ÏÎ¸ÏŽÏƒÎµÎ¹Ï‚ ÏŽÏ‚ Î¼Î¹Î±. ÎšÎ»Ï€ Î±Ï‚"
			],
			unicode: "è€ æ±‰è¯ä¸å˜åœ¨ æ¸¯æ¾³å’Œæµ·å¤–çš„åŽäººåœˆä¸ è´µå·ž æˆ‘åŽ»äº†ä¹¦åº— çŽ°åœ¨å°šæœ‰äº‰",
			b: "b",
			c: fn1
		},

		same2 = {
			a: [
				"string", null, 0, "1", 1, {
					prop: null,
					foo: [ 1, 2, null, {}, [], [ 1, 2, 3 ] ],
					bar: undefined
				}, 3, "Hey!", "ÎšÎ¬Î½Îµ Ï€Î¬Î½Ï„Î± Î³Î½Ï‰ÏÎ¯Î¶Î¿Ï…Î¼Îµ Î±Ï‚ Ï„Ï‰Î½, Î¼Î·Ï‡Î±Î½Î®Ï‚ ÎµÏ€Î¹Î´Î¹ÏŒÏÎ¸Ï‰ÏƒÎ·Ï‚ ÎµÏ€Î¹Î´Î¹Î¿ÏÎ¸ÏŽÏƒÎµÎ¹Ï‚ ÏŽÏ‚ Î¼Î¹Î±. ÎšÎ»Ï€ Î±Ï‚"
			],
			unicode: "è€ æ±‰è¯ä¸å˜åœ¨ æ¸¯æ¾³å’Œæµ·å¤–çš„åŽäººåœˆä¸ è´µå·ž æˆ‘åŽ»äº†ä¹¦åº— çŽ°åœ¨å°šæœ‰äº‰",
			b: "b",
			c: fn1 
		},

		diff1 = {
			a: [
				"string", null, 0, "1", 1, {
					prop: null,
					foo: [ 1, 2, null, {}, [], [ 1, 2, 3, 4 ] ], // different: 4 was add to the array
					bar: undefined
				}, 3, "Hey!", "ÎšÎ¬Î½Îµ Ï€Î¬Î½Ï„Î± Î³Î½Ï‰ÏÎ¯Î¶Î¿Ï…Î¼Îµ Î±Ï‚ Ï„Ï‰Î½, Î¼Î·Ï‡Î±Î½Î®Ï‚ ÎµÏ€Î¹Î´Î¹ÏŒÏÎ¸Ï‰ÏƒÎ·Ï‚ ÎµÏ€Î¹Î´Î¹Î¿ÏÎ¸ÏŽÏƒÎµÎ¹Ï‚ ÏŽÏ‚ Î¼Î¹Î±. ÎšÎ»Ï€ Î±Ï‚"
			],
			unicode: "è€ æ±‰è¯ä¸å˜åœ¨ æ¸¯æ¾³å’Œæµ·å¤–çš„åŽäººåœˆä¸ è´µå·ž æˆ‘åŽ»äº†ä¹¦åº— çŽ°åœ¨å°šæœ‰äº‰",
			b: "b",
			c: fn1
		},

		diff2 = {
			a: [
				"string", null, 0, "1", 1, {
					prop: null,
					foo: [ 1, 2, null, {}, [], [ 1, 2, 3 ] ],
					newprop: undefined, // different: newprop was added
					bar: undefined
				}, 3, "Hey!", "ÎšÎ¬Î½Îµ Ï€Î¬Î½Ï„Î± Î³Î½Ï‰ÏÎ¯Î¶Î¿Ï…Î¼Îµ Î±Ï‚ Ï„Ï‰Î½, Î¼Î·Ï‡Î±Î½Î®Ï‚ ÎµÏ€Î¹Î´Î¹ÏŒÏÎ¸Ï‰ÏƒÎ·Ï‚ ÎµÏ€Î¹Î´Î¹Î¿ÏÎ¸ÏŽÏƒÎµÎ¹Ï‚ ÏŽÏ‚ Î¼Î¹Î±. ÎšÎ»Ï€ Î±Ï‚"
			],
			unicode: "è€ æ±‰è¯ä¸å˜åœ¨ æ¸¯æ¾³å’Œæµ·å¤–çš„åŽäººåœˆä¸ è´µå·ž æˆ‘åŽ»äº†ä¹¦åº— çŽ°åœ¨å°šæœ‰äº‰",
			b: "b",
			c: fn1
		},

		diff3 = {
			a: [
				"string", null, 0, "1", 1, {
					prop: null,
					foo: [ 1, 2, null, {}, [], [ 1, 2, 3 ] ],
					bar: undefined
				}, 3, "Hey!", "ÎšÎ¬Î½Îµ Ï€Î¬Î½Ï„Î± Î³Î½Ï‰ÏÎ¯Î¶Î¿Ï…Î¼Îµ Î±Ï‚ Ï„Ï‰Î½, Î¼Î·Ï‡Î±Î½Î®Ï‚ ÎµÏ€Î¹Î´Î¹ÏŒÏÎ¸Ï‰ÏƒÎ·Ï‚ ÎµÏ€Î¹Î´Î¹Î¿ÏÎ¸ÏŽÏƒÎµÎ¹Ï‚ ÏŽÏ‚ Î¼Î¹Î±. ÎšÎ»Ï€ Î±" // different: missing last char
			],
			unicode: "è€ æ±‰è¯ä¸å˜åœ¨ æ¸¯æ¾³å’Œæµ·å¤–çš„åŽäººåœˆä¸ è´µå·ž æˆ‘åŽ»äº†ä¹¦åº— çŽ°åœ¨å°šæœ‰äº‰",
			b: "b",
			c: fn1
		},

		diff4 = {
			a: [
				"string", null, 0, "1", 1, {
					prop: null,
					foo: [ 1,2,undefined,{}, [], [ 1, 2, 3 ] ], // different: undefined instead of null
					bar: undefined
				}, 3, "Hey!", "ÎšÎ¬Î½Îµ Ï€Î¬Î½Ï„Î± Î³Î½Ï‰ÏÎ¯Î¶Î¿Ï…Î¼Îµ Î±Ï‚ Ï„Ï‰Î½, Î¼Î·Ï‡Î±Î½Î®Ï‚ ÎµÏ€Î¹Î´Î¹ÏŒÏÎ¸Ï‰ÏƒÎ·Ï‚ ÎµÏ€Î¹Î´Î¹Î¿ÏÎ¸ÏŽÏƒÎµÎ¹Ï‚ ÏŽÏ‚ Î¼Î¹Î±. ÎšÎ»Ï€ Î±Ï‚"
			],
			unicode: "è€ æ±‰è¯ä¸å˜åœ¨ æ¸¯æ¾³å’Œæµ·å¤–çš„åŽäººåœˆä¸ è´µå·ž æˆ‘åŽ»äº†ä¹¦åº— çŽ°åœ¨å°šæœ‰äº‰",
			b: "b",
			c: fn1
		},

		diff5 = {
			a: [
				"string", null, 0, "1", 1, {
					prop: null,
					foo: [ 1, 2, null, {}, [], [ 1, 2, 3 ] ],
					bat: undefined // different: property name not "bar"
				}, 3, "Hey!", "ÎšÎ¬Î½Îµ Ï€Î¬Î½Ï„Î± Î³Î½Ï‰ÏÎ¯Î¶Î¿Ï…Î¼Îµ Î±Ï‚ Ï„Ï‰Î½, Î¼Î·Ï‡Î±Î½Î®Ï‚ ÎµÏ€Î¹Î´Î¹ÏŒÏÎ¸Ï‰ÏƒÎ·Ï‚ ÎµÏ€Î¹Î´Î¹Î¿ÏÎ¸ÏŽÏƒÎµÎ¹Ï‚ ÏŽÏ‚ Î¼Î¹Î±. ÎšÎ»Ï€ Î±Ï‚"
			],
			unicode: "è€ æ±‰è¯ä¸å˜åœ¨ æ¸¯æ¾³å’Œæµ·å¤–çš„åŽäººåœˆä¸ è´µå·ž æˆ‘åŽ»äº†ä¹¦åº— çŽ°åœ¨å°šæœ‰äº‰",
			b: "b",
			c: fn1
		},

		diff6 = {
			a: [
				"string", null, 0, "1", 1, {
					prop: null,
					foo: [ 1, 2, null, {}, [], [ 1, 2, 3 ] ],
					bar: undefined
				}, 3, "Hey!", "ÎšÎ¬Î½Îµ Ï€Î¬Î½Ï„Î± Î³Î½Ï‰ÏÎ¯Î¶Î¿Ï…Î¼Îµ Î±Ï‚ Ï„Ï‰Î½, Î¼Î·Ï‡Î±Î½Î®Ï‚ ÎµÏ€Î¹Î´Î¹ÏŒÏÎ¸Ï‰ÏƒÎ·Ï‚ ÎµÏ€Î¹Î´Î¹Î¿ÏÎ¸ÏŽÏƒÎµÎ¹Ï‚ ÏŽÏ‚ Î¼Î¹Î±. ÎšÎ»Ï€ Î±Ï‚"
			],
			unicode: "è€ æ±‰è¯ä¸å˜åœ¨ æ¸¯æ¾³å’Œæµ·å¤–çš„åŽäººåœˆä¸ è´µå·ž æˆ‘åŽ»äº†ä¹¦åº— çŽ°åœ¨å°šæœ‰äº‰",
			b: "b",
			c: fn2 // different: fn2 instead of fn1
		};

	assert.equal( QUnit.equiv.props( same1, same2 ), true );
	assert.equal( QUnit.equiv.props( same2, same1 ), true );
	assert.equal( QUnit.equiv.props( same2, diff1 ), false );
	assert.equal( QUnit.equiv.props( diff1, same2 ), false );

	assert.equal( QUnit.equiv.props( same1, diff1 ), false );
	assert.equal( QUnit.equiv.props( same1, diff2 ), false );
	assert.equal( QUnit.equiv.props( same1, diff3 ), false );
	assert.equal( QUnit.equiv.props( same1, diff3 ), false );
	assert.equal( QUnit.equiv.props( same1, diff4 ), false );
	assert.equal( QUnit.equiv.props( same1, diff5 ), false );
	assert.equal( QUnit.equiv.props( same1, diff6 ), false );
	assert.equal( QUnit.equiv.props( diff5, diff1 ), false );
});

QUnit.test( "Object with circular references", function( assert ) {
	var circularA = {
			abc: null
		},
		circularB = {
			abc: null
		};
	circularA.abc = circularA;
	circularB.abc = circularB;
	assert.equal( QUnit.equiv.props( circularA, circularB ), true,
		"Should not repeat test on object (ambiguous test)"
	);

	circularA.def = 1;
	circularB.def = 1;
	assert.equal( QUnit.equiv.props( circularA, circularB ), true,
		"Should not repeat test on object (ambiguous test)"
	);

	circularA.def = 1;
	circularB.def = 0;
	assert.equal( QUnit.equiv.props( circularA, circularB ), false,
		"Should not repeat test on object (unambiguous test)"
	);
});


QUnit.test( "Mixed object/array with references to self wont loop", function( assert ) {
	var circularA = [ {
			abc: null
		} ],
		circularB = [ {
			abc: null
		} ];
	circularA[ 0 ].abc = circularA;
	circularB[ 0 ].abc = circularB;

	circularA.push( circularA );
	circularB.push( circularB );
	assert.equal( QUnit.equiv.props( circularA, circularB ), true,
		"Should not repeat test on object/array (ambiguous test)"
	);

	circularA[ 0 ].def = 1;
	circularB[ 0 ].def = 1;
	assert.equal( QUnit.equiv.props( circularA, circularB ), true,
		"Should not repeat test on object/array (ambiguous test)"
	);

	circularA[ 0 ].def = 1;
	circularB[ 0 ].def = 0;
	assert.equal( QUnit.equiv.props( circularA, circularB ), false,
		"Should not repeat test on object/array (unambiguous test)"
	);
});