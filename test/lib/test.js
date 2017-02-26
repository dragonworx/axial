/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Axial = __webpack_require__(1);
	var util = Axial.util;
	var expect = __webpack_require__(3);
	var PROXY = Axial.PROXY_KEY;
	
	if (typeof window !== 'undefined') {
	  window.Axial = Axial;
	  Axial.addDefaultLogListeners();
	}
	
	window.debug = false;
	Object.defineProperty(window, '$debug', {
	  get: function get() {
	    window.debug = true;
	  }
	});
	
	//$debug
	
	describe('1. Types', function () {
	  it('1.1 should determine correct types', function () {
	    // return as type instances
	    expect(util.typeOf(null)).toBe(Axial.Null);
	    expect(util.typeOf(undefined)).toBe(Axial.Undefined);
	    expect(util.typeOf('abc')).toBe(Axial.String);
	    expect(util.typeOf(123)).toBe(Axial.Number);
	    expect(util.typeOf(true)).toBe(Axial.Boolean);
	    expect(util.typeOf(false)).toBe(Axial.Boolean);
	    expect(util.typeOf(new Date())).toBe(Axial.Date);
	    expect(util.typeOf(/abc/)).toBe(Axial.Regex);
	    expect(util.typeOf(function () {})).toBe(Axial.Function);
	    expect(util.typeOf([])).toBe(Axial.Array());
	    expect(util.typeOf(['abc'])).toBe(Axial.Array(Axial.String));
	    expect(util.typeOf([123])).toBe(Axial.Array(Axial.Number));
	    expect(util.typeOf({})).toBe(Axial.Object);
	    // check name of type
	    expect(util.typeOf(null).id).toBe('null');
	    expect(util.typeOf(undefined).id).toBe('undefined');
	    expect(util.typeOf('abc').id).toBe('string');
	    expect(util.typeOf(123).id).toBe('number');
	    expect(util.typeOf(true).id).toBe('boolean');
	    expect(util.typeOf(false).id).toBe('boolean');
	    expect(util.typeOf(new Date()).id).toBe('date');
	    expect(util.typeOf(/abc/).id).toBe('regex');
	    expect(util.typeOf(function () {}).id).toBe('function');
	    expect(util.typeOf([]).id).toBe('array[*]');
	    expect(util.typeOf([]).type).toBe(undefined);
	    expect(util.typeOf(['abc']).id).toBe('array[string]');
	    expect(util.typeOf(['abc']).type.id).toBe('string');
	    expect(util.typeOf([1, 2, 3]).id).toBe('array[number]');
	    expect(util.typeOf([1, 2, 3]).type.id).toBe('number');
	    expect(util.typeOf({}).id).toBe('object');
	  });
	});
	
	describe('2. Defining Interfaces', function () {
	  var iface = null;
	  var a = null;
	
	  it('2.1 should be able to define an interface without a name', function () {
	    iface = Axial.define({
	      x: {
	        y: {
	          z: [Axial.Number, Axial.Boolean]
	        }
	      },
	      'a.b.c': Axial.Boolean
	    });
	    expect(iface).toBeA(Axial.Interface.constructor);
	    expect(iface.prop('a.b.c').is(Axial.Boolean)).toBe(true);
	  });
	
	  it('2.2 should be able to define an interface with a name', function () {
	    iface = Axial.define('iface', {
	      'x.y.z': [Axial.Number, Axial.Boolean],
	      v: Axial.Array(),
	      w: Axial.Array(Axial.String)
	    });
	    expect(iface.prop('iface.x.y.z').iface.id).toBe('iface.x.y');
	  });
	
	  it('2.3 should be able to access interface properties by path', function () {
	    expect(iface.prop('iface.x').is(Axial.Interface)).toBe(true);
	    expect(iface.prop('iface.x').is(Axial.String)).toBe(false);
	    expect(iface.prop('iface.x.y.z').is(Axial.Number)).toBe(true);
	    expect(iface.prop('iface.x.y.z').is(Axial.Boolean)).toBe(true);
	    expect(iface.prop('iface.v').is(Axial.Array())).toBe(true);
	    expect(iface.prop('iface.v').is(Axial.Array(Axial.String))).toBe(false);
	    expect(iface.prop('iface.w').is(Axial.Array(Axial.String))).toBe(true);
	    expect(iface.prop('iface.w').is(Axial.Array(Axial.Number))).toBe(false);
	  });
	
	  it('2.4 should not be able to define the same type more than once', function () {
	    expect(function () {
	      Axial.define({
	        x: [Axial.String, Axial.Number, Axial.String]
	      });
	    }).toThrow(Axial.TypeAlreadyDefined);
	    expect(function () {
	      Axial.define({
	        x: [Axial.Array(), Axial.Number, Axial.Array()]
	      });
	    }).toThrow(Axial.TypeAlreadyDefined);
	    expect(function () {
	      Axial.define({
	        x: [Axial.Array(Axial.String), Axial.Array(Axial.Number), Axial.Array(Axial.String)]
	      });
	    }).toThrow(Axial.TypeAlreadyDefined);
	  });
	
	  it('2.5 should be able to define multiple interface with same name (as stack)', function () {
	    var a = Axial.define('iface25', {
	      a: Axial.String
	    });
	    expect(Axial.getInterface('iface25').has('a')).toBe(true);
	    var b = Axial.define('iface25', {
	      b: Axial.String
	    });
	    expect(Axial.getInterface('iface25').has('a')).toBe(false);
	    expect(Axial.getInterface('iface25').has('b')).toBe(true);
	    var c = Axial.define('iface25', {
	      c: Axial.String
	    });
	    expect(Axial.getInterface('iface25').has('a')).toBe(false);
	    expect(Axial.getInterface('iface25').has('b')).toBe(false);
	    expect(Axial.getInterface('iface25').has('c')).toBe(true);
	    expect(Axial.interfaces()['iface25'].length).toBe(3);
	    expect(Axial.interfaces()['iface25'][0].has('a')).toBe(true);
	    expect(Axial.interfaces()['iface25'][1].has('b')).toBe(true);
	    expect(Axial.interfaces()['iface25'][2].has('c')).toBe(true);
	  });
	
	  it('2.6 should be able to test equality of interfaces to objects', function () {
	    var iface26A = Axial.define('iface26A', {
	      a: Axial.String,
	      b: Axial.Number
	    });
	    var iface26B = Axial.define('iface26B', {
	      a: Axial.Boolean,
	      b: iface26A
	    });
	    var instA = iface26B.new({
	      a: true,
	      b: {
	        a: 'abc',
	        b: 5
	      }
	    });
	    expect(instA[PROXY].equals({
	      a: true,
	      b: {
	        a: 'abc',
	        b: 5
	      }
	    })).toBe(true);
	    expect(instA[PROXY].equals({
	      a: false,
	      b: {
	        a: 'abc',
	        b: 5
	      }
	    })).toBe(false);
	    expect(instA[PROXY].equals({
	      a: true,
	      b: {
	        a: 'abc',
	        b: 6
	      }
	    })).toBe(false);
	  });
	});
	
	describe('3. Creating Instances', function () {
	  var iface = void 0;
	  var a = null;
	
	  before(function () {
	    iface = Axial.define('iface', {
	      x: {
	        y: {
	          z: [Axial.Number, Axial.Boolean, Axial.Undefined]
	        }
	      },
	      a: {
	        b: Axial.Function
	      }
	    });
	  });
	
	  it('3.1.a should be able to create instances of interfaces', function () {
	    a = iface.new();
	    expect(a).toBeA(Axial.Instance.constructor);
	    expect(Axial.typeOf(a)).toBe(iface);
	    expect(Axial.proxy(a).stringify()).toBe('{"x":{"y":{"z":0}},"a":{}}');
	  });
	
	  it('3.1.b should be able to create instances of interfaces with given values', function () {
	    iface = Axial.define('iface', {
	      x: {
	        y: {
	          z: [Axial.Number, Axial.Boolean, Axial.Undefined]
	        }
	      },
	      a: {
	        b: Axial.Function.orNull()
	      }
	    });
	
	    a = iface.new({
	      'x.y.z': 6,
	      a: {
	        b: function b() {
	          return this[PROXY].root.x.y.z;
	        }
	      }
	    });
	    expect(a.x).toBeA(Axial.Instance.constructor);
	    expect(a.x.y).toBeA(Axial.Instance.constructor);
	    expect(a.x.y.z).toBe(6);
	    expect(a.a.b()).toBe(6);
	    expect(Axial.getInterface('iface')).toBe(iface);
	    expect(Axial.typeOf(a)).toBe(iface);
	    expect(Axial.proxy(a).stringify()).toBe('{"x":{"y":{"z":6}},"a":{}}');
	  });
	
	  it('3.2.a should NOT be allowed to create instance with non-interface properties', function () {
	    expect(function () {
	      iface.new({
	        a: 1
	      });
	    }).toThrow(Axial.UnknownInterfaceKey);
	  });
	
	  it('3.2.b should NOT be allowed to create instance with invalid type', function () {
	    expect(function () {
	      iface.new({
	        x: {
	          y: false
	        }
	      });
	    }).toThrow(Axial.InvalidType);
	    expect(function () {
	      iface.new({
	        x: {
	          y: {
	            z: 'foo'
	          }
	        }
	      });
	    }).toThrow(Axial.InvalidType);
	    expect(function () {
	      iface.new({
	        a: {
	          b: 3
	        }
	      });
	    }).toThrow(Axial.InvalidType);
	  });
	
	  it('3.3 should be able to set multiple types', function () {
	    expect(function () {
	      a.x.y.z = 5;
	      a.x.y.z = false;
	    }).toNotThrow();
	    expect(function () {
	      a.x.y.z = {};
	    }).toThrow(Axial.InvalidType);
	  });
	
	  it('3.4 should be able to use arrays', function () {
	    iface = Axial.define('iface', {
	      a: Axial.Array(),
	      b: Axial.Array(Axial.String),
	      c: Axial.Array(Axial.Object),
	      d: Axial.Array(Axial.Array(Axial.String))
	    });
	    a = iface.new();
	    a.a = [];
	    a.b = [];
	    a.b = ['abc'];
	    a.c = [];
	    a.c = [{ x: 1 }];
	    a.d = [];
	    a.d = [['abc'], ['efg']];
	    expect(function () {
	      return a.a = false;
	    }).toThrow(Axial.InvalidType);
	    expect(function () {
	      return a.b = [123];
	    }).toThrow(Axial.InvalidType);
	    expect(function () {
	      return a.c = [[]];
	    }).toThrow(Axial.InvalidType);
	    expect(function () {
	      return a.c = [[123]];
	    }).toThrow(Axial.InvalidType);
	    expect(Axial.proxy(a).stringify()).toBe('{"a":[],"b":["abc"],"c":[{"x":1}],"d":[["abc"],["efg"]]}');
	  });
	
	  it('3.5 should be able to use objects', function () {
	    iface = Axial.define('iface', {
	      a: Axial.Object
	    });
	    a = iface.new();
	    a.a = { x: 1 };
	    expect(function () {
	      return a.a = null;
	    }).toThrow(Axial.InvalidType);
	    expect(function () {
	      return a.a = [123];
	    }).toThrow(Axial.InvalidType);
	  });
	
	  it('3.6 should NOT be able to create empty instances with required properties', function () {
	    iface = Axial.define({
	      a: [Axial.String.required()]
	    });
	    expect(function () {
	      a = iface.new();
	    }).toThrow();
	    expect(function () {
	      a = iface.new({
	        a: 'foo'
	      });
	    }).toNotThrow();
	  });
	});
	
	describe('4. Configuring Interface Property Types', function () {
	  var iface = void 0;
	
	  it('4.1 should be able to set default property', function () {
	    iface = Axial.define({
	      x: Axial.Number.extend({
	        defaultValue: 5,
	        min: -10,
	        max: 10
	      }),
	      y: Axial.String.extend({
	        defaultValue: 'foo',
	        pattern: /foo/
	      }),
	      a: Axial.String.extend({
	        defaultValue: 'baz',
	        validator: function validator(value) {
	          if (value !== 'baz') {
	            throw new Error('Not a baz!');
	          }
	        }
	      }),
	      b: Axial.Number.extend({
	        validator: function validator(value) {
	          if (value % 10 !== 0) {
	            throw new Error('Must be multiple of 10');
	          }
	        }
	      })
	    });
	    expect(iface.new().x).toBe(5);
	  });
	
	  it('4.2 should be able to set min/max values for numbers', function () {
	    expect(function () {
	      iface.new({ x: -11 });
	    }).toThrow(Axial.InvalidNumericType);
	    expect(function () {
	      iface.new({ x: 11 });
	    }).toThrow(Axial.InvalidNumericType);
	  });
	
	  it('4.3 should be able to match a string with a regex pattern', function () {
	    expect(function () {
	      iface.new({ y: 'bah' });
	    }).toThrow(Axial.InvalidStringPattern);
	    expect(function () {
	      iface.new({ y: 'foo' });
	    }).toNotThrow();
	  });
	
	  it('4.4 should be able to supply custom validator function', function () {
	    expect(function () {
	      iface.new({ a: 'bah' });
	    }).toThrow();
	    expect(function () {
	      iface.new({ a: 'baz' });
	    }).toNotThrow();
	    expect(function () {
	      iface.new({ b: 1000 });
	    }).toNotThrow();
	    expect(function () {
	      iface.new({ b: 12 });
	    }).toThrow();
	  });
	});
	
	describe('5. Listening to instance changes', function () {
	  var iface = Axial.define('iface', {
	    a: Axial.Object
	  });
	  var a = iface.new();
	
	  it('5.1 should be able to listen to set property changes of instances (global/local)', function () {
	    var handlerCount = 0;
	    var fn = function fn(eventData) {
	      expect(eventData.method).toBe('set');
	      expect(eventData.value.y).toBe(5);
	      handlerCount++;
	    };
	    Axial.bind(fn);
	    a[PROXY].bind('a', fn);
	    a.a = { y: 5 };
	    a[PROXY].unbind();
	    Axial.unbind();
	    expect(handlerCount).toBe(2);
	  });
	
	  it('5.2 should be able to listen to get property changes of instances (global/local)', function () {
	    var handlerCount = 0;
	    var fn = function fn(eventData) {
	      expect(eventData.method).toBe('get');
	      expect(eventData.value.y).toBe(5);
	      handlerCount++;
	    };
	    Axial.bind(fn);
	    a[PROXY].bind('a', fn);
	    var test = a.a;
	    a[PROXY].unbind();
	    Axial.unbind();
	    expect(handlerCount).toBe(2);
	  });
	});
	
	describe('6. Composite interfaces', function () {
	  var ifaceA = void 0,
	      ifaceB = void 0;
	
	  it('6.1 should be able to compose interfaces from other interfaces', function () {
	    ifaceA = Axial.define('ifaceA', {
	      x: [Axial.String, Axial.Undefined],
	      y: {
	        z: [Axial.Number, Axial.Undefined]
	      }
	    });
	    ifaceB = Axial.define('ifaceB', {
	      a: ifaceA,
	      b: {
	        c: [Axial.Number, ifaceA]
	      }
	    });
	    var a = ifaceB.new();
	    expect(function () {
	      ifaceB.new({
	        a: {
	          x: 'a',
	          y: {
	            z: 3
	          }
	        },
	        b: {
	          c: 2
	        }
	      });
	    }).toNotThrow();
	    expect(function () {
	      ifaceB.new({
	        a: {
	          x: 'a',
	          y: {
	            z: 'abc' // <- error
	          }
	        },
	        b: {
	          c: 2
	        }
	      });
	    }).toThrow();
	    expect(function () {
	      ifaceB.new({
	        a: {
	          x: 'a',
	          y: {
	            z: 3
	          }
	        },
	        b: {
	          c: {
	            x: 'a',
	            y: {
	              z: 3
	            }
	          }
	        }
	      });
	    }).toNotThrow();
	    expect(function () {
	      ifaceB.new({
	        a: {
	          x: 'a',
	          y: {
	            z: 3
	          }
	        },
	        b: {
	          c: {
	            x: 'a',
	            y: {
	              z: 3
	            }
	          }
	        }
	      });
	    }).toNotThrow();
	    expect(function () {
	      ifaceB.new({
	        a: {
	          x: 'a',
	          y: {
	            z: 3
	          }
	        },
	        b: {
	          c: {
	            x: 'a',
	            y: {
	              z: 'a' // <- error
	            }
	          }
	        }
	      });
	    }).toThrow();
	    expect(Axial.typeOf({
	      a: {
	        x: 'a',
	        y: {
	          z: 3
	        }
	      },
	      b: {
	        c: 2
	      }
	    })).toBe(ifaceB);
	    expect(Axial.typeOf({
	      x: undefined,
	      y: {
	        z: 3
	      }
	    })).toBe(ifaceA);
	  });
	
	  it('6.2 should be able to test whether an object matches an interface', function () {
	    expect(ifaceA.is({
	      x: undefined,
	      y: {
	        z: 1
	      }
	    })).toBe(true);
	    expect(ifaceA.is({
	      x: 3, //<- error
	      y: {
	        z: 1
	      }
	    })).toBe(false);
	    expect(ifaceA.is({
	      x: 'a',
	      y: {} //<- partial value ok
	    })).toBe(true);
	
	    expect(ifaceB.is({
	      a: {
	        x: undefined,
	        y: {
	          z: 1
	        }
	      },
	      b: {
	        c: 3
	      }
	    })).toBe(true);
	    expect(ifaceB.is({
	      a: {
	        x: undefined,
	        y: {
	          z: 1
	        }
	      },
	      b: {
	        c: {
	          x: undefined,
	          y: {
	            z: 1
	          }
	        }
	      }
	    })).toBe(true);
	    expect(ifaceB.is({
	      a: {
	        x: undefined,
	        y: {
	          z: 1
	        }
	      },
	      b: {
	        c: {
	          x: 3, //<- error
	          y: {
	            z: 1
	          }
	        }
	      }
	    })).toBe(false);
	  });
	});
	
	describe('7. Arrays', function () {
	  it('7.1.a should detect nested array types', function () {
	    expect(Axial.Array(Axial.Array(Axial.Array(Axial.String))).is([[['abc']]])).toBe(true);
	    expect(Axial.Array(Axial.Array(Axial.Array(Axial.String))).is([[[3]]])).toBe(false);
	    expect(Axial.Array(Axial.Array(Axial.Array(Axial.String))).is([[['abc', 3]]])).toBe(false);
	  });
	
	  it('7.1.b should detect complex array types', function () {
	    var subIFace = Axial.define({
	      x: Axial.String
	    });
	    var iface = Axial.define({
	      a: Axial.Array(Axial.Array(subIFace))
	    });
	    expect(function () {
	      return iface.new({ a: [[{ x: 'foo' }]] });
	    }).toNotThrow();
	    expect(function () {
	      return iface.new({ a: [[{ x: 1 }]] });
	    }).toThrow();
	    expect(function () {
	      return iface.new({ a: [[{ y: 'foo' }]] });
	    }).toThrow();
	    expect(iface.new({ a: [[{ x: 'foo' }]] }).a[0][0].constructor).toBe(Axial.Instance.constructor);
	    expect(iface.new({ a: [[{ x: 'foo' }]] }).a[0][0][PROXY].iface).toBe(subIFace);
	  });
	
	  it('7.2 should be able to bind array mutations to instance values', function () {
	    var IFace = Axial.define({
	      a: Axial.Array(Axial.Number)
	    });
	    var instance = IFace.new({
	      a: [1, 2, 3]
	    });
	    var array = instance.a;
	    var proxy = instance[PROXY];
	    var dispatch = 0;
	
	    // get indexes
	    proxy.bind('a', function (e) {
	      expect(e.method).toBe('get');
	      expect(e.arrayMethod).toBe('index');
	      expect(e.index).toBe(2);
	      expect(e.value).toEqual(3);
	      dispatch++;
	    });
	    expect(array[2]).toBe(3);
	    proxy.unbind('a');
	
	    // get indexes
	    proxy.bind('a', function (e) {
	      expect(e.method).toBe('set');
	      expect(e.arrayMethod).toBe('index');
	      expect(e.index).toBe(2);
	      expect(e.value).toEqual(6);
	      dispatch++;
	    });
	    array[2] = 6;
	    proxy.unbind('a');
	
	    // copyWithin
	    proxy.bind('a', function (e) {
	      expect(e.arrayMethod).toBe('copyWithin');
	      expect(array.length).toBe(3);
	      expect(array.array).toEqual([2, 6, 6]);
	      dispatch++;
	    });
	    array.copyWithin(0, 1);
	    proxy.unbind('a');
	
	    // fill
	    proxy.bind('a', function (e) {
	      expect(e.arrayMethod).toBe('fill');
	      expect(array.length).toBe(3);
	      expect(array.array).toEqual([4, 4, 4]);
	      dispatch++;
	    });
	    array.fill(4);
	    proxy.unbind('a');
	
	    // pop
	    proxy.bind('a', function (e) {
	      expect(e.arrayMethod).toBe('pop');
	      expect(array.length).toBe(2);
	      expect(array.array).toEqual([4, 4]);
	      dispatch++;
	    });
	    array.pop();
	    proxy.unbind('a');
	
	    // push
	    proxy.bind('a', function (e) {
	      expect(e.arrayMethod).toBe('push');
	      expect(array.length).toBe(3);
	      expect(array.array).toEqual([4, 4, 5]);
	      dispatch++;
	    });
	    array.push(5);
	    proxy.unbind('a');
	
	    // reverse
	    proxy.bind('a', function (e) {
	      expect(e.arrayMethod).toBe('reverse');
	      expect(array.length).toBe(3);
	      expect(array.array).toEqual([5, 4, 4]);
	      dispatch++;
	    });
	    array.reverse();
	    proxy.unbind('a');
	
	    // shift
	    proxy.bind('a', function (e) {
	      expect(e.arrayMethod).toBe('shift');
	      expect(array.length).toBe(2);
	      expect(array.array).toEqual([4, 4]);
	      dispatch++;
	    });
	    expect(array.shift()).toBe(5);
	    proxy.unbind('a');
	
	    // sort
	    array.push(3);
	    proxy.bind('a', function (e) {
	      expect(e.arrayMethod).toBe('sort');
	      expect(array.length).toBe(3);
	      expect(array.array).toEqual([3, 4, 4]);
	      dispatch++;
	    });
	    array.sort(function (a, b) {
	      return a < b ? -1 : a > b ? 1 : 0;
	    });
	    proxy.unbind('a');
	
	    // splice
	    var round = 1;
	    proxy.bind('a', function (e) {
	      expect(e.arrayMethod).toBe('splice');
	      if (round === 1) {
	        expect(array.length).toBe(2);
	        expect(array.array).toEqual([3, 4]);
	      } else if (round === 2) {
	        expect(array.length).toBe(5);
	        expect(array.array).toEqual([1, 2, 3, 3, 4]);
	      } else {
	        throw new Error('Too many rounds!');
	      }
	      round++;
	      dispatch++;
	    });
	    array.splice(1, 1);
	    array.splice(0, 0, 1, 2, 3);
	    proxy.unbind('a');
	
	    // unshift
	    proxy.bind('a', function (e) {
	      expect(e.arrayMethod).toBe('unshift');
	      expect(array.length).toBe(7);
	      expect(array.array).toEqual([7, 8, 1, 2, 3, 3, 4]);
	      dispatch++;
	    });
	    expect(array.unshift(7, 8)).toBe(7);
	    proxy.unbind('a');
	
	    expect(dispatch).toBe(12);
	  });
	
	  it('7.3 should not be able to add illegal type to typed array', function () {
	    var Item = Axial.define({ text: Axial.String });
	    var List = Axial.define({ items: Axial.Array(Item) });
	    var list = List.new();
	    var validItem = Item.new({ text: 'valid' });
	    var invalidItem = { foo: 'bar' };
	    list.items.add(validItem);
	    expect(function () {
	      list.items.add(invalidItem);
	    }).toThrow();
	    expect(list.items.contains(validItem)).toBe(true);
	    expect(list.items.contains(invalidItem)).toBe(false);
	    list.items.remove(validItem);
	    expect(list.items.isEmpty).toBe(true);
	    expect(list.items.contains(validItem)).toBe(false);
	  });
	
	  it('7.4 should convert arrays to AxialInstanceArray', function () {
	    var iface = Axial.define({
	      a: Axial.Array(Axial.Array(Axial.Number))
	    });
	    var inst = iface.new({ a: [[123]] });
	    expect(inst.a).toBeA(Axial.InstanceArray);
	    expect(inst.a[0].constructor).toBeA(Axial.InstanceArray.constructor);
	    expect(inst.a[0][0].constructor).toBeA(Axial.InstanceArray.constructor);
	  });
	
	  it('7.5 should convert plain objects to AxialInstances', function () {
	    var iface = Axial.define({
	      a: Axial.String
	    });
	    var aiface = Axial.define({
	      x: Axial.Array(iface)
	    });
	    var inst = aiface.new({ x: [{ a: 'abc' }] });
	    expect(inst.x[0].constructor).toBe(Axial.Instance.constructor);
	    inst.x[0] = { a: 'efg' };
	    expect(inst.x[0].constructor).toBe(Axial.Instance.constructor);
	    expect(inst.x[0].a).toBe('efg');
	  });
	});
	
	describe('8. Interface Inheritance', function () {
	  var ifaceA = void 0,
	      ifaceB = void 0,
	      ifaceC = void 0;
	  var inst = void 0;
	
	  it('8.1 should be able to define interfaces which inherit from another interface', function () {
	    ifaceA = Axial.define('ifaceA', {
	      a: Axial.String.set('a'),
	      foo: Axial.String,
	      who: Axial.Function.set(function (x) {
	        return 'ifaceA-' + x;
	      })
	    });
	
	    ifaceB = ifaceA.extend('ifaceB', {
	      b: Axial.String.set('b'),
	      foo: Axial.Number,
	      who: Axial.Function.set(function (x) {
	        return 'ifaceB-' + x;
	      })
	    });
	
	    ifaceC = ifaceB.extend('ifaceC', {
	      c: Axial.String.set('c'),
	      foo: Axial.Boolean,
	      who: Axial.Function.set(function (x) {
	        return 'ifaceC-' + x;
	      })
	    });
	  });
	
	  it('8.2.a interface should be able to inherit from another interface by one level', function () {
	    inst = ifaceB.new();
	    expect(function () {
	      inst.foo = 'string'; // invalid input
	    }).toThrow();
	    expect(function () {
	      inst.foo = 3; // valid input
	    }).toNotThrow();
	    expect(ifaceB.has('a')).toBe(true);
	    expect(ifaceB.has('b')).toBe(true);
	    expect(ifaceB.has('foo')).toBe(true);
	    expect(ifaceB.has('who')).toBe(true);
	    expect(ifaceB.prop('a').iface.id).toBe('ifaceA');
	    expect(ifaceB.prop('b').iface.id).toBe('ifaceB');
	    expect(ifaceB.prop('foo').iface.id).toBe('ifaceB');
	    expect(ifaceB.prop('who').iface.id).toBe('ifaceB');
	    expect(inst.who(123)).toBe('ifaceB-123');
	    expect(inst[PROXY].super.ifaceA.who(123)).toBe('ifaceA-123');
	  });
	
	  it('8.2.b interface should be able to to inherit from another interface by multiple levels', function () {
	    inst = ifaceC.new();
	    expect(function () {
	      inst.foo = 3; // invalid input
	    }).toThrow();
	    expect(function () {
	      inst.foo = false; // valid input
	    }).toNotThrow();
	    expect(ifaceC.has('a')).toBe(true);
	    expect(ifaceC.has('b')).toBe(true);
	    expect(ifaceC.has('c')).toBe(true);
	    expect(ifaceC.has('foo')).toBe(true);
	    expect(ifaceC.has('who')).toBe(true);
	    expect(ifaceC.prop('a').iface.id).toBe('ifaceA');
	    expect(ifaceC.prop('b').iface.id).toBe('ifaceB');
	    expect(ifaceC.prop('c').iface.id).toBe('ifaceC');
	    expect(ifaceC.prop('foo').iface.id).toBe('ifaceC');
	    expect(ifaceC.prop('who').iface.id).toBe('ifaceC');
	    expect(inst.who(123)).toBe('ifaceC-123');
	    expect(inst[PROXY].super.ifaceA.who(123)).toBe('ifaceA-123');
	    expect(inst[PROXY].super.ifaceB.who(123)).toBe('ifaceB-123');
	  });
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	module.exports = function Define_Axial() {
	  var CONST = __webpack_require__(2);
	  var PROXY_KEY = CONST.PROXY_KEY;
	  var BLANK_INTERFACE_NAME = CONST.BLANK_INTERFACE_NAME;
	  var _arrayTypes = {};
	  var _listeners = [];
	  var _interfaces = {};
	  var _instances = {};
	  var _bindings = [];
	  var _arrayMembers = CONST.ARRAY_MEMBERS;
	  var _arrayMutators = CONST.ARRAY_MUTATORS;
	  var _logListeners = {};
	
	  var _logListenerCount = 0;
	  var _pushId = 0;
	  var util = void 0,
	      T = void 0;
	  var _instanceId = 0,
	      _interfaceId = 0,
	      _instanceArrayId = 0;
	
	  function _proxy(instance) {
	    return instance[PROXY_KEY];
	  }
	
	  // -------------------------------------------------------------------------------------- Errors
	  var Exception = function ExtendableBuiltin(cls) {
	    function ExtendableBuiltin() {
	      cls.apply(this, arguments);
	    }
	    ExtendableBuiltin.prototype = Object.create(cls.prototype);
	    Object.setPrototypeOf(ExtendableBuiltin, cls);
	    return ExtendableBuiltin;
	  }(Error);
	
	  var AxialUnsupportedType = function (_Exception) {
	    _inherits(AxialUnsupportedType, _Exception);
	
	    function AxialUnsupportedType(value) {
	      _classCallCheck(this, AxialUnsupportedType);
	
	      var message = 'Unsupported type "' + ('' + (typeof value === 'undefined' ? 'undefined' : _typeof(value))) + '". Only AxialTypes can be provided.';
	
	      var _this = _possibleConstructorReturn(this, (AxialUnsupportedType.__proto__ || Object.getPrototypeOf(AxialUnsupportedType)).call(this, message));
	
	      _this.value = value;
	      _this.message = message;
	      return _this;
	    }
	
	    return AxialUnsupportedType;
	  }(Exception);
	
	  var AxialInvalidType = function (_Exception2) {
	    _inherits(AxialInvalidType, _Exception2);
	
	    function AxialInvalidType(given, expected, instance, property) {
	      _classCallCheck(this, AxialInvalidType);
	
	      var instString = instance ? _proxy(instance).toString() : '?';
	      var message = 'Invalid type for property "' + property.path + ('" ~ "' + given + '" given, "' + expected + '" expected');
	
	      var _this2 = _possibleConstructorReturn(this, (AxialInvalidType.__proto__ || Object.getPrototypeOf(AxialInvalidType)).call(this, message));
	
	      _this2.given = given;
	      _this2.expected = expected;
	      _this2.instance = instance;
	      _this2.property = property;
	      _this2.message = message;
	      return _this2;
	    }
	
	    return AxialInvalidType;
	  }(Exception);
	
	  var AxialInvalidNumericRange = function (_Exception3) {
	    _inherits(AxialInvalidNumericRange, _Exception3);
	
	    function AxialInvalidNumericRange(given, min, max) {
	      _classCallCheck(this, AxialInvalidNumericRange);
	
	      var message = 'Invalid numeric range - expected [' + min + ' .. ' + max + '], given ' + given;
	
	      var _this3 = _possibleConstructorReturn(this, (AxialInvalidNumericRange.__proto__ || Object.getPrototypeOf(AxialInvalidNumericRange)).call(this, message));
	
	      _this3.given = given;
	      _this3.min = min;
	      _this3.max = max;
	      _this3.message = message;
	      return _this3;
	    }
	
	    return AxialInvalidNumericRange;
	  }(Exception);
	
	  var AxialInvalidStringPattern = function (_Exception4) {
	    _inherits(AxialInvalidStringPattern, _Exception4);
	
	    function AxialInvalidStringPattern(given, pattern) {
	      _classCallCheck(this, AxialInvalidStringPattern);
	
	      var message = 'Invalid string pattern - expected "' + pattern + '", given "' + given + '"';
	
	      var _this4 = _possibleConstructorReturn(this, (AxialInvalidStringPattern.__proto__ || Object.getPrototypeOf(AxialInvalidStringPattern)).call(this, message));
	
	      _this4.given = given;
	      _this4.pattern = pattern;
	      _this4.message = message;
	      return _this4;
	    }
	
	    return AxialInvalidStringPattern;
	  }(Exception);
	
	  var AxialUndefinedValue = function (_Exception5) {
	    _inherits(AxialUndefinedValue, _Exception5);
	
	    function AxialUndefinedValue(source, path) {
	      _classCallCheck(this, AxialUndefinedValue);
	
	      var message = 'Undefined value for object path "' + path + '"';
	
	      var _this5 = _possibleConstructorReturn(this, (AxialUndefinedValue.__proto__ || Object.getPrototypeOf(AxialUndefinedValue)).call(this, message));
	
	      _this5.source = source;
	      _this5.path = path;
	      _this5.message = message;
	      return _this5;
	    }
	
	    return AxialUndefinedValue;
	  }(Exception);
	
	  var AxialTypeAlreadyDefined = function (_Exception6) {
	    _inherits(AxialTypeAlreadyDefined, _Exception6);
	
	    function AxialTypeAlreadyDefined(typeName, key, iface) {
	      _classCallCheck(this, AxialTypeAlreadyDefined);
	
	      var message = 'Type "' + typeName + '" is already defined for property "' + key + '" in schema "' + iface.id + '"';
	
	      var _this6 = _possibleConstructorReturn(this, (AxialTypeAlreadyDefined.__proto__ || Object.getPrototypeOf(AxialTypeAlreadyDefined)).call(this, message));
	
	      _this6.typeName = typeName;
	      _this6.key = key;
	      _this6.iface = iface;
	      _this6.message = message;
	      return _this6;
	    }
	
	    return AxialTypeAlreadyDefined;
	  }(Exception);
	
	  var AxialInvalidArgument = function (_Exception7) {
	    _inherits(AxialInvalidArgument, _Exception7);
	
	    function AxialInvalidArgument(index, expected, given) {
	      _classCallCheck(this, AxialInvalidArgument);
	
	      var message = 'Invalid argument #' + index + ' - Expected "' + expected + '", given "' + given + '"';
	
	      var _this7 = _possibleConstructorReturn(this, (AxialInvalidArgument.__proto__ || Object.getPrototypeOf(AxialInvalidArgument)).call(this, message));
	
	      _this7.index = index;
	      _this7.expected = expected;
	      _this7.given = given;
	      return _this7;
	    }
	
	    return AxialInvalidArgument;
	  }(Exception);
	
	  var AxialMissingProperty = function (_Exception8) {
	    _inherits(AxialMissingProperty, _Exception8);
	
	    function AxialMissingProperty(key, iface, object) {
	      _classCallCheck(this, AxialMissingProperty);
	
	      var message = 'Missing interface property "' + key + '" from given object';
	
	      var _this8 = _possibleConstructorReturn(this, (AxialMissingProperty.__proto__ || Object.getPrototypeOf(AxialMissingProperty)).call(this, message));
	
	      _this8.key = key;
	      _this8.object = object;
	      _this8.iface = iface;
	      _this8.message = message;
	      return _this8;
	    }
	
	    return AxialMissingProperty;
	  }(Exception);
	
	  var AxialUnexpectedProperty = function (_Exception9) {
	    _inherits(AxialUnexpectedProperty, _Exception9);
	
	    function AxialUnexpectedProperty(key, iface, instance) {
	      _classCallCheck(this, AxialUnexpectedProperty);
	
	      var message = 'Unexpected key "' + key + '" found in given object not declared in interface "' + iface._id + '"';
	
	      var _this9 = _possibleConstructorReturn(this, (AxialUnexpectedProperty.__proto__ || Object.getPrototypeOf(AxialUnexpectedProperty)).call(this, message));
	
	      _this9.key = key;
	      _this9.iface = iface;
	      _this9.instance = instance;
	      _this9.message = message;
	      return _this9;
	    }
	
	    return AxialUnexpectedProperty;
	  }(Exception);
	
	  var Errors = {
	    UnsupportedType: AxialUnsupportedType,
	    InvalidType: AxialInvalidType,
	    InvalidNumericRange: AxialInvalidNumericRange,
	    InvalidStringPattern: AxialInvalidStringPattern,
	    UndefinedValue: AxialUndefinedValue,
	    TypeAlreadyDefined: AxialTypeAlreadyDefined,
	    InvalidArgument: AxialInvalidArgument,
	    MissingProperty: AxialMissingProperty,
	    IllegalProperty: AxialUnexpectedProperty
	  };
	
	  // -------------------------------------------------------------------------------------- Types
	
	  var AxialType = function () {
	    function AxialType() {
	      _classCallCheck(this, AxialType);
	
	      this._defaultValue = undefined;
	      this._required = false;
	      this._baseType = this;
	      this._validator = null;
	    }
	
	    _createClass(AxialType, [{
	      key: 'validate',
	      value: function validate(value, instance, property) {
	        if (typeof this._validator === 'function') {
	          this._validator(value, instance, property);
	          return;
	        }
	        if (!this.is(value)) {
	          //given, expected, key, instance
	          throw new AxialInvalidType(this.id, util.typeOf(value).id, instance, property);
	        }
	      }
	    }, {
	      key: 'is',
	      value: function is(value) {
	        return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === this.id;
	      }
	    }, {
	      key: 'toString',
	      value: function toString() {
	        return this.id;
	      }
	    }, {
	      key: 'clone',
	      value: function clone() {
	        var copy = new this.constructor();
	        for (var key in this) {
	          if (this.hasOwnProperty(key)) {
	            copy[key] = this[key];
	          }
	        }
	        copy._baseType = this.baseType;
	        return copy;
	      }
	    }, {
	      key: 'extend',
	      value: function extend(options) {
	        var copy = this.clone();
	        if (util.isPlainObject(options)) {
	          for (var key in options) {
	            if (options.hasOwnProperty(key)) {
	              copy['_' + key] = options[key];
	            }
	          }
	        } else if (typeof options !== 'undefined') {
	          copy._defaultValue = options;
	        }
	        return copy;
	      }
	    }, {
	      key: 'defaultValue',
	      value: function defaultValue(value) {
	        var copy = this.clone();
	        copy._defaultValue = value;
	        return copy;
	      }
	    }, {
	      key: 'required',
	      value: function required() {
	        var copy = this.clone();
	        copy._required = true;
	        return copy;
	      }
	    }, {
	      key: 'id',
	      get: function get() {
	        return this._id || this.constructor.id;
	      }
	    }, {
	      key: 'baseType',
	      get: function get() {
	        return this._baseType ? this._baseType : this;
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return '?';
	      }
	    }]);
	
	    return AxialType;
	  }();
	
	  var AxialTypePrototype = AxialType.prototype;
	
	  var AxialNull = function (_AxialType) {
	    _inherits(AxialNull, _AxialType);
	
	    function AxialNull() {
	      _classCallCheck(this, AxialNull);
	
	      var _this10 = _possibleConstructorReturn(this, (AxialNull.__proto__ || Object.getPrototypeOf(AxialNull)).call(this));
	
	      _this10._defaultValue = null;
	      return _this10;
	    }
	
	    _createClass(AxialNull, [{
	      key: 'is',
	      value: function is(value) {
	        return value === null;
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'null';
	      }
	    }]);
	
	    return AxialNull;
	  }(AxialType);
	
	  var AxialUndefined = function (_AxialType2) {
	    _inherits(AxialUndefined, _AxialType2);
	
	    function AxialUndefined() {
	      _classCallCheck(this, AxialUndefined);
	
	      var _this11 = _possibleConstructorReturn(this, (AxialUndefined.__proto__ || Object.getPrototypeOf(AxialUndefined)).call(this));
	
	      _this11._defaultValue = undefined;
	      return _this11;
	    }
	
	    _createClass(AxialUndefined, [{
	      key: 'is',
	      value: function is(value) {
	        return typeof value === 'undefined';
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'undefined';
	      }
	    }]);
	
	    return AxialUndefined;
	  }(AxialType);
	
	  var AxialString = function (_AxialType3) {
	    _inherits(AxialString, _AxialType3);
	
	    function AxialString() {
	      _classCallCheck(this, AxialString);
	
	      var _this12 = _possibleConstructorReturn(this, (AxialString.__proto__ || Object.getPrototypeOf(AxialString)).call(this));
	
	      _this12._pattern = null;
	      _this12._defaultValue = '';
	      return _this12;
	    }
	
	    _createClass(AxialString, [{
	      key: 'validate',
	      value: function validate(value, instance, property) {
	        if (typeof this._validator === 'function') {
	          this._validator(value, instance, property);
	          return;
	        }
	        if (!this.is(value)) {
	          if (typeof value !== 'string') {
	            throw new AxialInvalidType(util.typeOf(value).id, 'string', instance, property);
	          }
	          throw new AxialInvalidStringPattern(value, this._pattern);
	        }
	      }
	    }, {
	      key: 'is',
	      value: function is(value) {
	        return AxialTypePrototype.is.call(this, value) && (this._pattern ? !!value.match(this._pattern) : true);
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'string';
	      }
	    }]);
	
	    return AxialString;
	  }(AxialType);
	
	  var AxialNumber = function (_AxialType4) {
	    _inherits(AxialNumber, _AxialType4);
	
	    function AxialNumber() {
	      _classCallCheck(this, AxialNumber);
	
	      var _this13 = _possibleConstructorReturn(this, (AxialNumber.__proto__ || Object.getPrototypeOf(AxialNumber)).call(this));
	
	      _this13._min = Number.MIN_SAFE_INTEGER;
	      _this13._max = Number.MAX_SAFE_INTEGER;
	      _this13._defaultValue = 0;
	      return _this13;
	    }
	
	    _createClass(AxialNumber, [{
	      key: 'validate',
	      value: function validate(value, instance, property) {
	        if (typeof this._validator === 'function') {
	          this._validator(value, instance, property);
	          return;
	        }
	        if (!this.is(value)) {
	          if (typeof value !== 'number') {
	            throw new AxialInvalidType('number', util.typeOf(value).id, instance, property);
	          }
	          throw new AxialInvalidNumericRange(value, this._min, this._max);
	        }
	      }
	    }, {
	      key: 'is',
	      value: function is(value) {
	        return AxialTypePrototype.is.call(this, value) && value >= this._min && value <= this._max;
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'number';
	      }
	    }]);
	
	    return AxialNumber;
	  }(AxialType);
	
	  var AxialBoolean = function (_AxialType5) {
	    _inherits(AxialBoolean, _AxialType5);
	
	    function AxialBoolean() {
	      _classCallCheck(this, AxialBoolean);
	
	      var _this14 = _possibleConstructorReturn(this, (AxialBoolean.__proto__ || Object.getPrototypeOf(AxialBoolean)).call(this));
	
	      _this14._defaultValue = false;
	      return _this14;
	    }
	
	    _createClass(AxialBoolean, null, [{
	      key: 'id',
	      get: function get() {
	        return 'boolean';
	      }
	    }]);
	
	    return AxialBoolean;
	  }(AxialType);
	
	  var AxialDate = function (_AxialType6) {
	    _inherits(AxialDate, _AxialType6);
	
	    function AxialDate() {
	      _classCallCheck(this, AxialDate);
	
	      var _this15 = _possibleConstructorReturn(this, (AxialDate.__proto__ || Object.getPrototypeOf(AxialDate)).call(this));
	
	      _this15._defaultValue = new Date();
	      return _this15;
	    }
	
	    _createClass(AxialDate, [{
	      key: 'is',
	      value: function is(value) {
	        return value instanceof Date;
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'date';
	      }
	    }]);
	
	    return AxialDate;
	  }(AxialType);
	
	  var AxialRegex = function (_AxialType7) {
	    _inherits(AxialRegex, _AxialType7);
	
	    function AxialRegex() {
	      _classCallCheck(this, AxialRegex);
	
	      var _this16 = _possibleConstructorReturn(this, (AxialRegex.__proto__ || Object.getPrototypeOf(AxialRegex)).call(this));
	
	      _this16._defaultValue = new RegExp('.*', 'i');
	      return _this16;
	    }
	
	    _createClass(AxialRegex, [{
	      key: 'is',
	      value: function is(value) {
	        return value instanceof RegExp;
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'regex';
	      }
	    }]);
	
	    return AxialRegex;
	  }(AxialType);
	
	  var AxialFunction = function (_AxialType8) {
	    _inherits(AxialFunction, _AxialType8);
	
	    function AxialFunction() {
	      _classCallCheck(this, AxialFunction);
	
	      var _this17 = _possibleConstructorReturn(this, (AxialFunction.__proto__ || Object.getPrototypeOf(AxialFunction)).call(this));
	
	      _this17._defaultValue = new Function();
	      return _this17;
	    }
	
	    _createClass(AxialFunction, [{
	      key: 'is',
	      value: function is(value) {
	        return typeof value === 'function';
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'function';
	      }
	    }]);
	
	    return AxialFunction;
	  }(AxialType);
	
	  var AxialArray = function (_AxialType9) {
	    _inherits(AxialArray, _AxialType9);
	
	    function AxialArray(type) {
	      _classCallCheck(this, AxialArray);
	
	      var _this18 = _possibleConstructorReturn(this, (AxialArray.__proto__ || Object.getPrototypeOf(AxialArray)).call(this));
	
	      _this18._type = type;
	      _this18._defaultValue = [];
	      return _this18;
	    }
	
	    _createClass(AxialArray, [{
	      key: 'is',
	      value: function is(value) {
	        var isArray = Array.isArray(value);
	        if (isArray) {
	          if (this._type instanceof AxialType) {
	            var l = value.length;
	            for (var i = 0; i < l; i++) {
	              if (!this._type.is(value[i])) {
	                return false;
	              }
	            }
	          }
	          return true;
	        } else {
	          return false;
	        }
	      }
	    }, {
	      key: 'isItem',
	      value: function isItem(item) {
	        if (this._type) {
	          return util.typeOf(item).id === this._type.id;
	        }
	        return true;
	      }
	    }, {
	      key: 'validate',
	      value: function validate(value, instance, property) {
	        if (!Array.isArray(value)) {
	          throw new AxialInvalidType(this.id, util.typeOf(value).id, instance, property);
	        }
	        if (this._type) {
	          var l = value.length;
	          var t = this._type;
	          for (var i = 0; i < l; i++) {
	            t.validate(value[i], instance, property);
	          }
	        }
	      }
	    }, {
	      key: 'type',
	      get: function get() {
	        return this._type;
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'array';
	      }
	    }]);
	
	    return AxialArray;
	  }(AxialType);
	
	  var AxialObject = function (_AxialType10) {
	    _inherits(AxialObject, _AxialType10);
	
	    function AxialObject() {
	      _classCallCheck(this, AxialObject);
	
	      var _this19 = _possibleConstructorReturn(this, (AxialObject.__proto__ || Object.getPrototypeOf(AxialObject)).call(this));
	
	      _this19._defaultValue = {};
	      return _this19;
	    }
	
	    _createClass(AxialObject, [{
	      key: 'is',
	      value: function is(value) {
	        return util.isPlainObject(value) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && !Array.isArray(value);
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'object';
	      }
	    }]);
	
	    return AxialObject;
	  }(AxialType);
	
	  var AxialInterface = function (_AxialObject) {
	    _inherits(AxialInterface, _AxialObject);
	
	    function AxialInterface() {
	      var interfaceId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : BLANK_INTERFACE_NAME;
	      var prototype = arguments[1];
	      var rootInterface = arguments[2];
	
	      _classCallCheck(this, AxialInterface);
	
	      var _this20 = _possibleConstructorReturn(this, (AxialInterface.__proto__ || Object.getPrototypeOf(AxialInterface)).call(this));
	
	      if (util.isPlainObject(interfaceId) && typeof prototype === 'undefined') {
	        // handle case where just single object prototype argument given
	        prototype = interfaceId;
	        interfaceId = BLANK_INTERFACE_NAME;
	      }
	
	      if (interfaceId === BLANK_INTERFACE_NAME) {
	        interfaceId += ++_interfaceId;
	      }
	
	      _this20._id = interfaceId;
	      _this20._properties = new Map();
	      _this20._allProps = new Map();
	      _this20._rootInterface = rootInterface;
	      _this20._methods = new Map();
	
	      _this20.define(prototype);
	
	      if (interfaceId) {
	        Axial.Interface[_this20._id] = _this20;
	      }
	
	      var _id = _this20._id;
	      _interfaces[_id] = _interfaces[_id] ? _interfaces[_id] : [];
	      _interfaces[_id].push(_this20);
	      return _this20;
	    }
	
	    _createClass(AxialInterface, [{
	      key: 'define',
	      value: function define(prototype) {
	        util.expandDotSyntaxKeys(prototype, function (path, key, object) {
	          util.setObjectAtPath(prototype, path, object);
	        });
	
	        for (var key in prototype) {
	          if (prototype.hasOwnProperty(key)) {
	            var definedTypes = {};
	            var typeDef = prototype[key];
	            if (!(typeDef instanceof AxialType) && !Array.isArray(typeDef)) {
	              var Type = Axial.typeOf(typeDef);
	              if (!(Type instanceof AxialObject)) {
	                typeDef = Type.extend(typeDef);
	              }
	            }
	            var isTypePlainObject = util.isPlainObject(typeDef);
	            var typeArray = Array.isArray(typeDef) ? typeDef : [typeDef];
	            typeArray = util.expandArray(typeArray);
	
	            var path = this._id ? this._id + '.' + key : BLANK_INTERFACE_NAME + '.' + key;
	
	            if (isTypePlainObject) {
	              typeArray = [new AxialInterface(path, typeDef, this.root)];
	            } else {
	              // check type is only defined once and is AxialType
	              for (var i = 0; i < typeArray.length; i++) {
	                var t = typeArray[i];
	                if (!util.isType(t)) {
	                  throw new AxialUnsupportedType(t);
	                }
	                var typeName = t.id;
	                if (definedTypes[typeName]) {
	                  throw new AxialTypeAlreadyDefined(t.id, key, this);
	                } else {
	                  definedTypes[typeName] = true;
	                }
	              }
	            }
	
	            var property = new AxialInterfaceProperty(this, key, typeArray, path);
	
	            if (property.is(Axial.Function)) {
	              this._methods.set(key, property.getType(Axial.Function)._defaultValue);
	            }
	
	            this._properties.set(key, property);
	          }
	        }
	      }
	    }, {
	      key: 'create',
	      value: function create() {
	        var _this21 = this;
	
	        var defaultValues = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	        var parentInstance = arguments[1];
	
	        // create instance
	        var instance = new AxialInstance();
	        var proxy = new AxialInstanceProxy(instance, this, parentInstance);
	
	        // check undefined keys are not being passed
	        var isPlainObject = util.isPlainObject(defaultValues);
	
	        if (isPlainObject) {
	          util.expandDotSyntaxKeys(defaultValues, function (path, key, object) {
	            if (!_this21._properties.has(key)) {
	              throw new AxialUnexpectedProperty(key, _this21, instance);
	            }
	            var prop = _this21._properties.get(key);
	            var subPath = path.split('.').slice(1).join('.');
	            var obj = {};
	            util.setObjectAtPath(obj, subPath, object);
	            defaultValues[key] = prop.primaryInterface.create(obj, instance);
	          });
	        }
	
	        for (var key in defaultValues) {
	          if (isPlainObject && defaultValues.hasOwnProperty(key)) {
	            if (!this._properties.has(key)) {
	              throw new AxialUnexpectedProperty(key, this, instance);
	            }
	          }
	        }
	
	        this._properties.forEach(function (property, key) {
	          // install getters and setters for each property in interface
	          var value = defaultValues[key];
	
	          // expect property definition type to be valid AxialType
	          if (defaultValues.hasOwnProperty(key)) {
	            property.validate(value, instance);
	          }
	
	          // define the getter and setter property of the instance
	          instance[Axial.PROXY_KEY].defineAccessors(property);
	
	          // if this is an interface, swap with AxialInstance from interface using plain object sub-tree as default values
	          if (property.is(Axial.Interface) && !value) {
	            value = property.primaryInterface.create(value, instance);
	          } else if (!defaultValues.hasOwnProperty(key)) {
	            if (property.isRequired) {
	              throw new AxialMissingProperty(key, _this21, defaultValues);
	            } else {
	              value = property.defaultValue;
	            }
	          }
	
	          // set the value of the property
	          if (typeof value !== 'undefined') {
	            property.set(instance, value);
	          }
	        });
	
	        // call init if present
	        if (typeof proxy._state.init === 'function') {
	          proxy._state.init.call(instance);
	        }
	
	        return instance;
	      }
	    }, {
	      key: 'validate',
	      value: function validate(value, instance, property) {
	        // check value is object
	        if (!AxialObject.prototype.is.call(this, value)) {
	          throw new AxialInvalidType(util.typeOf(value).id, this.id, instance, property);
	        }
	
	        // check value has no extra props
	        for (var key in value) {
	          if (value.hasOwnProperty(key)) {
	            if (key !== Axial.PROXY_KEY && !this._properties.has(key)) {
	              throw new AxialUnexpectedProperty(key, this, instance);
	            }
	          }
	        }
	
	        // check each prop validates
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	          for (var _iterator = this._properties.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var _step$value = _slicedToArray(_step.value, 2),
	                k = _step$value[0],
	                _property = _step$value[1];
	
	            if (!value.hasOwnProperty(k) && _property.isRequired) {
	              throw new AxialMissingProperty(k, this, value);
	            }
	            if (value.hasOwnProperty(k) || _property.isRequired) {
	              _property.validate(value[k], instance);
	            }
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	      }
	    }, {
	      key: 'is',
	      value: function is(value) {
	        if (this._id === null) {
	          // the initial Interface type will never match values
	          return false;
	        }
	
	        if (!AxialObject.prototype.is.call(this, value)) {
	          return false;
	        }
	
	        // check has no extra props
	        for (var key in value) {
	          if (value.hasOwnProperty(key)) {
	            if (!this._properties.has(key)) {
	              return false;
	            }
	          }
	        }
	
	        // check each prop validates
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;
	
	        try {
	          for (var _iterator2 = this._properties.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var _step2$value = _slicedToArray(_step2.value, 2),
	                k = _step2$value[0],
	                property = _step2$value[1];
	
	            if (!value.hasOwnProperty(k) && property.isRequired) {
	              // missing property
	              return false;
	            }
	            try {
	              // value must validate
	              if (value.hasOwnProperty(k) || property.isRequired) {
	                property.validate(value[k]);
	              }
	            } catch (e) {
	              return false;
	            }
	          }
	        } catch (err) {
	          _didIteratorError2 = true;
	          _iteratorError2 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	              _iterator2.return();
	            }
	          } finally {
	            if (_didIteratorError2) {
	              throw _iteratorError2;
	            }
	          }
	        }
	
	        return true;
	      }
	    }, {
	      key: 'has',
	      value: function has(key) {
	        return this._properties.has(key);
	      }
	    }, {
	      key: 'prop',
	      value: function prop(name) {
	        var path = name;
	        if (this._id && path.indexOf(this._id) !== 0) {
	          path = this._id + '.' + path;
	        }
	        return this.root._allProps.get(path);
	      }
	    }, {
	      key: 'forEach',
	      value: function forEach(fn) {
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;
	
	        try {
	          for (var _iterator3 = this._properties[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	            var _step3$value = _slicedToArray(_step3.value, 2),
	                key = _step3$value[0],
	                property = _step3$value[1];
	
	            fn(property, key);
	          }
	        } catch (err) {
	          _didIteratorError3 = true;
	          _iteratorError3 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion3 && _iterator3.return) {
	              _iterator3.return();
	            }
	          } finally {
	            if (_didIteratorError3) {
	              throw _iteratorError3;
	            }
	          }
	        }
	      }
	    }, {
	      key: 'keys',
	      value: function keys() {
	        var keys = [];
	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;
	
	        try {
	          for (var _iterator4 = this.root._allProps.keys()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	            var path = _step4.value;
	
	            keys.push(path);
	          }
	        } catch (err) {
	          _didIteratorError4 = true;
	          _iteratorError4 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion4 && _iterator4.return) {
	              _iterator4.return();
	            }
	          } finally {
	            if (_didIteratorError4) {
	              throw _iteratorError4;
	            }
	          }
	        }
	
	        return keys;
	      }
	    }, {
	      key: 'extend',
	      value: function extend(interfaceName) {
	        var prototype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	        if (typeof interfaceName !== 'string') {
	          // TODO: make proper error
	          throw new Error('Interface requires name');
	        }
	        var iface = new AxialInterface(interfaceName, prototype);
	        iface._iparent = this;
	        var obj = this;
	        while (obj) {
	          var _iteratorNormalCompletion5 = true;
	          var _didIteratorError5 = false;
	          var _iteratorError5 = undefined;
	
	          try {
	            for (var _iterator5 = obj._properties.entries()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	              var _step5$value = _slicedToArray(_step5.value, 2),
	                  key = _step5$value[0],
	                  property = _step5$value[1];
	
	              if (!iface.has(key)) {
	                iface._properties.set(key, property);
	                iface._allProps.set(interfaceName + '.' + key, property);
	              }
	            }
	          } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                _iterator5.return();
	              }
	            } finally {
	              if (_didIteratorError5) {
	                throw _iteratorError5;
	              }
	            }
	          }
	
	          obj = obj._iparent;
	        }
	        return iface;
	      }
	    }, {
	      key: 'id',
	      get: function get() {
	        return this._id;
	      },
	      set: function set(id) {
	        if (this._id) {
	          delete Axial.Interface[this._id];
	          //test-all gone?
	        }
	        this._id = id;
	        Axial.Interface[this._id] = this;
	      }
	    }, {
	      key: 'root',
	      get: function get() {
	        return this._rootInterface ? this._rootInterface : this;
	      }
	    }, {
	      key: 'isRootInterface',
	      get: function get() {
	        return this.root === this;
	      }
	    }, {
	      key: 'isSubInterface',
	      get: function get() {
	        return !this.isRootInterface;
	      }
	    }]);
	
	    return AxialInterface;
	  }(AxialObject);
	
	  var AxialReference = function (_AxialType11) {
	    _inherits(AxialReference, _AxialType11);
	
	    function AxialReference() {
	      _classCallCheck(this, AxialReference);
	
	      var _this22 = _possibleConstructorReturn(this, (AxialReference.__proto__ || Object.getPrototypeOf(AxialReference)).call(this));
	
	      _this22._defaultValue = null;
	      return _this22;
	    }
	
	    _createClass(AxialReference, [{
	      key: 'is',
	      value: function is(value) {
	        return value instanceof AxialInstance;
	      }
	    }, {
	      key: 'validate',
	      value: function validate(value, instance, property) {
	        if (value === null) {
	          return;
	        }
	        Axial.Interface.validate(value, instance, property);
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'reference';
	      }
	    }]);
	
	    return AxialReference;
	  }(AxialType);
	
	  // -------------------------------------------------------------------------------------- Instances
	
	
	  var AxialInstance = function () {
	    function AxialInstance() {
	      _classCallCheck(this, AxialInstance);
	    }
	
	    _createClass(AxialInstance, [{
	      key: 'toString',
	      value: function toString() {
	        return this[PROXY_KEY].id;
	      }
	    }]);
	
	    return AxialInstance;
	  }();
	
	  var AxialInstanceProxy = function () {
	    function AxialInstanceProxy(instance, iface, parentInstance) {
	      _classCallCheck(this, AxialInstanceProxy);
	
	      instance[Axial.PROXY_KEY] = this;
	      this._instance = instance;
	      this._state = {};
	      this._iface = iface;
	      this._listeners = {};
	      this._parentInstance = parentInstance;
	      this._isWatching = false;
	      this._super = {};
	      this._instanceId = ++_instanceId;
	
	      if (iface) {
	        // track instance
	        _instances[this.id] = instance;
	
	        // go through each AxialInterface._methods and bind copy to this instance
	        var ifaceToIndex = iface;
	        while (ifaceToIndex) {
	          var methods = {};
	          this._super[ifaceToIndex.id] = methods;
	          var _iteratorNormalCompletion6 = true;
	          var _didIteratorError6 = false;
	          var _iteratorError6 = undefined;
	
	          try {
	            for (var _iterator6 = ifaceToIndex._methods.entries()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	              var _step6$value = _slicedToArray(_step6.value, 2),
	                  key = _step6$value[0],
	                  fn = _step6$value[1];
	
	              methods[key] = fn.bind(this._instance);
	            }
	          } catch (err) {
	            _didIteratorError6 = true;
	            _iteratorError6 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                _iterator6.return();
	              }
	            } finally {
	              if (_didIteratorError6) {
	                throw _iteratorError6;
	              }
	            }
	          }
	
	          ifaceToIndex = ifaceToIndex._iparent;
	        }
	      }
	    }
	
	    _createClass(AxialInstanceProxy, [{
	      key: 'defineAccessors',
	      value: function defineAccessors(property) {
	        var key = property.key;
	        if (this._instance.hasOwnProperty(key)) {
	          // TODO: use real error
	          throw new Error('Illegal property key');
	        }
	        Object.defineProperty(this._instance, key, {
	          configurable: true,
	          // create setter for instance
	          set: function (value) {
	            // wrap property setter
	            return property.set(this._instance, value);
	          }.bind(this),
	          // create getter for instance
	          get: function () {
	            // wrap property getter
	            return property.get(this._instance);
	          }.bind(this)
	        });
	      }
	    }, {
	      key: 'equals',
	      value: function equals(instance) {
	        if (this === instance) {
	          return true;
	        }
	        if (util.isPlainObject(instance)) {
	          try {
	            instance = this._iface.create(instance);
	          } catch (e) {
	            return false;
	          }
	        }
	        if (!(instance instanceof AxialInstance)) {
	          return false;
	        }
	        var _iteratorNormalCompletion7 = true;
	        var _didIteratorError7 = false;
	        var _iteratorError7 = undefined;
	
	        try {
	          for (var _iterator7 = this._iface._properties.entries()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	            var _step7$value = _slicedToArray(_step7.value, 2),
	                key = _step7$value[0],
	                property = _step7$value[1];
	
	            var sourceValue = this._state[key];
	            var targetValue = instance[key];
	            if (sourceValue instanceof AxialInstance) {
	              if (targetValue instanceof AxialInstance) {
	                return sourceValue[PROXY_KEY].equals(targetValue);
	              } else {
	                return false;
	              }
	            } else if (sourceValue instanceof AxialInstanceArray) {
	              if (targetValue instanceof AxialInstanceArray) {
	                return sourceValue.equals(targetValue);
	              } else {
	                return false;
	              }
	            } else if (sourceValue !== targetValue) {
	              return false;
	            }
	          }
	        } catch (err) {
	          _didIteratorError7 = true;
	          _iteratorError7 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion7 && _iterator7.return) {
	              _iterator7.return();
	            }
	          } finally {
	            if (_didIteratorError7) {
	              throw _iteratorError7;
	            }
	          }
	        }
	
	        return true;
	      }
	    }, {
	      key: 'bind',
	      value: function bind(key, fn) {
	        this._listeners[key] = this._listeners[key] ? this._listeners[key] : [];
	        this._listeners[key].push(fn);
	      }
	    }, {
	      key: 'prop',
	      value: function prop(path) {
	        return this._iface.prop(path);
	      }
	    }, {
	      key: 'forEach',
	      value: function forEach(fn) {
	        var iface = this._iface;
	        var _iteratorNormalCompletion8 = true;
	        var _didIteratorError8 = false;
	        var _iteratorError8 = undefined;
	
	        try {
	          for (var _iterator8 = iface._properties.keys()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	            var key = _step8.value;
	
	            fn(key, this._state[key]);
	          }
	        } catch (err) {
	          _didIteratorError8 = true;
	          _iteratorError8 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion8 && _iterator8.return) {
	              _iterator8.return();
	            }
	          } finally {
	            if (_didIteratorError8) {
	              throw _iteratorError8;
	            }
	          }
	        }
	
	        return this;
	      }
	    }, {
	      key: 'map',
	      value: function map(fn) {
	        var array = [];
	        var iface = this._iface;
	        var _iteratorNormalCompletion9 = true;
	        var _didIteratorError9 = false;
	        var _iteratorError9 = undefined;
	
	        try {
	          for (var _iterator9 = iface._properties.keys()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	            var key = _step9.value;
	
	            array.push(fn(key, this._state[key]));
	          }
	        } catch (err) {
	          _didIteratorError9 = true;
	          _iteratorError9 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion9 && _iterator9.return) {
	              _iterator9.return();
	            }
	          } finally {
	            if (_didIteratorError9) {
	              throw _iteratorError9;
	            }
	          }
	        }
	
	        return array;
	      }
	    }, {
	      key: 'unbind',
	      value: function unbind(key, fn) {
	        if (arguments.length === 0) {
	          this._listeners = {};
	        } else if (key && !fn) {
	          this._listeners[key].length = 0;
	        } else {
	          var index = this._listeners[key].indexOf(fn);
	          this._listeners[key].splice(index, 1);
	        }
	      }
	    }, {
	      key: 'dispatch',
	      value: function dispatch(key, eventData) {
	        // dispatch globally too
	        var returnValue = Axial.dispatch(eventData);
	        if (returnValue) {
	          return returnValue;
	        }
	        var listeners = this._listeners[key];
	        if (listeners) {
	          var l = listeners.length;
	          for (var i = 0; i < l; i++) {
	            // dispatch for each event listener to interface keys
	            returnValue = listeners[i](eventData);
	            if (returnValue) {
	              return returnValue;
	            }
	          }
	        }
	      }
	    }, {
	      key: 'dispose',
	      value: function dispose() {
	        var _this23 = this;
	
	        this._iface.forEach(function (property, key) {
	          var item = _this23._state[key];
	          if (typeof item.dispose === 'function') {
	            item.dispose();
	          }
	          delete _this23._state[key];
	          delete _this23._instance[key];
	        });
	        delete this._instance[Axial.PROXY_KEY];
	        delete _instances[this.id];
	      }
	    }, {
	      key: 'value',
	      value: function value(path, shouldThrowIfNotFound) {
	        var root = this.root;
	        return util.getObjectAtPath(root, path, shouldThrowIfNotFound);
	      }
	    }, {
	      key: 'lock',
	      value: function lock() {
	        var _this24 = this;
	
	        if (this._isWatching) {
	          return;
	        }
	        this._isWatching = true;
	        var props = this._iface._properties;
	        this._watchIntervalId = setInterval(function () {
	          var instance = _this24._instance;
	          for (var key in instance) {
	            if (instance.hasOwnProperty(key) && key !== Axial.PROXY_KEY && !props.has(key)) {
	              clearInterval(_this24._watchIntervalId);
	              delete instance[key];
	              throw new AxialUnexpectedProperty(key, _this24._iface, _this24);
	            }
	          }
	        }, 30);
	        return true;
	      }
	    }, {
	      key: 'unlock',
	      value: function unlock() {
	        if (!this._isWatching) {
	          return;
	        }
	        this._isWatching = false;
	        clearInterval(this._watchIntervalId);
	        return true;
	      }
	    }, {
	      key: 'get',
	      value: function get(key, defaultValue) {
	        var value = this.instance[key];
	        return this._state.hasOwnProperty(key) ? value : defaultValue;
	      }
	    }, {
	      key: 'set',
	      value: function set(key, value) {
	        this.instance[key] = value;
	      }
	    }, {
	      key: 'toPlainObject',
	      value: function toPlainObject() {
	        var json = {};
	        var _iteratorNormalCompletion10 = true;
	        var _didIteratorError10 = false;
	        var _iteratorError10 = undefined;
	
	        try {
	          for (var _iterator10 = this._iface._properties.keys()[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
	            var key = _step10.value;
	
	            var value = this._state[key];
	            var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	            if (value instanceof AxialInstance) {
	              json[key] = value[Axial.PROXY_KEY].toPlainObject();
	            } else if (value instanceof AxialInstanceArray) {
	              json[key] = value.toPlainObject();
	            } else if (type === 'string' || type === 'number' || type === 'boolean' || util.isPlainObject(value)) {
	              json[key] = value;
	            }
	          }
	        } catch (err) {
	          _didIteratorError10 = true;
	          _iteratorError10 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion10 && _iterator10.return) {
	              _iterator10.return();
	            }
	          } finally {
	            if (_didIteratorError10) {
	              throw _iteratorError10;
	            }
	          }
	        }
	
	        return json;
	      }
	    }, {
	      key: 'stringify',
	      value: function stringify(prettyPrint) {
	        return JSON.stringify.call(null, this.toPlainObject(), null, prettyPrint === true ? 4 : undefined);
	      }
	    }, {
	      key: 'toString',
	      value: function toString() {
	        return this._iface.id + '#' + this._instanceId;
	      }
	    }, {
	      key: 'root',
	      get: function get() {
	        var obj = this._parentInstance;
	        var root = this;
	        while (obj) {
	          root = obj;
	          obj = obj._parentInstance;
	        }
	        return root;
	      }
	    }, {
	      key: 'super',
	      get: function get() {
	        return this._super;
	      }
	    }, {
	      key: 'isLocked',
	      get: function get() {
	        return this._isWatching;
	      }
	    }, {
	      key: 'instance',
	      get: function get() {
	        return this._instance;
	      }
	    }, {
	      key: 'instanceId',
	      get: function get() {
	        return this._instanceId;
	      }
	    }, {
	      key: 'iface',
	      get: function get() {
	        return this._iface;
	      }
	    }, {
	      key: 'id',
	      get: function get() {
	        return 'axial!' + this._iface.id + '#' + this._instanceId;
	      }
	    }]);
	
	    return AxialInstanceProxy;
	  }();
	
	  var AxialInterfaceProperty = function () {
	    function AxialInterfaceProperty(iface, key, types, path) {
	      _classCallCheck(this, AxialInterfaceProperty);
	
	      this._iface = iface;
	      this._key = key;
	      this._types = types;
	      this._path = path;
	      iface.root._allProps.set(path, this);
	    }
	
	    _createClass(AxialInterfaceProperty, [{
	      key: 'is',
	      value: function is(type) {
	        var t = this._types;
	        var l = t.length;
	        for (var i = 0; i < l; i++) {
	          var pType = t[i];
	          if (pType instanceof type.constructor) {
	            if (pType instanceof AxialArray) {
	              if (type._type && pType._type !== type._type) {
	                return false;
	              }
	            }
	            return true;
	          }
	        }
	        return false;
	      }
	    }, {
	      key: 'validate',
	      value: function validate(value, instance) {
	        var t = this._types;
	        var l = t.length;
	        var hasValidated = false;
	        var errors = [];
	        if (value instanceof AxialInstanceArray) {
	          value = value._array;
	        }
	        for (var i = 0; i < l; i++) {
	          var type = t[i];
	          try {
	            type.validate(value, instance, this);
	            hasValidated = true;
	          } catch (e) {
	            e.key = this.key;
	            errors.push({ type: type, error: e });
	          }
	        }
	        if (!hasValidated) {
	          throw errors[0].error;
	        }
	      }
	
	      /**
	       * setter
	       * @param instance
	       * @param value
	       */
	
	    }, {
	      key: 'set',
	      value: function set(instance, value) {
	        var _this25 = this;
	
	        var oldValue = instance[Axial.PROXY_KEY]._state[this._key];
	        var rawValue = value;
	
	        this.validate(value, instance);
	
	        // convert to AxialInstance if Interface and object given
	        if (this.is(Axial.Interface) && util.isPlainObject(value)) {
	          var iface = this.primaryInterface;
	          value = iface.create(value, instance);
	        }
	
	        // convert to AxialInstanceArray if array
	        if (this.is(Axial.Array()) && Array.isArray(value)) {
	          value = new AxialInstanceArray(instance, this, value);
	        }
	
	        // convert to bound function (if function)
	        if (this.is(Axial.Function) && typeof value === 'function' && !value._isAxialBound) {
	          (function () {
	            var fn = value;
	            value = function () {
	              // dispatch call, execute function
	              instance[Axial.PROXY_KEY].dispatch(this._key, {
	                instance: instance,
	                property: this,
	                method: 'call',
	                key: this._key,
	                value: arguments,
	                arguments: arguments,
	                newValue: fn,
	                oldValue: fn
	              });
	
	              return fn.apply(instance, arguments);
	            }.bind(_this25);
	            value._isAxialBound = true;
	          })();
	        }
	
	        // set state
	        instance[Axial.PROXY_KEY]._state[this._key] = value;
	
	        // dispatch event
	        var returnValue = instance[Axial.PROXY_KEY].dispatch(this._key, {
	          instance: instance,
	          property: this,
	          method: 'set',
	          key: this._key,
	          value: rawValue,
	          newValue: value,
	          oldValue: oldValue
	        });
	
	        if (returnValue) {
	          // re-set state from intercepted listener return value
	          instance[this._key] = returnValue;
	        }
	      }
	
	      /**
	       * getter
	       * @param instance
	       * @returns {*}
	       */
	
	    }, {
	      key: 'get',
	      value: function get(instance) {
	        var value = instance[Axial.PROXY_KEY]._state[this._key];
	
	        // dispatch event
	        instance[Axial.PROXY_KEY].dispatch(this._key, {
	          instance: instance,
	          property: this,
	          method: 'get',
	          key: this._key,
	          value: value
	        });
	
	        return value;
	      }
	    }, {
	      key: 'getType',
	      value: function getType(type) {
	        for (var i = 0; i < this._types.length; i++) {
	          if (this._types[i].constructor === type.constructor) {
	            return this._types[i];
	          }
	        }
	        // TODO: proper error
	        throw new Error('Type not found');
	      }
	    }, {
	      key: 'toString',
	      value: function toString() {
	        return this._iface.id + '#' + this._instanceId;
	      }
	    }, {
	      key: 'path',
	      get: function get() {
	        return this._path;
	      }
	    }, {
	      key: 'iface',
	      get: function get() {
	        return this._iface;
	      }
	    }, {
	      key: 'key',
	      get: function get() {
	        return this._key;
	      }
	    }, {
	      key: 'types',
	      get: function get() {
	        return this._types;
	      }
	    }, {
	      key: 'defaultValue',
	      get: function get() {
	        return this.primaryType._defaultValue;
	      }
	    }, {
	      key: 'isSingleType',
	      get: function get() {
	        return this._types.length === 1;
	      }
	    }, {
	      key: 'isInterface',
	      get: function get() {
	        return this.is(Axial.Interface);
	      }
	    }, {
	      key: 'primaryType',
	      get: function get() {
	        return this._types[0];
	      }
	    }, {
	      key: 'deepPrimaryArrayType',
	      get: function get() {
	        var type = this._types[0];
	        if (!(type instanceof AxialArray)) {
	          return null;
	        }
	        while (type instanceof AxialArray && type._type && !(type instanceof AxialInstanceArray)) {
	          type = type._type;
	        }
	        return type;
	      }
	    }, {
	      key: 'primaryInterface',
	      get: function get() {
	        return this._types.find(function (type) {
	          return type instanceof AxialInterface;
	        });
	      }
	    }, {
	      key: 'primaryArrayType',
	      get: function get() {
	        var array = this._types.find(function (type) {
	          return type instanceof AxialArray;
	        });
	        return array ? array.type : null;
	      }
	    }, {
	      key: 'isRequired',
	      get: function get() {
	        for (var i = 0; i < this._types.length; i++) {
	          if (this._types[i]._required) {
	            return true;
	          }
	        }
	        return false;
	      }
	    }]);
	
	    return AxialInterfaceProperty;
	  }();
	
	  var AxialBinding = function () {
	    function AxialBinding(instance, key, handler) {
	      _classCallCheck(this, AxialBinding);
	
	      this._instance = instance;
	      this._key = key;
	      this._property = instance[Axial.PROXY_KEY].prop(this._key);
	      this._handler = handler;
	      this._active = false;
	    }
	
	    _createClass(AxialBinding, [{
	      key: 'bind',
	      value: function bind() {
	        this._instance[Axial.PROXY_KEY].bind(this._key, this._handler);
	        this._active = true;
	        _bindings.push(this);
	      }
	    }, {
	      key: 'unbind',
	      value: function unbind() {
	        this._instance[Axial.PROXY_KEY].unbind(this._key, this._handler);
	        this._active = false;
	        var i = _bindings.indexOf(this);
	        _bindings.splice(i, 1);
	      }
	    }, {
	      key: 'dispose',
	      value: function dispose() {
	        if (this._active) {
	          this.unbind();
	        }
	        delete this._instance;
	        delete this._handler;
	      }
	    }, {
	      key: 'get',
	      value: function get() {
	        return this._instance[Axial.PROXY_KEY]._state[this._key];
	      }
	    }, {
	      key: 'toString',
	      value: function toString() {
	        return this._instance[PROXY_KEY].toString() + ':' + this._key;
	      }
	    }, {
	      key: 'instance',
	      get: function get() {
	        return this._instance;
	      }
	    }, {
	      key: 'key',
	      get: function get() {
	        return this._key;
	      }
	    }, {
	      key: 'property',
	      get: function get() {
	        return this._property;
	      }
	    }, {
	      key: 'handler',
	      get: function get() {
	        return this._handler;
	      }
	    }, {
	      key: 'isActive',
	      get: function get() {
	        return this._active;
	      }
	    }]);
	
	    return AxialBinding;
	  }();
	
	  var AxialInstanceArray = function () {
	    function AxialInstanceArray(instance, property) {
	      var _this26 = this;
	
	      var array = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	
	      _classCallCheck(this, AxialInstanceArray);
	
	      this._instance = instance;
	      this._instanceId = ++_instanceArrayId;
	      this._property = property;
	      this._key = property.key;
	      this._indexLength = null;
	      var self = this;
	
	      // expand items to instances if interface type
	      this._array = array;
	      if (array.length) {
	        this._array = this.convertArray(array);
	        this.length = this._array.length;
	      }
	
	      _arrayMembers.forEach(function (member) {
	        // stub each member of Array.prototype
	        // validate arguments if mutator...
	        Object.defineProperty(_this26, member, {
	          enumerable: false,
	          value: function value() {
	            var args = Array.prototype.slice.call(arguments);
	            var isMutator = _arrayMutators.indexOf(member) > -1;
	            var hasValidated = true;
	
	            if (member === 'push') {
	              property.validate(args, self._instance);
	              args = this.convertArray(args);
	            } else if (member === 'splice') {
	              if (args.length > 2) {
	                // inserting
	                property.validate(args.slice(2), self._instance);
	              }
	              args = this.convertArray(args);
	            } else if (member === 'unshift') {
	              property.validate(args, self._instance);
	              args = this.convertArray(args);
	            } else if (member === 'fill') {
	              property.primaryType.isItem(args);
	              args = [args[0]];
	              args = this.convertArray(args);
	            } else {
	              hasValidated = true;
	            }
	
	            var returnValue = Array.prototype[member].apply(this._array, args);
	            this.length = this._array.length;
	
	            // ...otherwise validate array (is valid type?) afterwards
	            if (!hasValidated) {
	              property.validate(this._array, self._instance);
	            }
	
	            // if this is an array mutator method, dispatch event
	            if (isMutator) {
	              self.bindIndexes();
	              instance[Axial.PROXY_KEY].dispatch(this._key, {
	                instance: instance,
	                property: this._property,
	                method: 'set',
	                arrayMethod: member,
	                key: this._key,
	                value: this,
	                newValue: this,
	                oldValue: null
	              });
	            }
	
	            return returnValue;
	          }
	        });
	      });
	
	      this.bindIndexes();
	    }
	
	    _createClass(AxialInstanceArray, [{
	      key: 'convertArray',
	      value: function convertArray(rawArray) {
	        // convert plain array to array of wrapped objects ~ AxialInstance or AxialInstanceArray or value
	        var array = [];
	        var l = rawArray.length;
	        for (var i = 0; i < l; i++) {
	          var item = rawArray[i];
	          if (item instanceof AxialInstance || item instanceof AxialInstanceArray) {
	            array[i] = item;
	            continue;
	          }
	          var deepPrimaryArrayType = this.property.deepPrimaryArrayType;
	          if (deepPrimaryArrayType && deepPrimaryArrayType instanceof AxialInterface && deepPrimaryArrayType.is(item)) {
	            // find primary type form array
	            array[i] = deepPrimaryArrayType.create(item, this._instance);
	            continue;
	          }
	          var type = Axial.typeOf(item);
	          if (type instanceof AxialInterface) {
	            // create instance of interface with item as default values
	            array[i] = type.create(item, this._instance);
	            continue;
	          } else if (type instanceof AxialArray) {
	            array[i] = new AxialInstanceArray(this._instance, this._property, item);
	            continue;
	          }
	          // plain value
	          array[i] = item;
	        }
	        return array;
	      }
	    }, {
	      key: 'equals',
	      value: function equals(array) {
	        if (this === array) {
	          return true;
	        }
	        var targetArray = array instanceof AxialInstanceArray ? array._array : array;
	        if (array.length !== this.length || !Array.isArray(targetArray)) {
	          return false;
	        }
	        // iterate through and check equal items
	        var l = targetArray.length;
	        var sourceArray = this._array;
	        for (var i = 0; i < l; i++) {
	          var sourceItem = sourceArray[i];
	          var targetItem = targetArray[i];
	          if (sourceItem instanceof AxialInstance) {
	            if (targetItem instanceof AxialInstance) {
	              return sourceItem[PROXY_KEY].equals(targetItem);
	            } else {
	              return false;
	            }
	          } else if (sourceItem instanceof AxialInstanceArray) {
	            if (targetItem instanceof AxialInstanceArray) {
	              return sourceItem[PROXY_KEY].equals(targetItem);
	            } else {
	              return false;
	            }
	          } else if (sourceItem !== targetItem) {
	            return false;
	          }
	        }
	        return true;
	      }
	    }, {
	      key: 'bindIndexes',
	      value: function bindIndexes() {
	        var _this27 = this;
	
	        var array = this._array;
	        var instance = this._instance;
	        var property = this._property;
	        // delete previous indexes
	        if (this._indexLength) {
	          var _l = this._indexLength;
	          for (var i = 0; i < _l; i++) {
	            delete this[i];
	          }
	        }
	        // write each index as an accessor
	        var l = array.length + 1;
	
	        var _loop = function _loop(_i) {
	          _this27._indexLength++;
	          var key = '' + _i;
	          if (!_this27.hasOwnProperty(key)) {
	            Object.defineProperty(_this27, key, {
	              get: function get() {
	                // dispatch event
	                instance[Axial.PROXY_KEY].dispatch(property.key, {
	                  instance: instance,
	                  property: property,
	                  arrayMethod: 'index',
	                  method: 'get',
	                  index: _i,
	                  key: property.key,
	                  value: array[_i]
	                });
	                return array[_i];
	              },
	              set: function set(value) {
	                var _this28 = this;
	
	                var oldValue = array[_i];
	                var rawValue = value;
	
	                property.validate([value], instance);
	
	                // convert to AxialInstance if Interface and object given
	                var arrayType = property.primaryArrayType;
	                if (arrayType && util.isPlainObject(value) && arrayType.is(value)) {
	                  value = arrayType.create(value, instance);
	                }
	
	                // convert to AxialInstanceArray if array
	                if (property.is(Axial.Array()) && Array.isArray(value)) {
	                  value = new AxialInstanceArray(instance, property, value);
	                }
	
	                // convert to bound function (if function)
	                if (property.is(Axial.Function) && typeof value === 'function' && !value._isAxialBound) {
	                  (function () {
	                    var fn = value;
	                    value = function () {
	                      // dispatch call, execute function
	                      instance[Axial.PROXY_KEY].dispatch(property._key, {
	                        instance: instance,
	                        property: property,
	                        method: 'call',
	                        key: property._key,
	                        value: arguments,
	                        arguments: arguments,
	                        newValue: fn,
	                        oldValue: fn
	                      });
	
	                      return fn.apply(instance, arguments);
	                    }.bind(_this28);
	                    value._isAxialBound = true;
	                  })();
	                }
	
	                array[_i] = value;
	
	                instance[Axial.PROXY_KEY].dispatch(property.key, {
	                  instance: instance,
	                  property: property,
	                  arrayMethod: 'index',
	                  method: 'set',
	                  index: _i,
	                  key: property.key,
	                  value: value,
	                  oldValue: oldValue,
	                  newValue: rawValue
	                });
	              },
	              enumerable: true,
	              configurable: true
	            });
	          }
	        };
	
	        for (var _i = 0; _i < l; _i++) {
	          _loop(_i);
	        }
	      }
	    }, {
	      key: 'add',
	      value: function add() /*items, ...*/{
	        var items = util.argsToItems.apply(null, arguments);
	        this.push.apply(this, items);
	      }
	    }, {
	      key: 'remove',
	      value: function remove() /*items, ...*/{
	        var array = this._array;
	        var items = util.argsToItems.apply(null, arguments);
	        var l = items.length;
	        for (var i = 0; i < l; i++) {
	          var item = items[i];
	          var index = array.indexOf(item);
	          this.splice(index, 1);
	        }
	        this.length = this._array.length;
	      }
	    }, {
	      key: 'contains',
	      value: function contains() /*items, ...*/{
	        var items = util.argsToItems.apply(null, arguments);
	        var l = items.length;
	        var array = this._array;
	        for (var i = 0; i < l; i++) {
	          if (array.indexOf(items[i]) > -1) {
	            return true;
	          }
	        }
	        return false;
	      }
	    }, {
	      key: 'toPlainObject',
	      value: function toPlainObject() {
	        var array = [];
	        var l = this._array.length;
	        for (var i = 0; i < l; i++) {
	          var item = this._array[i];
	          if (item instanceof AxialInstance) {
	            array[i] = _proxy(item).toPlainObject();
	          } else if (item instanceof AxialInstanceArray) {
	            array[i] = item.toPlainObject();
	          } else {
	            array[i] = item;
	          }
	        }
	        return array;
	      }
	    }, {
	      key: 'stringify',
	      value: function stringify(prettyPrint) {
	        return JSON.stringify.call(null, this.toPlainObject(), null, prettyPrint === true ? 4 : undefined);
	      }
	    }, {
	      key: 'isEmpty',
	      get: function get() {
	        return this.length === 0;
	      }
	    }, {
	      key: 'instance',
	      get: function get() {
	        return this._instance;
	      }
	    }, {
	      key: 'instanceId',
	      get: function get() {
	        return this._instanceId;
	      }
	    }, {
	      key: 'property',
	      get: function get() {
	        return this._property;
	      }
	    }, {
	      key: 'key',
	      get: function get() {
	        return this._key;
	      }
	    }, {
	      key: 'array',
	      get: function get() {
	        return this._array;
	      }
	    }]);
	
	    return AxialInstanceArray;
	  }();
	
	  // -------------------------------------------------------------------------------------- Util
	
	
	  util = {
	    isPlainObject: function isPlainObject(o) {
	      var t = o;
	      return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) !== 'object' || o === null ? false : function () {
	        while (true) {
	          if (Object.getPrototypeOf(t = Object.getPrototypeOf(t)) === null) {
	            break;
	          }
	        }
	        return Object.getPrototypeOf(o) === t;
	      }();
	    },
	    merge: function merge(source, target) {
	      var _this29 = this;
	
	      var copy = function copy(_source, _target) {
	        for (var _key in _target) {
	          if (_target.hasOwnProperty(_key)) {
	            var sourceValue = _source[_key];
	            var targetValue = _target[_key];
	            if (_this29.isPlainObject(targetValue)) {
	              if (_this29.isPlainObject(sourceValue)) {
	                copy(sourceValue, targetValue);
	              } else {
	                var obj = {};
	                _source[_key] = obj;
	                copy(obj, targetValue);
	              }
	            } else {
	              _source[_key] = targetValue;
	            }
	          }
	        }
	        return source;
	      };
	      return copy(source, target);
	    },
	    typeOf: function typeOf(value) {
	      if (value instanceof AxialInstance) {
	        return value[PROXY_KEY]._iface;
	      }
	      if (T.Null.is(value)) {
	        return T.Null;
	      } else if (T.Undefined.is(value)) {
	        return T.Undefined;
	      } else if (T.String.is(value)) {
	        return T.String;
	      } else if (T.Number.is(value)) {
	        return T.Number;
	      } else if (T.Boolean.is(value)) {
	        return T.Boolean;
	      } else if (T.Date.is(value)) {
	        return T.Date;
	      } else if (T.Regex.is(value)) {
	        return T.Regex;
	      } else if (T.Function.is(value)) {
	        return T.Function;
	      } else if (T.Array.is(value)) {
	        if (value.length) {
	          return T.Array(this.typeOf(value[0]));
	        } else {
	          return T.Array();
	        }
	      } else if (T.Object.is(value)) {
	        return T.Object;
	      } else if (T.Interface.is(value)) {
	        return T.Interface;
	      }
	      throw new AxialUnsupportedType(value);
	    },
	    isType: function isType(type) {
	      type = Array.isArray(type) ? type : [type];
	      var l = type.length;
	      for (var i = 0; i < l; i++) {
	        if (!(type[i] instanceof AxialType)) {
	          return false;
	        }
	      }
	      return true;
	    },
	    getObjectPaths: function getObjectPaths(obj, includeBranchPaths) {
	      var _this30 = this;
	
	      var keys = [];
	      var ref = null;
	      var path = null;
	      var walk = function walk(o, p) {
	        for (var k in o) {
	          if (o.hasOwnProperty(k)) {
	            ref = o[k];
	            path = p ? p + '.' + k : k;
	            if (_this30.isPlainObject(ref)) {
	              if (includeBranchPaths === true) {
	                keys.push(path);
	              }
	              walk(ref, path);
	            } else {
	              keys.push(path);
	            }
	          }
	        }
	      };
	      walk(obj);
	      return keys;
	    },
	    getObjectPathValues: function getObjectPathValues(obj, includeBranchPaths) {
	      var _this31 = this;
	
	      var keyValues = [];
	      var ref = null;
	      var path = null;
	      var walk = function walk(o, p) {
	        for (var k in o) {
	          if (o.hasOwnProperty(k)) {
	            ref = o[k];
	            path = p ? p + '.' + k : k;
	            if (_this31.isPlainObject(ref)) {
	              if (includeBranchPaths === true) {
	                keyValues.push({ path: path, value: ref, isBranch: true });
	              }
	              walk(ref, path);
	            } else {
	              keyValues.push({ path: path, value: ref, isBranch: false });
	            }
	          }
	        }
	      };
	      walk(obj);
	      return keyValues;
	    },
	    getObjectAtPath: function getObjectAtPath(obj, path, shouldThrowIfNotFound) {
	      var steps = path.split('.');
	      var l = steps.length;
	      var ref = obj;
	      var k = null;
	      for (var i = 0; i < l; i++) {
	        k = steps[i];
	        ref = ref[k];
	        if (ref === null || typeof ref === 'undefined') {
	          if (shouldThrowIfNotFound === true) {
	            throw new AxialUndefinedValue(obj, path);
	          }
	          return ref;
	        }
	      }
	      return ref;
	    },
	    setObjectAtPath: function setObjectAtPath(obj, path, value) {
	      var ref = obj;
	      var steps = path.split('.');
	      var l = steps.length - 1;
	      var k = null;
	      for (var i = 0; i < l; i++) {
	        k = steps[i];
	        if (!ref.hasOwnProperty(k)) {
	          ref[k] = {};
	        }
	        ref = ref[k];
	      }
	      ref[steps[l]] = value;
	    },
	    multiSetObjectAtPath: function multiSetObjectAtPath(obj, pathOrObject, value) {
	      var modifiedPaths = null;
	      if (this.isPlainObject(pathOrObject)) {
	        this.merge(obj, pathOrObject);
	        modifiedPaths = this.getObjectPaths(pathOrObject);
	      } else if (typeof pathOrObject === 'string') {
	        this.setObjectAtPath(obj, pathOrObject, value);
	        modifiedPaths = [pathOrObject];
	      }
	      return modifiedPaths;
	    },
	    expandDotSyntaxKeys: function expandDotSyntaxKeys(obj, resolver) {
	      for (var path in obj) {
	        if (obj.hasOwnProperty(path)) {
	          if (path.indexOf('.') > -1) {
	            var _key2 = path.split('.')[0];
	            resolver(path, _key2, obj[path]);
	            delete obj[path];
	          }
	        }
	      }
	      return obj;
	    },
	    expandArray: function expandArray(inArray) {
	      var outArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	
	      var l = inArray.length;
	      for (var i = 0; i < l; i++) {
	        var item = inArray[i];
	        if (Array.isArray(item)) {
	          this.expandArray(item, outArray);
	        } else {
	          outArray[outArray.length] = item;
	        }
	      }
	      return outArray;
	    },
	    stringify: function stringify(value) {
	      var _this32 = this;
	
	      if (typeof value === 'function') {
	        return 'function () {...}';
	      }
	      if (Array.isArray(value)) {
	        return '[#' + value.length + ']';
	      }
	      if (value instanceof AxialInstance) {
	        var props = _proxy(value).map(function (k, v) {
	          return k + ':' + _this32.stringify(v);
	        });
	        return '*' + value[PROXY_KEY].iface.id + '#' + value[PROXY_KEY].instanceId + '{' + props.join(', ') + '}';
	      }
	      if (value instanceof AxialInstanceArray) {
	        return '*array#' + value.instanceId + '[' + value.length + ']';
	      }
	      try {
	        return JSON.stringify(value);
	      } catch (e) {
	        return '' + value;
	      }
	    },
	    argsToItems: function argsToItems() {
	      var array = [];
	      var l = arguments.length;
	      if (l === 1 && Array.isArray(arguments[0])) {
	        array.push.apply(array, arguments);
	      } else if (l > 0) {
	        for (var i = 0; i < l; i++) {
	          var item = arguments[i];
	          array.push(item);
	        }
	      }
	      return array;
	    }
	  };
	
	  // -------------------------------------------------------------------------------------- Define Types
	  T = {
	    Null: new AxialNull(),
	    Undefined: new AxialUndefined(),
	    String: new AxialString(),
	    Number: new AxialNumber(),
	    Boolean: new AxialBoolean(),
	    Date: new AxialDate(),
	    Regex: new AxialRegex(),
	    Function: new AxialFunction(),
	    Array: function Array(type) {
	      var typeId = type ? type.id : '*';
	      var t = _arrayTypes[typeId];
	      if (t) {
	        return t;
	      } else {
	        t = _arrayTypes[typeId] = new AxialArray(type);
	        t._baseType = this.Array();
	        t._id = 'array[' + typeId + ']';
	      }
	      return t;
	    },
	    Object: new AxialObject(),
	    Interface: new AxialInterface(null),
	    Reference: new AxialReference()
	  };
	
	  Object.keys(T).forEach(function (typeName) {
	    T[typeName].orUndefined = function () {
	      return [T[typeName], Axial.Undefined];
	    };
	    T[typeName].orNull = function () {
	      return [T[typeName], Axial.Null];
	    };
	    T[typeName].orUndefinedOrNull = function () {
	      return [T[typeName], Axial.Undefined, Axial.Null];
	    };
	  });
	
	  T.Array.is = function (value) {
	    return Array.isArray(value);
	  };
	  T.Array.Type = T.Array();
	
	  // -------------------------------------------------------------------------------------- Axial
	  var Axial = {
	    define: function define(id, prototype) {
	      return new AxialInterface(id, prototype);
	    },
	    getInterface: function getInterface() {
	      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'null';
	
	      // return first one defined (allows easy mocking/testing)
	      var ifaceArray = _interfaces[id];
	      if (ifaceArray) {
	        return ifaceArray[ifaceArray.length - 1];
	      }
	    },
	    interfaceIds: function interfaceIds() {
	      return Object.keys(_interfaces).filter(function (id) {
	        var ifaceArray = _interfaces[id];
	        return ifaceArray[0].isRootInterface;
	      });
	    },
	    interfaces: function interfaces() {
	      var o = {};
	      this.interfaceIds().forEach(function (id) {
	        return o[id] = _interfaces[id];
	      });
	      return o;
	    },
	
	    get instances() {
	      return _instances;
	    },
	    get bindings() {
	      return _bindings;
	    },
	    get bindingInfo() {
	      return this.bindings.map(function (binding) {
	        return binding.instance._instanceId + ':' + binding.key;
	      });
	    },
	    getInstance: function getInstance(id) {
	      if (id.indexOf('axial!') === -1) {
	        id = 'axial!' + id;
	      }
	      return _instances[id];
	    },
	    bind: function bind(fn) {
	      _listeners.push(fn);
	    },
	    unbind: function unbind(fn) {
	      if (fn) {
	        var index = _listeners.indexOf(fn);
	        _listeners.splice(index, 1);
	      } else {
	        _listeners.length = 0;
	      }
	    },
	    dispatch: function dispatch(eventData) {
	      if (_logListenerCount) {
	        // logging is a separate listener collection,
	        // in case Axial.unbind() is called logging can continue.
	        this.log(eventData);
	      }
	      var l = _listeners.length;
	      for (var i = 0; i < l; i++) {
	        var returnValue = _listeners[i](eventData);
	        if (returnValue) {
	          return returnValue;
	        }
	      }
	    },
	
	    Binding: AxialBinding,
	    PROXY_KEY: PROXY_KEY,
	    CONST: CONST,
	    Instance: new AxialInstance(),
	    InstanceArray: AxialInstanceArray,
	    util: util,
	    addLogListener: function addLogListener(method, fn) {
	      _logListeners[method] = _logListeners[method] || [];
	      _logListeners[method].push(fn);
	      _logListenerCount++;
	      return this;
	    },
	    removeLogListener: function removeLogListener(method, fn) {
	      if (typeof fn === 'undefined') {
	        _logListeners[method] = [];
	        return;
	      }
	      var index = _logListeners[method].indexOf(fn);
	      _logListeners[method].splice(index, 1);
	      _logListenerCount--;
	      return this;
	    },
	    log: function log(e) {
	      if (_logListeners.hasOwnProperty(e.method)) {
	        var array = _logListeners[e.method];
	        var l = array.length;
	        for (var i = 0; i < l; i++) {
	          array[i](e);
	        }
	      }
	    },
	    addDefaultLogListeners: function addDefaultLogListeners() {
	      this.addLogListener('get', function (e) {
	        console.log('%cGET: ' + e.property.path + (e.hasOwnProperty('index') ? '[' + e.index + ']' : '') + ':<' + e.property.types.join('|') + '> = ' + util.stringify(e.value), 'color:#999');
	      }).addLogListener('set', function (e) {
	        console.log('%cSET: ' + e.property.path + ':<' + e.property.types.join('|') + '> = ' + util.stringify(e.value), 'color:orange');
	      }).addLogListener('call', function (e) {
	        var args = [];
	        var l = e.arguments.length;
	        for (var i = 0; i < l; i++) {
	          var arg = void 0;
	          try {
	            arg = JSON.stringify(e.arguments[i]);
	          } catch (e) {
	            arg = util.typeOf(e.arguments[i]).id;
	          }
	          args.push(arg + ':' + _typeof(e.arguments[i]));
	        }
	        console.log('%cCALL: ' + e.property.path + ('(' + (args.length ? '<' : '')) + args.join('>, <') + ((args.length ? '>' : '') + ')'), 'color:pink');
	      });
	    },
	    typeOf: function typeOf(value) {
	      var type = util.typeOf(value);
	      if (type.constructor === AxialObject) {
	        var ifaceNames = this.interfaceIds();
	        var l = ifaceNames.length;
	        for (var i = 0; i < l; i++) {
	          var id = ifaceNames[i];
	          var iface = this.getInterface(id);
	          // gets latest version with same id
	          if (iface.is(value)) {
	            return iface;
	          }
	        }
	      }
	      return type;
	    },
	
	    proxy: _proxy
	  };
	
	  // merge in types and errors
	  util.merge(Axial, T);
	  util.merge(Axial, Errors);
	
	  // extend misc types public interface
	  AxialInterface.prototype.new = AxialInterface.prototype.create;
	  AxialType.prototype.set = AxialType.prototype.defaultValue;
	
	  if (typeof window !== 'undefined') {
	    window.Axial = Axial;
	  }
	
	  return Axial;
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  BLANK_INTERFACE_NAME: 'untitled_',
	  PROXY_KEY: '$',
	  ARRAY_MEMBERS: ['concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'forEach', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf', 'map', 'pop', 'push', 'reduce', 'reduceRight', 'reverse', 'shift', 'slice', 'some', 'sort', 'splice', 'toLocaleString', 'toSource', 'toString', 'unshift', 'values'],
	  ARRAY_MUTATORS: ['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'],
	  ARRAY_MUTATORS_REQUIRE_ARGS_VALIDATED: ['fill', 'push', 'splice', 'unshift']
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _Expectation = __webpack_require__(4);
	
	var _Expectation2 = _interopRequireDefault(_Expectation);
	
	var _SpyUtils = __webpack_require__(16);
	
	var _assert = __webpack_require__(14);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _extend = __webpack_require__(34);
	
	var _extend2 = _interopRequireDefault(_extend);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function expect(actual) {
	  return new _Expectation2.default(actual);
	}
	
	expect.createSpy = _SpyUtils.createSpy;
	expect.spyOn = _SpyUtils.spyOn;
	expect.isSpy = _SpyUtils.isSpy;
	expect.restoreSpies = _SpyUtils.restoreSpies;
	expect.assert = _assert2.default;
	expect.extend = _extend2.default;
	
	module.exports = expect;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _has = __webpack_require__(5);
	
	var _has2 = _interopRequireDefault(_has);
	
	var _tmatch = __webpack_require__(8);
	
	var _tmatch2 = _interopRequireDefault(_tmatch);
	
	var _assert = __webpack_require__(14);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _SpyUtils = __webpack_require__(16);
	
	var _TestUtils = __webpack_require__(21);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/**
	 * An Expectation is a wrapper around an assertion that allows it to be written
	 * in a more natural style, without the need to remember the order of arguments.
	 * This helps prevent you from making mistakes when writing tests.
	 */
	
	var Expectation = function () {
	  function Expectation(actual) {
	    _classCallCheck(this, Expectation);
	
	    this.actual = actual;
	
	    if ((0, _TestUtils.isFunction)(actual)) {
	      this.context = null;
	      this.args = [];
	    }
	  }
	
	  _createClass(Expectation, [{
	    key: 'toExist',
	    value: function toExist(message) {
	      (0, _assert2.default)(this.actual, message || 'Expected %s to exist', this.actual);
	
	      return this;
	    }
	  }, {
	    key: 'toNotExist',
	    value: function toNotExist(message) {
	      (0, _assert2.default)(!this.actual, message || 'Expected %s to not exist', this.actual);
	
	      return this;
	    }
	  }, {
	    key: 'toBe',
	    value: function toBe(value, message) {
	      (0, _assert2.default)(this.actual === value, message || 'Expected %s to be %s', this.actual, value);
	
	      return this;
	    }
	  }, {
	    key: 'toNotBe',
	    value: function toNotBe(value, message) {
	      (0, _assert2.default)(this.actual !== value, message || 'Expected %s to not be %s', this.actual, value);
	
	      return this;
	    }
	  }, {
	    key: 'toEqual',
	    value: function toEqual(value, message) {
	      try {
	        (0, _assert2.default)((0, _TestUtils.isEqual)(this.actual, value), message || 'Expected %s to equal %s', this.actual, value);
	      } catch (error) {
	        // These attributes are consumed by Mocha to produce a diff output.
	        error.actual = this.actual;
	        error.expected = value;
	        error.showDiff = true;
	        throw error;
	      }
	
	      return this;
	    }
	  }, {
	    key: 'toNotEqual',
	    value: function toNotEqual(value, message) {
	      (0, _assert2.default)(!(0, _TestUtils.isEqual)(this.actual, value), message || 'Expected %s to not equal %s', this.actual, value);
	
	      return this;
	    }
	  }, {
	    key: 'toThrow',
	    value: function toThrow(value, message) {
	      (0, _assert2.default)((0, _TestUtils.isFunction)(this.actual), 'The "actual" argument in expect(actual).toThrow() must be a function, %s was given', this.actual);
	
	      (0, _assert2.default)((0, _TestUtils.functionThrows)(this.actual, this.context, this.args, value), message || 'Expected %s to throw %s', this.actual, value || 'an error');
	
	      return this;
	    }
	  }, {
	    key: 'toNotThrow',
	    value: function toNotThrow(value, message) {
	      (0, _assert2.default)((0, _TestUtils.isFunction)(this.actual), 'The "actual" argument in expect(actual).toNotThrow() must be a function, %s was given', this.actual);
	
	      (0, _assert2.default)(!(0, _TestUtils.functionThrows)(this.actual, this.context, this.args, value), message || 'Expected %s to not throw %s', this.actual, value || 'an error');
	
	      return this;
	    }
	  }, {
	    key: 'toBeA',
	    value: function toBeA(value, message) {
	      (0, _assert2.default)((0, _TestUtils.isFunction)(value) || typeof value === 'string', 'The "value" argument in toBeA(value) must be a function or a string');
	
	      (0, _assert2.default)((0, _TestUtils.isA)(this.actual, value), message || 'Expected %s to be a %s', this.actual, value);
	
	      return this;
	    }
	  }, {
	    key: 'toNotBeA',
	    value: function toNotBeA(value, message) {
	      (0, _assert2.default)((0, _TestUtils.isFunction)(value) || typeof value === 'string', 'The "value" argument in toNotBeA(value) must be a function or a string');
	
	      (0, _assert2.default)(!(0, _TestUtils.isA)(this.actual, value), message || 'Expected %s to not be a %s', this.actual, value);
	
	      return this;
	    }
	  }, {
	    key: 'toMatch',
	    value: function toMatch(pattern, message) {
	      (0, _assert2.default)((0, _tmatch2.default)(this.actual, pattern), message || 'Expected %s to match %s', this.actual, pattern);
	
	      return this;
	    }
	  }, {
	    key: 'toNotMatch',
	    value: function toNotMatch(pattern, message) {
	      (0, _assert2.default)(!(0, _tmatch2.default)(this.actual, pattern), message || 'Expected %s to not match %s', this.actual, pattern);
	
	      return this;
	    }
	  }, {
	    key: 'toBeLessThan',
	    value: function toBeLessThan(value, message) {
	      (0, _assert2.default)(typeof this.actual === 'number', 'The "actual" argument in expect(actual).toBeLessThan() must be a number');
	
	      (0, _assert2.default)(typeof value === 'number', 'The "value" argument in toBeLessThan(value) must be a number');
	
	      (0, _assert2.default)(this.actual < value, message || 'Expected %s to be less than %s', this.actual, value);
	
	      return this;
	    }
	  }, {
	    key: 'toBeLessThanOrEqualTo',
	    value: function toBeLessThanOrEqualTo(value, message) {
	      (0, _assert2.default)(typeof this.actual === 'number', 'The "actual" argument in expect(actual).toBeLessThanOrEqualTo() must be a number');
	
	      (0, _assert2.default)(typeof value === 'number', 'The "value" argument in toBeLessThanOrEqualTo(value) must be a number');
	
	      (0, _assert2.default)(this.actual <= value, message || 'Expected %s to be less than or equal to %s', this.actual, value);
	
	      return this;
	    }
	  }, {
	    key: 'toBeGreaterThan',
	    value: function toBeGreaterThan(value, message) {
	      (0, _assert2.default)(typeof this.actual === 'number', 'The "actual" argument in expect(actual).toBeGreaterThan() must be a number');
	
	      (0, _assert2.default)(typeof value === 'number', 'The "value" argument in toBeGreaterThan(value) must be a number');
	
	      (0, _assert2.default)(this.actual > value, message || 'Expected %s to be greater than %s', this.actual, value);
	
	      return this;
	    }
	  }, {
	    key: 'toBeGreaterThanOrEqualTo',
	    value: function toBeGreaterThanOrEqualTo(value, message) {
	      (0, _assert2.default)(typeof this.actual === 'number', 'The "actual" argument in expect(actual).toBeGreaterThanOrEqualTo() must be a number');
	
	      (0, _assert2.default)(typeof value === 'number', 'The "value" argument in toBeGreaterThanOrEqualTo(value) must be a number');
	
	      (0, _assert2.default)(this.actual >= value, message || 'Expected %s to be greater than or equal to %s', this.actual, value);
	
	      return this;
	    }
	  }, {
	    key: 'toInclude',
	    value: function toInclude(value, compareValues, message) {
	      if (typeof compareValues === 'string') {
	        message = compareValues;
	        compareValues = null;
	      }
	
	      if (compareValues == null) compareValues = _TestUtils.isEqual;
	
	      var contains = false;
	
	      if ((0, _TestUtils.isArray)(this.actual)) {
	        contains = (0, _TestUtils.arrayContains)(this.actual, value, compareValues);
	      } else if ((0, _TestUtils.isObject)(this.actual)) {
	        contains = (0, _TestUtils.objectContains)(this.actual, value, compareValues);
	      } else if (typeof this.actual === 'string') {
	        contains = (0, _TestUtils.stringContains)(this.actual, value);
	      } else {
	        (0, _assert2.default)(false, 'The "actual" argument in expect(actual).toInclude() must be an array, object, or a string');
	      }
	
	      (0, _assert2.default)(contains, message || 'Expected %s to include %s', this.actual, value);
	
	      return this;
	    }
	  }, {
	    key: 'toExclude',
	    value: function toExclude(value, compareValues, message) {
	      if (typeof compareValues === 'string') {
	        message = compareValues;
	        compareValues = null;
	      }
	
	      if (compareValues == null) compareValues = _TestUtils.isEqual;
	
	      var contains = false;
	
	      if ((0, _TestUtils.isArray)(this.actual)) {
	        contains = (0, _TestUtils.arrayContains)(this.actual, value, compareValues);
	      } else if ((0, _TestUtils.isObject)(this.actual)) {
	        contains = (0, _TestUtils.objectContains)(this.actual, value, compareValues);
	      } else if (typeof this.actual === 'string') {
	        contains = (0, _TestUtils.stringContains)(this.actual, value);
	      } else {
	        (0, _assert2.default)(false, 'The "actual" argument in expect(actual).toExclude() must be an array, object, or a string');
	      }
	
	      (0, _assert2.default)(!contains, message || 'Expected %s to exclude %s', this.actual, value);
	
	      return this;
	    }
	  }, {
	    key: 'toIncludeKeys',
	    value: function toIncludeKeys(keys, comparator, message) {
	      var _this = this;
	
	      if (typeof comparator === 'string') {
	        message = comparator;
	        comparator = null;
	      }
	
	      if (comparator == null) comparator = _has2.default;
	
	      (0, _assert2.default)(_typeof(this.actual) === 'object', 'The "actual" argument in expect(actual).toIncludeKeys() must be an object, not %s', this.actual);
	
	      (0, _assert2.default)((0, _TestUtils.isArray)(keys), 'The "keys" argument in expect(actual).toIncludeKeys(keys) must be an array, not %s', keys);
	
	      var contains = keys.every(function (key) {
	        return comparator(_this.actual, key);
	      });
	
	      (0, _assert2.default)(contains, message || 'Expected %s to include key(s) %s', this.actual, keys.join(', '));
	
	      return this;
	    }
	  }, {
	    key: 'toIncludeKey',
	    value: function toIncludeKey(key) {
	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }
	
	      return this.toIncludeKeys.apply(this, [[key]].concat(args));
	    }
	  }, {
	    key: 'toExcludeKeys',
	    value: function toExcludeKeys(keys, comparator, message) {
	      var _this2 = this;
	
	      if (typeof comparator === 'string') {
	        message = comparator;
	        comparator = null;
	      }
	
	      if (comparator == null) comparator = _has2.default;
	
	      (0, _assert2.default)(_typeof(this.actual) === 'object', 'The "actual" argument in expect(actual).toExcludeKeys() must be an object, not %s', this.actual);
	
	      (0, _assert2.default)((0, _TestUtils.isArray)(keys), 'The "keys" argument in expect(actual).toIncludeKeys(keys) must be an array, not %s', keys);
	
	      var contains = keys.every(function (key) {
	        return comparator(_this2.actual, key);
	      });
	
	      (0, _assert2.default)(!contains, message || 'Expected %s to exclude key(s) %s', this.actual, keys.join(', '));
	
	      return this;
	    }
	  }, {
	    key: 'toExcludeKey',
	    value: function toExcludeKey(key) {
	      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        args[_key2 - 1] = arguments[_key2];
	      }
	
	      return this.toExcludeKeys.apply(this, [[key]].concat(args));
	    }
	  }, {
	    key: 'toHaveBeenCalled',
	    value: function toHaveBeenCalled(message) {
	      var spy = this.actual;
	
	      (0, _assert2.default)((0, _SpyUtils.isSpy)(spy), 'The "actual" argument in expect(actual).toHaveBeenCalled() must be a spy');
	
	      (0, _assert2.default)(spy.calls.length > 0, message || 'spy was not called');
	
	      return this;
	    }
	  }, {
	    key: 'toHaveBeenCalledWith',
	    value: function toHaveBeenCalledWith() {
	      for (var _len3 = arguments.length, expectedArgs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	        expectedArgs[_key3] = arguments[_key3];
	      }
	
	      var spy = this.actual;
	
	      (0, _assert2.default)((0, _SpyUtils.isSpy)(spy), 'The "actual" argument in expect(actual).toHaveBeenCalledWith() must be a spy');
	
	      (0, _assert2.default)(spy.calls.some(function (call) {
	        return (0, _TestUtils.isEqual)(call.arguments, expectedArgs);
	      }), 'spy was never called with %s', expectedArgs);
	
	      return this;
	    }
	  }, {
	    key: 'toNotHaveBeenCalled',
	    value: function toNotHaveBeenCalled(message) {
	      var spy = this.actual;
	
	      (0, _assert2.default)((0, _SpyUtils.isSpy)(spy), 'The "actual" argument in expect(actual).toNotHaveBeenCalled() must be a spy');
	
	      (0, _assert2.default)(spy.calls.length === 0, message || 'spy was not supposed to be called');
	
	      return this;
	    }
	  }]);
	
	  return Expectation;
	}();
	
	var deprecate = function deprecate(fn, message) {
	  var alreadyWarned = false;
	
	  return function () {
	    if (!alreadyWarned) {
	      alreadyWarned = true;
	      console.warn(message);
	    }
	
	    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	      args[_key4] = arguments[_key4];
	    }
	
	    return fn.apply(this, args);
	  };
	};
	
	Expectation.prototype.withContext = deprecate(function (context) {
	  (0, _assert2.default)((0, _TestUtils.isFunction)(this.actual), 'The "actual" argument in expect(actual).withContext() must be a function');
	
	  this.context = context;
	
	  return this;
	}, '\nwithContext is deprecated; use a closure instead.\n\n  expect(fn).withContext(context).toThrow()\n\nbecomes\n\n  expect(() => fn.call(context)).toThrow()\n');
	
	Expectation.prototype.withArgs = deprecate(function () {
	  var _args;
	
	  (0, _assert2.default)((0, _TestUtils.isFunction)(this.actual), 'The "actual" argument in expect(actual).withArgs() must be a function');
	
	  if (arguments.length) this.args = (_args = this.args).concat.apply(_args, arguments);
	
	  return this;
	}, '\nwithArgs is deprecated; use a closure instead.\n\n  expect(fn).withArgs(a, b, c).toThrow()\n\nbecomes\n\n  expect(() => fn(a, b, c)).toThrow()\n');
	
	var aliases = {
	  toBeAn: 'toBeA',
	  toNotBeAn: 'toNotBeA',
	  toBeTruthy: 'toExist',
	  toBeFalsy: 'toNotExist',
	  toBeFewerThan: 'toBeLessThan',
	  toBeMoreThan: 'toBeGreaterThan',
	  toContain: 'toInclude',
	  toNotContain: 'toExclude',
	  toNotInclude: 'toExclude',
	  toContainKeys: 'toIncludeKeys',
	  toNotContainKeys: 'toExcludeKeys',
	  toNotIncludeKeys: 'toExcludeKeys',
	  toContainKey: 'toIncludeKey',
	  toNotContainKey: 'toExcludeKey',
	  toNotIncludeKey: 'toExcludeKey'
	};
	
	for (var alias in aliases) {
	  if (aliases.hasOwnProperty(alias)) Expectation.prototype[alias] = Expectation.prototype[aliases[alias]];
	}exports.default = Expectation;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var bind = __webpack_require__(6);
	
	module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty);


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var implementation = __webpack_require__(7);
	
	module.exports = Function.prototype.bind || implementation;


