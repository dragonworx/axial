const util = require('../util');
const Axial = require('../index');
const expect = require('expect');

describe('Util', () => {
  it('should determine correct type', () => {
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
  });

  it('should determine correct array types', () => {
    expect(util.isArray(Axial.ARRAY())).toBe(true);
    expect(util.isArray(Axial.ARRAY(Axial.STRING))).toBe(true);
    expect(util.isTypedArray(Axial.ARRAY())).toBe(false);
    expect(util.isTypedArray(Axial.ARRAY(Axial.STRING))).toBe(true);
    expect(util.getArrayType(Axial.ARRAY(Axial.STRING))).toBe(Axial.STRING);
  });
});

describe('Define Schema', () => {
  it('should be able to define a schema using pathOrObject', () => {
    /**
     * you can define a schema using an object map to types:
     */
    Axial.define({
      a: {
        b: {
          c: Axial.STRING
        },
        d: Axial.NUMBER
      },
      x: {
        y: 1
      }
    });
    /**
     * or you can define a single path key type value pair.
     */
    Axial.define('z', Axial.ARRAY(Axial.STRING));

    expect(Axial.paths()).toEqual(['a.b.c', 'a.d', 'x.y', 'z']);
  });

  it('should obliterate paths with new definitions', () => {
    Axial.define('x', Axial.NUMBER);
    expect(Axial.paths()).toEqual(['a.b.c', 'a.d', 'z', 'x']);
  });
});

describe('Set Values', () => {
  it('should be able to set pathOrObject value', () => {
    Axial.set('z', ['abc']);
    Axial.set('x', 6);
    expect(Axial.get('x')).toBe(6);
    Axial.set({'a.b.c':'foo', 'x': 7});
    expect(Axial.get('a.b.c')).toBe('foo');
    expect(Axial.get('x')).toBe(7);
  });

  it('should throw "AxialUndefinedPath" if setting non-existent path', () => {
    expect(() => {
      Axial.set('does.not.exist', true);
    }).toThrow(Axial.ERROR.AxialUndefinedPath);
  });

  it('should throw "AxialInvalidType" if setting invalid primitive type', () => {
    expect(() => {
      Axial.set('x', 'not a number');
    }).toThrow(Axial.ERROR.AxialInvalidType);
    expect(() => {
      Axial.set('a.d', {});
    }).toThrow(Axial.ERROR.AxialInvalidType);
  });

  it('should throw "AxialInvalidType" if setting invalid array type', () => {
    expect(() => {
      Axial.set('x', 'not a number');
    }).toThrow(Axial.ERROR.AxialInvalidType);
    expect(() => {
      Axial.set('z', [true]);
    }).toThrow(Axial.ERROR.AxialInvalidType);
  });

  it('should be able to set any type for array defined without type', () => {
    Axial.define('w', Axial.ARRAY());
    Axial.set('w', []);
    Axial.set('w', [1]);
    Axial.set('w', [2]);
    Axial.set('w', ['1']);
  });
});

after(() => {
  Axial.dump();
  Axial.dump(true);
});