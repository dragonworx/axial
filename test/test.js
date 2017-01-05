const util = require('../util');
const Axial = require('../index');
const expect = require('expect');

// Util...
describe('1. Util (Types, Object Manipulation)', () => {
  it('1.1 should determine correct type', () => {
    // Axial supports these well known types
    expect(util.typeOf('abc')).toBe(Axial.STRING);
    expect(util.typeOf(-3.5)).toBe(Axial.NUMBER);
    expect(util.typeOf(false)).toBe(Axial.BOOLEAN);
    expect(util.typeOf([])).toBe(Axial.ARRAY());
    expect(util.typeOf(['abc'])).toBe(Axial.ARRAY(Axial.STRING));
    expect(util.typeOf([3])).toBe(Axial.ARRAY(Axial.NUMBER));
    expect(util.typeOf([true])).toBe(Axial.ARRAY(Axial.BOOLEAN));
    expect(util.typeOf({x:1})).toBe(Axial.OBJECT);
    expect(util.typeOf(/abc/)).toBe(Axial.REGEX);
    expect(util.typeOf(new Date())).toBe(Axial.DATE);
    expect(util.typeOf(function () {})).toBe(Axial.FUNCTION);
    expect(util.typeOf(undefined)).toBe(Axial.UNDEFINED);
    expect(util.typeOf(null)).toBe(Axial.NULL);
  });

  it('1.2 should detect Axial type', () => {
    expect(util.isType([Axial.ANY, Axial.STRING])).toBe(true);
    expect(util.isType([3, Axial.STRING])).toBe(false);
    expect(util.isType(3)).toBe(false);
    expect(util.isType({})).toBe(false);
    expect(util.isType(Axial.ANY)).toBe(true);
    expect(util.isType(Axial.STRING)).toBe(true);
    expect(util.isType(Axial.NUMBER)).toBe(true);
    expect(util.isType(Axial.BOOLEAN)).toBe(true);
    expect(util.isType(Axial.OBJECT)).toBe(true);
    expect(util.isType(Axial.REGEX)).toBe(true);
    expect(util.isType(Axial.DATE)).toBe(true);
    expect(util.isType(Axial.FUNCTION)).toBe(true);
    expect(util.isType(Axial.NULL)).toBe(true);
    expect(util.isType(Axial.UNDEFINED)).toBe(true);
    expect(util.isType(Axial.UNKNOWN)).toBe(true);
    expect(util.isType(Axial.BRANCH)).toBe(true);
    expect(util.isType(Axial.ARRAY(Axial.ANY))).toBe(true);
    expect(util.isType(Axial.ARRAY(Axial.STRING))).toBe(true);
    expect(util.isType(Axial.ARRAY(Axial.NUMBER))).toBe(true);
    expect(util.isType(Axial.ARRAY(Axial.BOOLEAN))).toBe(true);
    expect(util.isType(Axial.ARRAY(Axial.OBJECT))).toBe(true);
    expect(util.isType(Axial.ARRAY(Axial.REGEX))).toBe(true);
    expect(util.isType(Axial.ARRAY(Axial.DATE))).toBe(true);
    expect(util.isType(Axial.ARRAY(Axial.FUNCTION))).toBe(true);
    expect(util.isType(Axial.ARRAY(Axial.NULL))).toBe(true);
    expect(util.isType(Axial.ARRAY(Axial.UNDEFINED))).toBe(true);
    expect(util.isType(Axial.ARRAY(Axial.UNKNOWN))).toBe(true);
    expect(util.isType(Axial.ARRAY(Axial.BRANCH))).toBe(true);
  });

  it('1.3 should determine correct array types', () => {
    // working with strongly typed arrays
    expect(util.isArray(Axial.ARRAY())).toBe(true);
    expect(util.isArray(Axial.ARRAY(Axial.STRING))).toBe(true);
    expect(util.isTypedArray(Axial.ARRAY())).toBe(false);
    expect(util.isTypedArray(Axial.ARRAY(Axial.STRING))).toBe(true);
    expect(util.getArrayType(Axial.ARRAY(Axial.STRING))).toBe(Axial.STRING);
    expect(util.getArrayType(Axial.ARRAY(Axial.NUMBER))).toBe(Axial.NUMBER);
  });
});