/***/ },
/* 7 */
/***/ function(module, exports) {

	var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
	var slice = Array.prototype.slice;
	var toStr = Object.prototype.toString;
	var funcType = '[object Function]';
	
	module.exports = function bind(that) {
	    var target = this;
	    if (typeof target !== 'function' || toStr.call(target) !== funcType) {
	        throw new TypeError(ERROR_MESSAGE + target);
	    }
	    var args = slice.call(arguments, 1);
	
	    var bound;
	    var binder = function () {
	        if (this instanceof bound) {
	            var result = target.apply(
	                this,
	                args.concat(slice.call(arguments))
	            );
	            if (Object(result) === result) {
	                return result;
	            }
	            return this;
	        } else {
	            return target.apply(
	                that,
	                args.concat(slice.call(arguments))
	            );
	        }
	    };
	
	    var boundLength = Math.max(0, target.length - args.length);
	    var boundArgs = [];
	    for (var i = 0; i < boundLength; i++) {
	        boundArgs.push('$' + i);
	    }
	
	    bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);
	
	    if (target.prototype) {
	        var Empty = function Empty() {};
	        Empty.prototype = target.prototype;
	        bound.prototype = new Empty();
	        Empty.prototype = null;
	    }
	
	    return bound;
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, Buffer) {'use strict'
	
	function isArguments (obj) {
	  return Object.prototype.toString.call(obj) === '[object Arguments]'
	}
	
	module.exports = match
	
	function match (obj, pattern) {
	  return match_(obj, pattern, [], [])
	}
	
	/* istanbul ignore next */
	var log = (/\btmatch\b/.test(process.env.NODE_DEBUG || '')) ?
	  console.error : function () {}
	
	function match_ (obj, pattern, ca, cb) {
	  log('TMATCH', typeof obj, pattern)
	  if (obj == pattern) {
	    log('TMATCH same object or simple value, or problem')
	    // if one is object, and the other isn't, then this is bogus
	    if (obj === null || pattern === null) {
	      return true
	
	    } else if (typeof obj === 'object' && typeof pattern === 'object') {
	      return true
	
	    } else if (typeof obj === 'object' && typeof pattern !== 'object') {
	      return false
	
	    } else if (typeof obj !== 'object' && typeof pattern === 'object') {
	      return false
	
	    } else {
	      return true
	    }
	
	  } else if (obj === null || pattern === null) {
	    log('TMATCH null test, already failed ==')
	    return false
	
	  } else if (typeof obj === 'string' && pattern instanceof RegExp) {
	    log('TMATCH string~=regexp test')
	    return pattern.test(obj)
	
	  } else if (typeof obj === 'string' && typeof pattern === 'string' && pattern) {
	    log('TMATCH string~=string test')
	    return obj.indexOf(pattern) !== -1
	
	  } else if (obj instanceof Date && pattern instanceof Date) {
	    log('TMATCH date test')
	    return obj.getTime() === pattern.getTime()
	
	  } else if (obj instanceof Date && typeof pattern === 'string') {
	    log('TMATCH date~=string test')
	    return obj.getTime() === new Date(pattern).getTime()
	
	  } else if (isArguments(obj) || isArguments(pattern)) {
	    log('TMATCH arguments test')
	    var slice = Array.prototype.slice
	    return match_(slice.call(obj), slice.call(pattern), ca, cb)
	
	  } else if (pattern === Buffer) {
	    log('TMATCH Buffer ctor')
	    return Buffer.isBuffer(obj)
	
	  } else if (pattern === Function) {
	    log('TMATCH Function ctor')
	    return typeof obj === 'function'
	
	  } else if (pattern === Number) {
	    log('TMATCH Number ctor (finite, not NaN)')
	    return typeof obj === 'number' && obj === obj && isFinite(obj)
	
	  } else if (pattern !== pattern) {
	    log('TMATCH NaN')
	    return obj !== obj
	
	  } else if (pattern === String) {
	    log('TMATCH String ctor')
	    return typeof obj === 'string'
	
	  } else if (pattern === Boolean) {
	    log('TMATCH Boolean ctor')
	    return typeof obj === 'boolean'
	
	  } else if (pattern === Array) {
	    log('TMATCH Array ctor', pattern, Array.isArray(obj))
	    return Array.isArray(obj)
	
	  } else if (typeof pattern === 'function' && typeof obj === 'object') {
	    log('TMATCH object~=function')
	    return obj instanceof pattern
	
	  } else if (typeof obj !== 'object' || typeof pattern !== 'object') {
	    log('TMATCH obj is not object, pattern is not object, false')
	    return false
	
	  } else if (obj instanceof RegExp && pattern instanceof RegExp) {
	    log('TMATCH regexp~=regexp test')
	    return obj.source === pattern.source &&
	      obj.global === pattern.global &&
	      obj.multiline === pattern.multiline &&
	      obj.lastIndex === pattern.lastIndex &&
	      obj.ignoreCase === pattern.ignoreCase
	
	  } else if (Buffer.isBuffer(obj) && Buffer.isBuffer(pattern)) {
	    log('TMATCH buffer test')
	    if (obj.equals) {
	      return obj.equals(pattern)
	    } else {
	      if (obj.length !== pattern.length) return false
	
	      for (var j = 0; j < obj.length; j++) if (obj[j] != pattern[j]) return false
	
	      return true
	    }
	
	  } else {
	    // both are objects.  interesting case!
	    log('TMATCH object~=object test')
	    var kobj = Object.keys(obj)
	    var kpat = Object.keys(pattern)
	    log('  TMATCH patternkeys=%j objkeys=%j', kpat, kobj)
	
	    // don't bother with stack acrobatics if there's nothing there
	    if (kobj.length === 0 && kpat.length === 0) return true
	
	    // if we've seen this exact pattern and object already, then
	    // it means that pattern and obj have matching cyclicalness
	    // however, non-cyclical patterns can match cyclical objects
	    log('  TMATCH check seen objects...')
	    var cal = ca.length
	    while (cal--) if (ca[cal] === obj && cb[cal] === pattern) return true
	    ca.push(obj); cb.push(pattern)
	    log('  TMATCH not seen previously')
	
	    var key
	    for (var l = kpat.length - 1; l >= 0; l--) {
	      key = kpat[l]
	      log('  TMATCH test obj[%j]', key, obj[key], pattern[key])
	      if (!match_(obj[key], pattern[key], ca, cb)) return false
	    }
	
	    ca.pop()
	    cb.pop()
	
	    log('  TMATCH object pass')
	    return true
	  }
	
	  /* istanbul ignore next */
	  throw new Error('impossible to reach this point')
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9), __webpack_require__(10).Buffer))

/***/ },
/* 9 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	/* eslint-disable no-proto */
	
	'use strict'
	
	var base64 = __webpack_require__(11)
	var ieee754 = __webpack_require__(12)
	var isArray = __webpack_require__(13)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
	  ? global.TYPED_ARRAY_SUPPORT
	  : typedArraySupport()
	
	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	exports.kMaxLength = kMaxLength()
	
	function typedArraySupport () {
	  try {
	    var arr = new Uint8Array(1)
	    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
	    return arr.foo() === 42 && // typed array instances can be augmented
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	}
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length)
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length)
	    }
	    that.length = length
	  }
	
	  return that
	}
	
	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */
	
	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }
	
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}
	
	Buffer.poolSize = 8192 // not used by this implementation
	
	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype
	  return arr
	}
	
	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }
	
	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }
	
	  return fromObject(that, value)
	}
	
	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	}
	
	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype
	  Buffer.__proto__ = Uint8Array
	  if (typeof Symbol !== 'undefined' && Symbol.species &&
	      Buffer[Symbol.species] === Buffer) {
	    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
	    Object.defineProperty(Buffer, Symbol.species, {
	      value: null,
	      configurable: true
	    })
	  }
	}
	
	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}
	
	function alloc (that, size, fill, encoding) {
	  assertSize(size)
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}
	
	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	}
	
	function allocUnsafe (that, size) {
	  assertSize(size)
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	}
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8'
	  }
	
	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }
	
	  var length = byteLength(string, encoding) | 0
	  that = createBuffer(that, length)
	
	  var actual = that.write(string, encoding)
	
	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual)
	  }
	
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0
	  that = createBuffer(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength // this throws if `array` is not a valid ArrayBuffer
	
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }
	
	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }
	
	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array)
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset)
	  } else {
	    array = new Uint8Array(array, byteOffset, length)
	  }
	
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array
	    that.__proto__ = Buffer.prototype
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array)
	  }
	  return that
	}
	
	function fromObject (that, obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0
	    that = createBuffer(that, len)
	
	    if (that.length === 0) {
	      return that
	    }
	
	    obj.copy(that, 0, 0, len)
	    return that
	  }
	
	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }
	
	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }
	
	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0
	  }
	  return Buffer.alloc(+length)
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i]
	      y = b[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }
	
	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length
	    }
	  }
	
	  var buffer = Buffer.allocUnsafe(length)
	  var pos = 0
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i]
	    if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos)
	    pos += buf.length
	  }
	  return buffer
	}
	
	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string
	  }
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.
	
	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }
	
	  if (end === undefined || end > this.length) {
	    end = this.length
	  }
	
	  if (end <= 0) {
	    return ''
	  }
	
	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0
	  start >>>= 0
	
	  if (end <= start) {
	    return ''
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true
	
	function swap (b, n, m) {
	  var i = b[n]
	  b[n] = b[m]
	  b[m] = i
	}
	
	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1)
	  }
	  return this
	}
	
	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3)
	    swap(this, i + 1, i + 2)
	  }
	  return this
	}
	
	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7)
	    swap(this, i + 1, i + 6)
	    swap(this, i + 2, i + 5)
	    swap(this, i + 3, i + 4)
	  }
	  return this
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }
	
	  if (start === undefined) {
	    start = 0
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0
	  }
	  if (thisStart === undefined) {
	    thisStart = 0
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length
	  }
	
	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }
	
	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }
	
	  start >>>= 0
	  end >>>= 0
	  thisStart >>>= 0
	  thisEnd >>>= 0
	
	  if (this === target) return 0
	
	  var x = thisEnd - thisStart
	  var y = end - start
	  var len = Math.min(x, y)
	
	  var thisCopy = this.slice(thisStart, thisEnd)
	  var targetCopy = target.slice(start, end)
	
	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i]
	      y = targetCopy[i]
	      break
	    }
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1
	
	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset
	    byteOffset = 0
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000
	  }
	  byteOffset = +byteOffset  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1)
	  }
	
	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0
	    else return -1
	  }
	
	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding)
	  }
	
	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1
	  var arrLength = arr.length
	  var valLength = val.length
	
	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase()
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2
	      arrLength /= 2
	      valLength /= 2
	      byteOffset /= 2
	    }
	  }
	
	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }
	
	  var i
	  if (dir) {
	    var foundIndex = -1
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex
	        foundIndex = -1
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false
	          break
	        }
	      }
	      if (found) return i
	    }
	  }
	
	  return -1
	}
	
	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	}
	
	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function latin1Slice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end)
	    newBuf.__proto__ = Buffer.prototype
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1
	    checkInt(this, value, offset, byteLength, maxBytes, 0)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = (value & 0xff)
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = (value & 0xff)
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff)
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = (value & 0xff)
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    )
	  }
	
	  return len
	}
	
	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start
	      start = 0
	      end = this.length
	    } else if (typeof end === 'string') {
	      encoding = end
	      end = this.length
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0)
	      if (code < 256) {
	        val = code
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255
	  }
	
	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }
	
	  if (end <= start) {
	    return this
	  }
	
	  start = start >>> 0
	  end = end === undefined ? this.length : end >>> 0
	
	  if (!val) val = 0
	
	  var i
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString())
	    var len = bytes.length
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict'
	
	exports.byteLength = byteLength
	exports.toByteArray = toByteArray
	exports.fromByteArray = fromByteArray
	
	var lookup = []
	var revLookup = []
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array
	
	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	for (var i = 0, len = code.length; i < len; ++i) {
	  lookup[i] = code[i]
	  revLookup[code.charCodeAt(i)] = i
	}
	
	revLookup['-'.charCodeAt(0)] = 62
	revLookup['_'.charCodeAt(0)] = 63
	
	function placeHoldersCount (b64) {
	  var len = b64.length
	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }
	
	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
	}
	
	function byteLength (b64) {
	  // base64 is 4/3 + up to two characters of the original data
	  return b64.length * 3 / 4 - placeHoldersCount(b64)
	}
	
	function toByteArray (b64) {
	  var i, j, l, tmp, placeHolders, arr
	  var len = b64.length
	  placeHolders = placeHoldersCount(b64)
	
	  arr = new Arr(len * 3 / 4 - placeHolders)
	
	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len
	
	  var L = 0
	
	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
	    arr[L++] = (tmp >> 16) & 0xFF
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
	    arr[L++] = tmp & 0xFF
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
	    arr[L++] = (tmp >> 8) & 0xFF
	    arr[L++] = tmp & 0xFF
	  }
	
	  return arr
	}
	
	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}
	
	function encodeChunk (uint8, start, end) {
	  var tmp
	  var output = []
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
	    output.push(tripletToBase64(tmp))
	  }
	  return output.join('')
	}
	
	function fromByteArray (uint8) {
	  var tmp
	  var len = uint8.length
	  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
	  var output = ''
	  var parts = []
	  var maxChunkLength = 16383 // must be multiple of 3
	
	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
	  }
	
	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1]
	    output += lookup[tmp >> 2]
	    output += lookup[(tmp << 4) & 0x3F]
	    output += '=='
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
	    output += lookup[tmp >> 10]
	    output += lookup[(tmp >> 4) & 0x3F]
	    output += lookup[(tmp << 2) & 0x3F]
	    output += '='
	  }
	
	  parts.push(output)
	
	  return parts.join('')
	}