// Define schema...
describe('2. Defining the Schema', () => {
  it('2.1 should be able to define a schema using path or object', () => {
    // you can define a schema using an object of key values to describe types
    Axial.define({
      a: {
        b: {
          c: Axial.STRING
        },
        d: Axial.NUMBER
      },
      x: {
        y: Axial.DATE
      }
    });

    // or you can define a single path key (lazy initialises object branches) with it's type
    Axial.define('z', Axial.ARRAY(Axial.STRING));

    expect(Axial.paths()).toEqual(['a', 'a.b', 'a.b.c', 'a.d', 'x', 'x.y', 'z']);
  });

//  it('2.2 should throw "AxialPathExists" if defining existing path', () => {
//    expect(() => {
//      // you cant wipe over existing paths
//      Axial.define('x', Axial.STRING);
//    }).toThrow();
//
//    expect(() => {
//      // there is already an "a.b.c" path
//      Axial.define('a.b', Axial.STRING);
//    }).toThrow();
//  });

  it('2.3 should be able to undefine and redefine', () => {
    // remove "x" path from the schema
    Axial.undefine('x');
    expect(Axial.paths()).toEqual(['a', 'a.b', 'a.b.c', 'a.d', 'z']);

    // redefine it again
    Axial.define('x', Axial.NUMBER);
    expect(Axial.paths()).toEqual(['a', 'a.b', 'a.b.c', 'a.d', 'x', 'z']);
  });

  it('2.4 should be able to lock paths so they cant be undefined', () => {
    // locking is a one-way operation (per application session)
    Axial.lock('a.d');
    expect(() => {
      // now we can't undefine it...
      Axial.undefine('a.d');
      // this allows a provider to create a schema that consumers cannot change
    }).toThrow();
  });

  it('2.5 should be able to define multiple types with arrays of types', () => {
    Axial.define('i', [Axial.STRING, Axial.ARRAY(Axial.NUMBER)]);
    expect(() => {
      Axial.set('i', {});
    }).toThrow();

    expect(() => {
      Axial.set('i', [2, 'foo']);
    }).toThrow();

    expect(() => {
      Axial.set('i', 'foo');
      Axial.set('i', [5,6]);
    }).toNotThrow();
  });
});


describe('3. Defining Custom Schema Types', () => {
  it('3.1 should be able to define a custom type from definition object', () => {
    Axial.defineType('a', {
      x: {
        y: {
          z: Axial.STRING
        },
        w: Axial.NUMBER
      }
    });
    expect(Axial.A).toBe('<a>');
  });

  it('3.2 should be able to define a custom type from an enum type', () => {
    Axial.defineType('b', Axial.NUMBER);
    expect(Axial.B).toBe('<b>');
  });

  it('3.3 should identify custom types correctly', () => {
    expect(util.isCustomType(Axial.A)).toBe(true);
    expect(util.isCustomType(Axial.B)).toBe(true);
    expect(util.getCustomTypeKey(Axial.A)).toBe('A');
    expect(util.getCustomTypeKey(Axial.B)).toBe('B');
  });

  it('3.4 should be able to define custom types', () => {
    Axial.define({
      custom: {
        a: Axial.A,
        b: Axial.B
      }
    });

  });

  it('3.5 should be able to lazy-set sub properties of custom types', () => {
    Axial.set('custom.a.x.y.z', 'foo');
    expect(Axial.get('custom.a.x.y.z')).toBe('foo');
  });

  it('3.6 should be able to set custom types', () => {
    Axial.set({
      custom: {
        a: {
          x: {
            y: {
              z: 'barz'
            }
          }
        }
      }
    });
    Axial.set('custom.a.x.w', 3);
    expect(Axial.get('custom.a.x.y.z')).toBe('barz');
    expect(Axial.get('custom.a.x.w')).toBe(3);
  });

  it('3.7 should be able to define arrays of custom types', () => {
    Axial.define('custom.array', Axial.ARRAY(Axial.A));
    Axial.set('custom.array', [{x:{y:{z:'foo'}}}]);
    expect(Array.isArray(Axial.get('custom.array'))).toBe(true);
  });

  it('3.8 should be to define sub properties as custom types', () => {
    Axial.defineType('c', {
      a: Axial.A,
      b: Axial.ARRAY(Axial.B)
    });
    Axial.define({
      custom: {
        c: [Axial.C, Axial.BOOLEAN]
      }
    })
  })
});

// Set Values...
describe('4. Setting Values', () => {
  it('4.1 should return "null" for path without value', () => {
    // null is used for empty / initial / unset state
    expect(Axial.get('z')).toBe(null);
  });

  it('4.2 should be able to set path or object value', () => {
    // as long as its the correct type, you can set a value by path and value
    Axial.set('z', ['abc']);
    Axial.set('x', 6);
    expect(Axial.get('x')).toBe(6);
    // or you can update a bunch of paths at once using a deep object
    Axial.set({
      a: {
        b: {
          c: 'foo'
        }
      },
      'x': 7
    });
    expect(Axial.get('a.b.c')).toBe('foo');
    expect(Axial.get('x')).toBe(7);
  });

  it('4.3 should throw "AxialUndefinedPath" if setting non-existent path', () => {
    expect(() => {
      Axial.set('does.not.exist', true);
    }).toThrow();
  });

  it('4.4 should throw "AxialInvalidType" if setting invalid primitive type', () => {
    expect(() => {
      Axial.set('x', 'not a number');
    }).toThrow();
    expect(() => {
      Axial.set('a.d', {});
    }).toThrow();
  });

  it('4.5 should throw "AxialInvalidType" if setting invalid array type', () => {
    expect(() => {
      Axial.set('x', 'not a number');
    }).toThrow();
    expect(() => {
      Axial.set('z', [true]);
    }).toThrow();
  });

  it('4.6 should be able to add any type for array defined without type', () => {
    Axial.define('w', Axial.ARRAY());
    Axial.set('w', []);
    Axial.set('w', [1]);
    Axial.set('w', [2]);
    Axial.set('w', ['1']);
  });

  it('4.7 should be able to set any value for "Axial.ANY" type', () => {
    Axial.define('j', Axial.ANY);
    expect(() => {
      Axial.set('j', 'foo');
      Axial.set('j', 2);
      Axial.set('j', () => {});
    }).toNotThrow();
  });
});

after(() => {
  Axial.dump();
});