/***/ },
/* 12 */
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 13 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _objectInspect = __webpack_require__(15);
	
	var _objectInspect2 = _interopRequireDefault(_objectInspect);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var formatString = function formatString(string, args) {
	  var index = 0;
	  return string.replace(/%s/g, function () {
	    return (0, _objectInspect2.default)(args[index++]);
	  });
	};
	
	var assert = function assert(condition, createMessage) {
	  for (var _len = arguments.length, extraArgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	    extraArgs[_key - 2] = arguments[_key];
	  }
	
	  if (condition) return;
	
	  var message = typeof createMessage === 'string' ? formatString(createMessage, extraArgs) : createMessage(extraArgs);
	
	  throw new Error(message);
	};
	
	exports.default = assert;

/***/ },
/* 15 */
/***/ function(module, exports) {

	var hasMap = typeof Map === 'function' && Map.prototype;
	var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, 'size') : null;
	var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === 'function' ? mapSizeDescriptor.get : null;
	var mapForEach = hasMap && Map.prototype.forEach;
	var hasSet = typeof Set === 'function' && Set.prototype;
	var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, 'size') : null;
	var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === 'function' ? setSizeDescriptor.get : null;
	var setForEach = hasSet && Set.prototype.forEach;
	var booleanValueOf = Boolean.prototype.valueOf;
	
	module.exports = function inspect_ (obj, opts, depth, seen) {
	    if (!opts) opts = {};
	    
	    var maxDepth = opts.depth === undefined ? 5 : opts.depth;
	    if (depth === undefined) depth = 0;
	    if (depth >= maxDepth && maxDepth > 0 && obj && typeof obj === 'object') {
	        return '[Object]';
	    }
	    
	    if (seen === undefined) seen = [];
	    else if (indexOf(seen, obj) >= 0) {
	        return '[Circular]';
	    }
	    
	    function inspect (value, from) {
	        if (from) {
	            seen = seen.slice();
	            seen.push(from);
	        }
	        return inspect_(value, opts, depth + 1, seen);
	    }
	    
	    if (typeof obj === 'string') {
	        return inspectString(obj);
	    }
	    else if (typeof obj === 'function') {
	        var name = nameOf(obj);
	        return '[Function' + (name ? ': ' + name : '') + ']';
	    }
	    else if (obj === null) {
	        return 'null';
	    }
	    else if (isSymbol(obj)) {
	        var symString = Symbol.prototype.toString.call(obj);
	        return typeof obj === 'object' ? 'Object(' + symString + ')' : symString;
	    }
	    else if (isElement(obj)) {
	        var s = '<' + String(obj.nodeName).toLowerCase();
	        var attrs = obj.attributes || [];
	        for (var i = 0; i < attrs.length; i++) {
	            s += ' ' + attrs[i].name + '="' + quote(attrs[i].value) + '"';
	        }
	        s += '>';
	        if (obj.childNodes && obj.childNodes.length) s += '...';
	        s += '</' + String(obj.nodeName).toLowerCase() + '>';
	        return s;
	    }
	    else if (isArray(obj)) {
	        if (obj.length === 0) return '[]';
	        var xs = Array(obj.length);
	        for (var i = 0; i < obj.length; i++) {
	            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
	        }
	        return '[ ' + xs.join(', ') + ' ]';
	    }
	    else if (isError(obj)) {
	        var parts = [];
	        for (var key in obj) {
	            if (!has(obj, key)) continue;
	            
	            if (/[^\w$]/.test(key)) {
	                parts.push(inspect(key) + ': ' + inspect(obj[key]));
	            }
	            else {
	                parts.push(key + ': ' + inspect(obj[key]));
	            }
	        }
	        if (parts.length === 0) return '[' + obj + ']';
	        return '{ [' + obj + '] ' + parts.join(', ') + ' }';
	    }
	    else if (typeof obj === 'object' && typeof obj.inspect === 'function') {
	        return obj.inspect();
	    }
	    else if (isMap(obj)) {
	        var parts = [];
	        mapForEach.call(obj, function (value, key) {
	            parts.push(inspect(key, obj) + ' => ' + inspect(value, obj));
	        });
	        return 'Map (' + mapSize.call(obj) + ') {' + parts.join(', ') + '}';
	    }
	    else if (isSet(obj)) {
	        var parts = [];
	        setForEach.call(obj, function (value ) {
	            parts.push(inspect(value, obj));
	        });
	        return 'Set (' + setSize.call(obj) + ') {' + parts.join(', ') + '}';
	    }
	    else if (typeof obj !== 'object') {
	        return String(obj);
	    }
	    else if (isNumber(obj)) {
	        return 'Object(' + Number(obj) + ')';
	    }
	    else if (isBoolean(obj)) {
	        return 'Object(' + booleanValueOf.call(obj) + ')';
	    }
	    else if (isString(obj)) {
	        return 'Object(' + inspect(String(obj)) + ')';
	    }
	    else if (!isDate(obj) && !isRegExp(obj)) {
	        var xs = [], keys = [];
	        for (var key in obj) {
	            if (has(obj, key)) keys.push(key);
	        }
	        keys.sort();
	        for (var i = 0; i < keys.length; i++) {
	            var key = keys[i];
	            if (/[^\w$]/.test(key)) {
	                xs.push(inspect(key) + ': ' + inspect(obj[key], obj));
	            }
	            else xs.push(key + ': ' + inspect(obj[key], obj));
	        }
	        if (xs.length === 0) return '{}';
	        return '{ ' + xs.join(', ') + ' }';
	    }
	    else return String(obj);
	};
	
	function quote (s) {
	    return String(s).replace(/"/g, '&quot;');
	}
	
	function isArray (obj) { return toStr(obj) === '[object Array]' }
	function isDate (obj) { return toStr(obj) === '[object Date]' }
	function isRegExp (obj) { return toStr(obj) === '[object RegExp]' }
	function isError (obj) { return toStr(obj) === '[object Error]' }
	function isSymbol (obj) { return toStr(obj) === '[object Symbol]' }
	function isString (obj) { return toStr(obj) === '[object String]' }
	function isNumber (obj) { return toStr(obj) === '[object Number]' }
	function isBoolean (obj) { return toStr(obj) === '[object Boolean]' }
	
	var hasOwn = Object.prototype.hasOwnProperty || function (key) { return key in this; };
	function has (obj, key) {
	    return hasOwn.call(obj, key);
	}
	
	function toStr (obj) {
	    return Object.prototype.toString.call(obj);
	}
	
	function nameOf (f) {
	    if (f.name) return f.name;
	    var m = f.toString().match(/^function\s*([\w$]+)/);
	    if (m) return m[1];
	}
	
	function indexOf (xs, x) {
	    if (xs.indexOf) return xs.indexOf(x);
	    for (var i = 0, l = xs.length; i < l; i++) {
	        if (xs[i] === x) return i;
	    }
	    return -1;
	}
	
	function isMap (x) {
	    if (!mapSize) {
	        return false;
	    }
	    try {
	        mapSize.call(x);
	        return true;
	    } catch (e) {}
	    return false;
	}
	
	function isSet (x) {
	    if (!setSize) {
	        return false;
	    }
	    try {
	        setSize.call(x);
	        return true;
	    } catch (e) {}
	    return false;
	}
	
	function isElement (x) {
	    if (!x || typeof x !== 'object') return false;
	    if (typeof HTMLElement !== 'undefined' && x instanceof HTMLElement) {
	        return true;
	    }
	    return typeof x.nodeName === 'string'
	        && typeof x.getAttribute === 'function'
	    ;
	}
	
	function inspectString (str) {
	    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
	    return "'" + s + "'";
	    
	    function lowbyte (c) {
	        var n = c.charCodeAt(0);
	        var x = { 8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r' }[n];
	        if (x) return '\\' + x;
	        return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16);
	    }
	}


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.spyOn = exports.createSpy = exports.restoreSpies = exports.isSpy = undefined;
	
	var _defineProperties = __webpack_require__(17);
	
	var _assert = __webpack_require__(14);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _TestUtils = __webpack_require__(21);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /*eslint-disable prefer-rest-params, no-underscore-dangle*/
	
	
	var noop = function noop() {};
	
	var supportsConfigurableFnLength = _defineProperties.supportsDescriptors && Object.getOwnPropertyDescriptor(function () {}, 'length').configurable;
	
	var isSpy = exports.isSpy = function isSpy(object) {
	  return object && object.__isSpy === true;
	};
	
	var spies = [];
	
	var restoreSpies = exports.restoreSpies = function restoreSpies() {
	  for (var i = spies.length - 1; i >= 0; i--) {
	    spies[i].restore();
	  }spies = [];
	};
	
	var createSpy = exports.createSpy = function createSpy(fn) {
	  var restore = arguments.length <= 1 || arguments[1] === undefined ? noop : arguments[1];
	
	  if (fn == null) fn = noop;
	
	  (0, _assert2.default)((0, _TestUtils.isFunction)(fn), 'createSpy needs a function');
	
	  var targetFn = void 0,
	      thrownValue = void 0,
	      returnValue = void 0,
	      spy = void 0;
	
	  function spyLogic() {
	    spy.calls.push({
	      context: this,
	      arguments: Array.prototype.slice.call(arguments, 0)
	    });
	
	    if (targetFn) return targetFn.apply(this, arguments);
	
	    if (thrownValue) throw thrownValue;
	
	    return returnValue;
	  }
	
	  if (supportsConfigurableFnLength) {
	    spy = Object.defineProperty(spyLogic, 'length', { value: fn.length, writable: false, enumerable: false, configurable: true });
	  } else {
	    spy = new Function('spy', 'return function(' + // eslint-disable-line no-new-func
	    [].concat(_toConsumableArray(Array(fn.length))).map(function (_, i) {
	      return '_' + i;
	    }).join(',') + ') {\n      return spy.apply(this, arguments)\n    }')(spyLogic);
	  }
	
	  spy.calls = [];
	
	  spy.andCall = function (otherFn) {
	    targetFn = otherFn;
	    return spy;
	  };
	
	  spy.andCallThrough = function () {
	    return spy.andCall(fn);
	  };
	
	  spy.andThrow = function (value) {
	    thrownValue = value;
	    return spy;
	  };
	
	  spy.andReturn = function (value) {
	    returnValue = value;
	    return spy;
	  };
	
	  spy.getLastCall = function () {
	    return spy.calls[spy.calls.length - 1];
	  };
	
	  spy.reset = function () {
	    spy.calls = [];
	  };
	
	  spy.restore = spy.destroy = restore;
	
	  spy.__isSpy = true;
	
	  spies.push(spy);
	
	  return spy;
	};
	
	var spyOn = exports.spyOn = function spyOn(object, methodName) {
	  var original = object[methodName];
	
	  if (!isSpy(original)) {
	    (0, _assert2.default)((0, _TestUtils.isFunction)(original), 'Cannot spyOn the %s property; it is not a function', methodName);
	
	    object[methodName] = createSpy(original, function () {
	      object[methodName] = original;
	    });
	  }
	
	  return object[methodName];
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var keys = __webpack_require__(18);
	var foreach = __webpack_require__(20);
	var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';
	
	var toStr = Object.prototype.toString;
	
	var isFunction = function (fn) {
		return typeof fn === 'function' && toStr.call(fn) === '[object Function]';
	};
	
	var arePropertyDescriptorsSupported = function () {
		var obj = {};
		try {
			Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
	        /* eslint-disable no-unused-vars, no-restricted-syntax */
	        for (var _ in obj) { return false; }
	        /* eslint-enable no-unused-vars, no-restricted-syntax */
			return obj.x === obj;
		} catch (e) { /* this is IE 8. */
			return false;
		}
	};
	var supportsDescriptors = Object.defineProperty && arePropertyDescriptorsSupported();
	
	var defineProperty = function (object, name, value, predicate) {
		if (name in object && (!isFunction(predicate) || !predicate())) {
			return;
		}
		if (supportsDescriptors) {
			Object.defineProperty(object, name, {
				configurable: true,
				enumerable: false,
				value: value,
				writable: true
			});
		} else {
			object[name] = value;
		}
	};
	
	var defineProperties = function (object, map) {
		var predicates = arguments.length > 2 ? arguments[2] : {};
		var props = keys(map);
		if (hasSymbols) {
			props = props.concat(Object.getOwnPropertySymbols(map));
		}
		foreach(props, function (name) {
			defineProperty(object, name, map[name], predicates[name]);
		});
	};
	
	defineProperties.supportsDescriptors = !!supportsDescriptors;
	
	module.exports = defineProperties;


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// modified from https://github.com/es-shims/es5-shim
	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var slice = Array.prototype.slice;
	var isArgs = __webpack_require__(19);
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		/* global window */
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		/* global window */
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};
	
	var keysShim = function keys(object) {
		var isObject = object !== null && typeof object === 'object';
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgs(object);
		var isString = isObject && toStr.call(object) === '[object String]';
		var theKeys = [];
	
		if (!isObject && !isFunction && !isArguments) {
			throw new TypeError('Object.keys called on a non-object');
		}
	
		var skipProto = hasProtoEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}
	
		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(skipProto && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}
	
		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
	
			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
	
	keysShim.shim = function shimObjectKeys() {
		if (Object.keys) {
			var keysWorksWithArguments = (function () {
				// Safari 5.0 bug
				return (Object.keys(arguments) || '').length === 2;
			}(1, 2));
			if (!keysWorksWithArguments) {
				var originalKeys = Object.keys;
				Object.keys = function keys(object) {
					if (isArgs(object)) {
						return originalKeys(slice.call(object));
					} else {
						return originalKeys(object);
					}
				};
			}
		} else {
			Object.keys = keysShim;
		}
		return Object.keys || keysShim;
	};
	
	module.exports = keysShim;


/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';
	
	var toStr = Object.prototype.toString;
	
	module.exports = function isArguments(value) {
		var str = toStr.call(value);
		var isArgs = str === '[object Arguments]';
		if (!isArgs) {
			isArgs = str !== '[object Array]' &&
				value !== null &&
				typeof value === 'object' &&
				typeof value.length === 'number' &&
				value.length >= 0 &&
				toStr.call(value.callee) === '[object Function]';
		}
		return isArgs;
	};


/***/ },
/* 20 */
/***/ function(module, exports) {

	
	var hasOwn = Object.prototype.hasOwnProperty;
	var toString = Object.prototype.toString;
	
	module.exports = function forEach (obj, fn, ctx) {
	    if (toString.call(fn) !== '[object Function]') {
	        throw new TypeError('iterator must be a function');
	    }
	    var l = obj.length;
	    if (l === +l) {
	        for (var i = 0; i < l; i++) {
	            fn.call(ctx, obj[i], i, obj);
	        }
	    } else {
	        for (var k in obj) {
	            if (hasOwn.call(obj, k)) {
	                fn.call(ctx, obj[k], k, obj);
	            }
	        }
	    }
	};
	


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.stringContains = exports.objectContains = exports.arrayContains = exports.functionThrows = exports.isA = exports.isObject = exports.isArray = exports.isFunction = exports.isEqual = exports.whyNotEqual = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _isRegex = __webpack_require__(22);
	
	var _isRegex2 = _interopRequireDefault(_isRegex);
	
	var _why = __webpack_require__(23);
	
	var _why2 = _interopRequireDefault(_why);
	
	var _objectKeys = __webpack_require__(18);
	
	var _objectKeys2 = _interopRequireDefault(_objectKeys);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Returns the reason why the given arguments are not *conceptually*
	 * equal, if any; the empty string otherwise.
	 */
	var whyNotEqual = exports.whyNotEqual = function whyNotEqual(a, b) {
	  return a == b ? '' : (0, _why2.default)(a, b);
	};
	
	/**
	 * Returns true if the given arguments are *conceptually* equal.
	 */
	var isEqual = exports.isEqual = function isEqual(a, b) {
	  return whyNotEqual(a, b) === '';
	};
	
	/**
	 * Returns true if the given object is a function.
	 */
	var isFunction = exports.isFunction = function isFunction(object) {
	  return typeof object === 'function';
	};
	
	/**
	 * Returns true if the given object is an array.
	 */
	var isArray = exports.isArray = function isArray(object) {
	  return Array.isArray(object);
	};
	
	/**
	 * Returns true if the given object is an object.
	 */
	var isObject = exports.isObject = function isObject(object) {
	  return object && !isArray(object) && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object';
	};
	
	/**
	 * Returns true if the given object is an instanceof value
	 * or its typeof is the given value.
	 */
	var isA = exports.isA = function isA(object, value) {
	  if (isFunction(value)) return object instanceof value;
	
	  if (value === 'array') return Array.isArray(object);
	
	  return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === value;
	};
	
	/**
	 * Returns true if the given function throws the given value
	 * when invoked. The value may be:
	 *
	 * - undefined, to merely assert there was a throw
	 * - a constructor function, for comparing using instanceof
	 * - a regular expression, to compare with the error message
	 * - a string, to find in the error message
	 */
	var functionThrows = exports.functionThrows = function functionThrows(fn, context, args, value) {
	  try {
	    fn.apply(context, args);
	  } catch (error) {
	    if (value == null) return true;
	
	    if (isFunction(value) && error instanceof value) return true;
	
	    var message = error.message || error;
	
	    if (typeof message === 'string') {
	      if ((0, _isRegex2.default)(value) && value.test(error.message)) return true;
	
	      if (typeof value === 'string' && message.indexOf(value) !== -1) return true;
	    }
	  }
	
	  return false;
	};
	
	/**
	 * Returns true if the given array contains the value, false
	 * otherwise. The compareValues function must return false to
	 * indicate a non-match.
	 */
	var arrayContains = exports.arrayContains = function arrayContains(array, value, compareValues) {
	  return array.some(function (item) {
	    return compareValues(item, value) !== false;
	  });
	};
	
	var ownEnumerableKeys = function ownEnumerableKeys(object) {
	  if ((typeof Reflect === 'undefined' ? 'undefined' : _typeof(Reflect)) === 'object' && typeof Reflect.ownKeys === 'function') {
	    return Reflect.ownKeys(object).filter(function (key) {
	      return Object.getOwnPropertyDescriptor(object, key).enumerable;
	    });
	  }
	
	  if (typeof Object.getOwnPropertySymbols === 'function') {
	    return Object.getOwnPropertySymbols(object).filter(function (key) {
	      return Object.getOwnPropertyDescriptor(object, key).enumerable;
	    }).concat((0, _objectKeys2.default)(object));
	  }
	
	  return (0, _objectKeys2.default)(object);
	};
	
	/**
	 * Returns true if the given object contains the value, false
	 * otherwise. The compareValues function must return false to
	 * indicate a non-match.
	 */
	var objectContains = exports.objectContains = function objectContains(object, value, compareValues) {
	  return ownEnumerableKeys(value).every(function (k) {
	    if (isObject(object[k]) && isObject(value[k])) return objectContains(object[k], value[k], compareValues);
	
	    return compareValues(object[k], value[k]);
	  });
	};
	
	/**
	 * Returns true if the given string contains the value, false otherwise.
	 */
	var stringContains = exports.stringContains = function stringContains(string, value) {
	  return string.indexOf(value) !== -1;
	};

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';
	
	var regexExec = RegExp.prototype.exec;
	var tryRegexExec = function tryRegexExec(value) {
		try {
			regexExec.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var toStr = Object.prototype.toString;
	var regexClass = '[object RegExp]';
	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	
	module.exports = function isRegex(value) {
		if (typeof value !== 'object') { return false; }
		return hasToStringTag ? tryRegexExec(value) : toStr.call(value) === regexClass;
	};


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ObjectPrototype = Object.prototype;
	var toStr = ObjectPrototype.toString;
	var booleanValue = Boolean.prototype.valueOf;
	var has = __webpack_require__(5);
	var isArrowFunction = __webpack_require__(24);
	var isBoolean = __webpack_require__(26);
	var isDate = __webpack_require__(27);
	var isGenerator = __webpack_require__(28);
	var isNumber = __webpack_require__(29);
	var isRegex = __webpack_require__(22);
	var isString = __webpack_require__(30);
	var isSymbol = __webpack_require__(31);
	var isCallable = __webpack_require__(25);
	
	var isProto = Object.prototype.isPrototypeOf;
	
	var foo = function foo() {};
	var functionsHaveNames = foo.name === 'foo';
	
	var symbolValue = typeof Symbol === 'function' ? Symbol.prototype.valueOf : null;
	var symbolIterator = __webpack_require__(32)();
	
	var collectionsForEach = __webpack_require__(33)();
	
	var getPrototypeOf = Object.getPrototypeOf;
	if (!getPrototypeOf) {
		/* eslint-disable no-proto */
		if (typeof 'test'.__proto__ === 'object') {
			getPrototypeOf = function (obj) {
				return obj.__proto__;
			};
		} else {
			getPrototypeOf = function (obj) {
				var constructor = obj.constructor,
					oldConstructor;
				if (has(obj, 'constructor')) {
					oldConstructor = constructor;
					if (!(delete obj.constructor)) { // reset constructor
						return null; // can't delete obj.constructor, return null
					}
					constructor = obj.constructor; // get real constructor
					obj.constructor = oldConstructor; // restore constructor
				}
				return constructor ? constructor.prototype : ObjectPrototype; // needed for IE
			};
		}
		/* eslint-enable no-proto */
	}
	
	var isArray = Array.isArray || function (value) {
		return toStr.call(value) === '[object Array]';
	};
	
	var normalizeFnWhitespace = function normalizeFnWhitespace(fnStr) {
		// this is needed in IE 9, at least, which has inconsistencies here.
		return fnStr.replace(/^function ?\(/, 'function (').replace('){', ') {');
	};
	
	var tryMapSetEntries = function tryMapSetEntries(collection) {
		var foundEntries = [];
		try {
			collectionsForEach.Map.call(collection, function (key, value) {
				foundEntries.push([key, value]);
			});
		} catch (notMap) {
			try {
				collectionsForEach.Set.call(collection, function (value) {
					foundEntries.push([value]);
				});
			} catch (notSet) {
				return false;
			}
		}
		return foundEntries;
	};
	
	module.exports = function whyNotEqual(value, other) {
		if (value === other) { return ''; }
		if (value == null || other == null) {
			return value === other ? '' : String(value) + ' !== ' + String(other);
		}
	
		var valToStr = toStr.call(value);
		var otherToStr = toStr.call(other);
		if (valToStr !== otherToStr) {
			return 'toStringTag is not the same: ' + valToStr + ' !== ' + otherToStr;
		}
	
		var valIsBool = isBoolean(value);
		var otherIsBool = isBoolean(other);
		if (valIsBool || otherIsBool) {
			if (!valIsBool) { return 'first argument is not a boolean; second argument is'; }
			if (!otherIsBool) { return 'second argument is not a boolean; first argument is'; }
			var valBoolVal = booleanValue.call(value);
			var otherBoolVal = booleanValue.call(other);
			if (valBoolVal === otherBoolVal) { return ''; }
			return 'primitive value of boolean arguments do not match: ' + valBoolVal + ' !== ' + otherBoolVal;
		}
	
		var valIsNumber = isNumber(value);
		var otherIsNumber = isNumber(value);
		if (valIsNumber || otherIsNumber) {
			if (!valIsNumber) { return 'first argument is not a number; second argument is'; }
			if (!otherIsNumber) { return 'second argument is not a number; first argument is'; }
			var valNum = Number(value);
			var otherNum = Number(other);
			if (valNum === otherNum) { return ''; }
			var valIsNaN = isNaN(value);
			var otherIsNaN = isNaN(other);
			if (valIsNaN && !otherIsNaN) {
				return 'first argument is NaN; second is not';
			} else if (!valIsNaN && otherIsNaN) {
				return 'second argument is NaN; first is not';
			} else if (valIsNaN && otherIsNaN) {
				return '';
			}
			return 'numbers are different: ' + value + ' !== ' + other;
		}
	
		var valIsString = isString(value);
		var otherIsString = isString(other);
		if (valIsString || otherIsString) {
			if (!valIsString) { return 'second argument is string; first is not'; }
			if (!otherIsString) { return 'first argument is string; second is not'; }
			var stringVal = String(value);
			var otherVal = String(other);
			if (stringVal === otherVal) { return ''; }
			return 'string values are different: "' + stringVal + '" !== "' + otherVal + '"';
		}
	
		var valIsDate = isDate(value);
		var otherIsDate = isDate(other);
		if (valIsDate || otherIsDate) {
			if (!valIsDate) { return 'second argument is Date, first is not'; }
			if (!otherIsDate) { return 'first argument is Date, second is not'; }
			var valTime = +value;
			var otherTime = +other;
			if (valTime === otherTime) { return ''; }
			return 'Dates have different time values: ' + valTime + ' !== ' + otherTime;
		}
	
		var valIsRegex = isRegex(value);
		var otherIsRegex = isRegex(other);
		if (valIsRegex || otherIsRegex) {
			if (!valIsRegex) { return 'second argument is RegExp, first is not'; }
			if (!otherIsRegex) { return 'first argument is RegExp, second is not'; }
			var regexStringVal = String(value);
			var regexStringOther = String(other);
			if (regexStringVal === regexStringOther) { return ''; }
			return 'regular expressions differ: ' + regexStringVal + ' !== ' + regexStringOther;
		}
	
		var valIsArray = isArray(value);
		var otherIsArray = isArray(other);
		if (valIsArray || otherIsArray) {
			if (!valIsArray) { return 'second argument is an Array, first is not'; }
			if (!otherIsArray) { return 'first argument is an Array, second is not'; }
			if (value.length !== other.length) {
				return 'arrays have different length: ' + value.length + ' !== ' + other.length;
			}
			if (String(value) !== String(other)) { return 'stringified Arrays differ'; }
	
			var index = value.length - 1;
			var equal = '';
			var valHasIndex, otherHasIndex;
			while (equal === '' && index >= 0) {
				valHasIndex = has(value, index);
				otherHasIndex = has(other, index);
				if (!valHasIndex && otherHasIndex) { return 'second argument has index ' + index + '; first does not'; }
				if (valHasIndex && !otherHasIndex) { return 'first argument has index ' + index + '; second does not'; }
				equal = whyNotEqual(value[index], other[index]);
				index -= 1;
			}
			return equal;
		}
	
		var valueIsSym = isSymbol(value);
		var otherIsSym = isSymbol(other);
		if (valueIsSym !== otherIsSym) {
			if (valueIsSym) { return 'first argument is Symbol; second is not'; }
			return 'second argument is Symbol; first is not';
		}
		if (valueIsSym && otherIsSym) {
			return symbolValue.call(value) === symbolValue.call(other) ? '' : 'first Symbol value !== second Symbol value';
		}
	
		var valueIsGen = isGenerator(value);
		var otherIsGen = isGenerator(other);
		if (valueIsGen !== otherIsGen) {
			if (valueIsGen) { return 'first argument is a Generator; second is not'; }
			return 'second argument is a Generator; first is not';
		}
	
		var valueIsArrow = isArrowFunction(value);
		var otherIsArrow = isArrowFunction(other);
		if (valueIsArrow !== otherIsArrow) {
			if (valueIsArrow) { return 'first argument is an Arrow function; second is not'; }
			return 'second argument is an Arrow function; first is not';
		}
	
		if (isCallable(value) || isCallable(other)) {
			if (functionsHaveNames && whyNotEqual(value.name, other.name) !== '') {
				return 'Function names differ: "' + value.name + '" !== "' + other.name + '"';
			}
			if (whyNotEqual(value.length, other.length) !== '') {
				return 'Function lengths differ: ' + value.length + ' !== ' + other.length;
			}
	
			var valueStr = normalizeFnWhitespace(String(value));
			var otherStr = normalizeFnWhitespace(String(other));
			if (whyNotEqual(valueStr, otherStr) === '') { return ''; }
	
			if (!valueIsGen && !valueIsArrow) {
				return whyNotEqual(valueStr.replace(/\)\s*\{/, '){'), otherStr.replace(/\)\s*\{/, '){')) === '' ? '' : 'Function string representations differ';
			}
			return whyNotEqual(valueStr, otherStr) === '' ? '' : 'Function string representations differ';
		}
	
		if (typeof value === 'object' || typeof other === 'object') {
			if (typeof value !== typeof other) { return 'arguments have a different typeof: ' + typeof value + ' !== ' + typeof other; }
			if (isProto.call(value, other)) { return 'first argument is the [[Prototype]] of the second'; }
			if (isProto.call(other, value)) { return 'second argument is the [[Prototype]] of the first'; }
			if (getPrototypeOf(value) !== getPrototypeOf(other)) { return 'arguments have a different [[Prototype]]'; }
	
			if (symbolIterator) {
				var valueIteratorFn = value[symbolIterator];
				var valueIsIterable = isCallable(valueIteratorFn);
				var otherIteratorFn = other[symbolIterator];
				var otherIsIterable = isCallable(otherIteratorFn);
				if (valueIsIterable !== otherIsIterable) {
					if (valueIsIterable) { return 'first argument is iterable; second is not'; }
					return 'second argument is iterable; first is not';
				}
				if (valueIsIterable && otherIsIterable) {
					var valueIterator = valueIteratorFn.call(value);
					var otherIterator = otherIteratorFn.call(other);
					var valueNext, otherNext, nextWhy;
					do {
						valueNext = valueIterator.next();
						otherNext = otherIterator.next();
						if (!valueNext.done && !otherNext.done) {
							nextWhy = whyNotEqual(valueNext, otherNext);
							if (nextWhy !== '') {
								return 'iteration results are not equal: ' + nextWhy;
							}
						}
					} while (!valueNext.done && !otherNext.done);
					if (valueNext.done && !otherNext.done) { return 'first argument finished iterating before second'; }
					if (!valueNext.done && otherNext.done) { return 'second argument finished iterating before first'; }
					return '';
				}
			} else if (collectionsForEach.Map || collectionsForEach.Set) {
				var valueEntries = tryMapSetEntries(value);
				var otherEntries = tryMapSetEntries(other);
				var valueEntriesIsArray = isArray(valueEntries);
				var otherEntriesIsArray = isArray(otherEntries);
				if (valueEntriesIsArray && !otherEntriesIsArray) { return 'first argument has Collection entries, second does not'; }
				if (!valueEntriesIsArray && otherEntriesIsArray) { return 'second argument has Collection entries, first does not'; }
				if (valueEntriesIsArray && otherEntriesIsArray) {
					var entriesWhy = whyNotEqual(valueEntries, otherEntries);
					return entriesWhy === '' ? '' : 'Collection entries differ: ' + entriesWhy;
				}
			}
	
			var key, valueKeyIsRecursive, otherKeyIsRecursive, keyWhy;
			for (key in value) {
				if (has(value, key)) {
					if (!has(other, key)) { return 'first argument has key "' + key + '"; second does not'; }
					valueKeyIsRecursive = !!value[key] && value[key][key] === value;
					otherKeyIsRecursive = !!other[key] && other[key][key] === other;
					if (valueKeyIsRecursive !== otherKeyIsRecursive) {
						if (valueKeyIsRecursive) { return 'first argument has a circular reference at key "' + key + '"; second does not'; }
						return 'second argument has a circular reference at key "' + key + '"; first does not';
					}
					if (!valueKeyIsRecursive && !otherKeyIsRecursive) {
						keyWhy = whyNotEqual(value[key], other[key]);
						if (keyWhy !== '') {
							return 'value at key "' + key + '" differs: ' + keyWhy;
						}
					}
				}
			}
			for (key in other) {
				if (has(other, key) && !has(value, key)) {
					return 'second argument has key "' + key + '"; first does not';
				}
			}
			return '';
		}
	
		return false;
	};


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isCallable = __webpack_require__(25);
	var fnToStr = Function.prototype.toString;
	var isNonArrowFnRegex = /^\s*function/;
	var isArrowFnWithParensRegex = /^\([^\)]*\) *=>/;
	var isArrowFnWithoutParensRegex = /^[^=]*=>/;
	
	module.exports = function isArrowFunction(fn) {
		if (!isCallable(fn)) { return false; }
		var fnStr = fnToStr.call(fn);
		return fnStr.length > 0 &&
			!isNonArrowFnRegex.test(fnStr) &&
			(isArrowFnWithParensRegex.test(fnStr) || isArrowFnWithoutParensRegex.test(fnStr));
	};


/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';
	
	var fnToStr = Function.prototype.toString;
	
	var constructorRegex = /^\s*class /;
	var isES6ClassFn = function isES6ClassFn(value) {
		try {
			var fnStr = fnToStr.call(value);
			var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
			var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
			var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
			return constructorRegex.test(spaceStripped);
		} catch (e) {
			return false; // not a function
		}
	};
	
	var tryFunctionObject = function tryFunctionObject(value) {
		try {
			if (isES6ClassFn(value)) { return false; }
			fnToStr.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var toStr = Object.prototype.toString;
	var fnClass = '[object Function]';
	var genClass = '[object GeneratorFunction]';
	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	
	module.exports = function isCallable(value) {
		if (!value) { return false; }
		if (typeof value !== 'function' && typeof value !== 'object') { return false; }
		if (hasToStringTag) { return tryFunctionObject(value); }
		if (isES6ClassFn(value)) { return false; }
		var strClass = toStr.call(value);
		return strClass === fnClass || strClass === genClass;
	};


/***/ },
/* 26 */
/***/ function(module, exports) {

	'use strict';
	
	var boolToStr = Boolean.prototype.toString;
	
	var tryBooleanObject = function tryBooleanObject(value) {
		try {
			boolToStr.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var toStr = Object.prototype.toString;
	var boolClass = '[object Boolean]';
	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	
	module.exports = function isBoolean(value) {
		if (typeof value === 'boolean') { return true; }
		if (typeof value !== 'object') { return false; }
		return hasToStringTag ? tryBooleanObject(value) : toStr.call(value) === boolClass;
	};


/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';
	
	var getDay = Date.prototype.getDay;
	var tryDateObject = function tryDateObject(value) {
		try {
			getDay.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	
	var toStr = Object.prototype.toString;
	var dateClass = '[object Date]';
	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	
	module.exports = function isDateObject(value) {
		if (typeof value !== 'object' || value === null) { return false; }
		return hasToStringTag ? tryDateObject(value) : toStr.call(value) === dateClass;
	};


/***/ },
/* 28 */
/***/ function(module, exports) {

	'use strict';
	
	var toStr = Object.prototype.toString;
	var fnToStr = Function.prototype.toString;
	var isFnRegex = /^\s*(?:function)?\*/;
	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	var getProto = Object.getPrototypeOf;
	var getGeneratorFunc = function () { // eslint-disable-line consistent-return
		if (!hasToStringTag) {
			return false;
		}
		try {
			return Function('return function*() {}')();
		} catch (e) {
		}
	};
	var generatorFunc = getGeneratorFunc();
	var GeneratorFunction = generatorFunc ? getProto(generatorFunc) : {};
	
	module.exports = function isGeneratorFunction(fn) {
		if (typeof fn !== 'function') {
			return false;
		}
		if (isFnRegex.test(fnToStr.call(fn))) {
			return true;
		}
		if (!hasToStringTag) {
			var str = toStr.call(fn);
			return str === '[object GeneratorFunction]';
		}
		return getProto(fn) === GeneratorFunction;
	};


/***/ },
/* 29 */
/***/ function(module, exports) {

	'use strict';
	
	var numToStr = Number.prototype.toString;
	var tryNumberObject = function tryNumberObject(value) {
		try {
			numToStr.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var toStr = Object.prototype.toString;
	var numClass = '[object Number]';
	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	
	module.exports = function isNumberObject(value) {
		if (typeof value === 'number') { return true; }
		if (typeof value !== 'object') { return false; }
		return hasToStringTag ? tryNumberObject(value) : toStr.call(value) === numClass;
	};


/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';
	
	var strValue = String.prototype.valueOf;
	var tryStringObject = function tryStringObject(value) {
		try {
			strValue.call(value);
			return true;
		} catch (e) {
			return false;
		}
	};
	var toStr = Object.prototype.toString;
	var strClass = '[object String]';
	var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	
	module.exports = function isString(value) {
		if (typeof value === 'string') { return true; }
		if (typeof value !== 'object') { return false; }
		return hasToStringTag ? tryStringObject(value) : toStr.call(value) === strClass;
	};


/***/ },
/* 31 */
/***/ function(module, exports) {

	'use strict';
	
	var toStr = Object.prototype.toString;
	var hasSymbols = typeof Symbol === 'function' && typeof Symbol() === 'symbol';
	
	if (hasSymbols) {
		var symToStr = Symbol.prototype.toString;
		var symStringRegex = /^Symbol\(.*\)$/;
		var isSymbolObject = function isSymbolObject(value) {
			if (typeof value.valueOf() !== 'symbol') { return false; }
			return symStringRegex.test(symToStr.call(value));
		};
		module.exports = function isSymbol(value) {
			if (typeof value === 'symbol') { return true; }
			if (toStr.call(value) !== '[object Symbol]') { return false; }
			try {
				return isSymbolObject(value);
			} catch (e) {
				return false;
			}
		};
	} else {
		module.exports = function isSymbol(value) {
			// this environment does not support Symbols.
			return false;
		};
	}


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var isSymbol = __webpack_require__(31);
	
	module.exports = function getSymbolIterator() {
		var symbolIterator = typeof Symbol === 'function' && isSymbol(Symbol.iterator) ? Symbol.iterator : null;
	
		if (typeof Object.getOwnPropertyNames === 'function' && typeof Map === 'function' && typeof Map.prototype.entries === 'function') {
			Object.getOwnPropertyNames(Map.prototype).forEach(function (name) {
				if (name !== 'entries' && name !== 'size' && Map.prototype[name] === Map.prototype.entries) {
					symbolIterator = name;
				}
			});
		}
	
		return symbolIterator;
	};


/***/ },
/* 33 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function () {
		var mapForEach = (function () {
			if (typeof Map !== 'function') { return null; }
			try {
				Map.prototype.forEach.call({}, function () {});
			} catch (e) {
				return Map.prototype.forEach;
			}
			return null;
		}());
	
		var setForEach = (function () {
			if (typeof Set !== 'function') { return null; }
			try {
				Set.prototype.forEach.call({}, function () {});
			} catch (e) {
				return Set.prototype.forEach;
			}
			return null;
		}());
	
		return { Map: mapForEach, Set: setForEach };
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _Expectation = __webpack_require__(4);
	
	var _Expectation2 = _interopRequireDefault(_Expectation);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Extensions = [];
	
	function extend(extension) {
	  if (Extensions.indexOf(extension) === -1) {
	    Extensions.push(extension);
	
	    for (var p in extension) {
	      if (extension.hasOwnProperty(p)) _Expectation2.default.prototype[p] = extension[p];
	    }
	  }
	}
	
	exports.default = extend;

/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map