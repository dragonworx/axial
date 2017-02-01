const Axial = require('../lib/axial');
const util = Axial.util;
const expect = require('expect');

describe('1. Types', () => {
  it('1.1 should determine correct types', () => {
    expect(util.typeOf(null)).toBe(Axial.Null);
    expect(util.typeOf(undefined)).toBe(Axial.Undefined);
    expect(util.typeOf('abc')).toBe(Axial.String);
    expect(util.typeOf(123)).toBe(Axial.Number);
    expect(util.typeOf(true)).toBe(Axial.Boolean);
    expect(util.typeOf(false)).toBe(Axial.Boolean);
    expect(util.typeOf(new Date)).toBe(Axial.Date);
    expect(util.typeOf(/abc/)).toBe(Axial.Regex);
    expect(util.typeOf(function () {})).toBe(Axial.Function);
    expect(util.typeOf([])).toBe(Axial.Array());
    expect(util.typeOf(['abc'])).toBe(Axial.Array(Axial.String));
    expect(util.typeOf([123])).toBe(Axial.Array(Axial.Number));
    expect(util.typeOf({})).toBe(Axial.Object);
  });
});

describe('2. Defining Interfaces', () => {
  let iface = null;
  let a = null;

  it('2.1 should be able to define an interface without a name', () => {
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

  it('2.2 should be able to define an interface with a name', () => {
    iface = Axial.define('iface', {
      'x.y.z': [Axial.Number, Axial.Boolean],
      v: Axial.Array(),
      w: Axial.Array(Axial.String)
    });
    expect(iface.prop('iface.x.y.z').iface.name).toBe('iface.x.y');
  });

  it('2.3 should be able to access interface properties by path', () => {
    expect(iface.prop('iface.x').is(Axial.Interface)).toBe(true);
    expect(iface.prop('iface.x').is(Axial.String)).toBe(false);
    expect(iface.prop('iface.x.y.z').is(Axial.Number)).toBe(true);
    expect(iface.prop('iface.x.y.z').is(Axial.Boolean)).toBe(true);
    expect(iface.prop('iface.v').is(Axial.Array())).toBe(true);
    expect(iface.prop('iface.v').is(Axial.Array(Axial.String))).toBe(false);
    expect(iface.prop('iface.w').is(Axial.Array(Axial.String))).toBe(true);
    expect(iface.prop('iface.w').is(Axial.Array(Axial.Number))).toBe(false);
  });

  it('2.4 should not be able to define the same type more than once', () => {
    expect(() => {
      Axial.define({
        x: [Axial.String, Axial.Number, Axial.String]
      });
    }).toThrow(Axial.TypeAlreadyDefined);
    expect(() => {
      Axial.define({
        x: [Axial.Array(), Axial.Number, Axial.Array()]
      });
    }).toThrow(Axial.TypeAlreadyDefined);
    expect(() => {
      Axial.define({
        x: [Axial.Array(Axial.String), Axial.Array(Axial.Number), Axial.Array(Axial.String)]
      });
    }).toThrow(Axial.TypeAlreadyDefined);
  });
});

describe('3. Creating Instances', () => {
  let iface = Axial.define('iface', {
    x: {
      y: {
        z: [Axial.Number, Axial.Boolean, Axial.Undefined]
      }
    },
    a: {
      b: Axial.Function
    }
  });
  let a = null;

  it('3.1.a should be able to create instances of interfaces', () => {
    a = iface.new();
    expect(a).toBeA(Axial.Instance.constructor);
  });

  it('3.1.b should be able to create instances of interfaces with given values', () => {
    a = iface.new({
      'x.y.z': 6,
      a: {
        b: function () {
          return this._root.x.y.z;
        }
      }
    });
    expect(a.x).toBeA(Axial.Instance.constructor);
    expect(a.x.y).toBeA(Axial.Instance.constructor);
    expect(a.x.y.z).toBe(6);
    expect(a.a.b()).toBe(6);
  });

  it('3.1.c should be able to create instances of interfaces from partial set of given values', () => {
    a = iface.new({
      x: {}
    });
    expect(a.x.y).toBeA(Axial.Instance.constructor);
    a.x.y = {z: 5};
    expect(a.x.y.z).toBe(5);
  });

  it('3.2.a should NOT be allowed to create instance with non-interface properties', () => {
    expect(() => {
      iface.new({
        a: 1
      });
    }).toThrow(Axial.UnknownInterfaceKey);
  });

  it('3.2.b should NOT be allowed to create instance with invalid type', () => {
    expect(() => {
      iface.new({
        x: {
          y: false
        }
      });
    }).toThrow(Axial.InvalidType);
    expect(() => {
      iface.new({
        x: {
          y: {
            z: 'foo'
          }
        }
      });
    }).toThrow(Axial.InvalidType);
  });

  it('3.3 should be able to set multiple types', () => {
    expect(() => {
      a.x.y.z = 5;
      a.x.y.z = false;
    }).toNotThrow();
    expect(() => {
      a.x.y.z = {};
    }).toThrow(Axial.InvalidType);
  });

  it('3.4 should be able to use arrays', () => {
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
    a.c = [{x:1}];
    a.d = [];
    a.d = [['abc'], ['efg']];
    expect(() => a.a = false).toThrow(Axial.InvalidType);
    expect(() => a.b = [123]).toThrow(Axial.InvalidType);
    expect(() => a.c = [[]]).toThrow(Axial.InvalidType);
    expect(() => a.c = [[123]]).toThrow(Axial.InvalidType);
  });

  it('3.5 should be able to use objects', () => {
    iface = Axial.define('iface', {
      a: Axial.Object
    });
    a = iface.new();
    a.a = {x:1};
    expect(() => a.a = false).toThrow(Axial.InvalidType);
    expect(() => a.a = [123]).toThrow(Axial.InvalidType);
  });
});

describe('4. Configuring Interface Property Types', () => {
  let iface;

  it('4.1 should be able to set default property', () => {
    iface = Axial.define({
      x: Axial.Number.extend({
        defaultValue: 5,
        min: -10,
        max: 10
      }),
      y: Axial.String.extend({
        pattern: /foo/
      }),
      a: Axial.String.extend({
        validator: value => {
          if (value !== 'baz') {
            throw new Error('Not a baz!');
          }
        }
      }),
      b: Axial.Number.extend({
        validator: value => {
          if (value % 10 !== 0) {
            throw new Error('Must be multiple of 10');
          }
        }
      })
    });
    expect(iface.new().x).toBe(5);
  });

  it('4.2 should be able to set min/max values for numbers', () => {
    expect(() => {
      iface.new({x:-11});
    }).toThrow(Axial.InvalidNumericType);
    expect(() => {
      iface.new({x:11});
    }).toThrow(Axial.InvalidNumericType);
  });

  it('4.3 should be able to match a string with a regex pattern', () => {
    expect(() => {
      iface.new({y:'bah'});
    }).toThrow(Axial.InvalidStringPattern);
    expect(() => {
      iface.new({y:'foo'});
    }).toNotThrow();
  });

  it('4.4 should be able to supply custom validator function', () => {
    expect(() => {
      iface.new({a:'bah'});
    }).toThrow();
    expect(() => {
      iface.new({a:'baz'});
    }).toNotThrow();
    expect(() => {
      iface.new({b:1000});
    }).toNotThrow();
    expect(() => {
      iface.new({b:12});
    }).toThrow();
  });
});

describe('5. Listening to instance changes', () => {
  let iface = Axial.define('iface', {
    a: Axial.Object
  });
  let a = iface.new();

  it('5.1 should be able to listen to set property changes of instances (global/local)', () => {
    let handlerCount = 0;
    const fn = eventData => {
      expect(eventData.method).toBe('set');
      expect(eventData.value.y).toBe(5);
      handlerCount++;
    };
    Axial.bind(fn);
    a._bind('a', fn);
    a.a = {y:5};
    a._unbind();
    Axial.unbind();
    expect(handlerCount).toBe(2);
  });

  it('5.2 should be able to listen to get property changes of instances (global/local)', () => {
    let handlerCount = 0;
    const fn = eventData => {
      expect(eventData.method).toBe('get');
      expect(eventData.value.y).toBe(5);
      handlerCount++;
    };
    Axial.bind(fn);
    a._bind('a', fn);
    const test = a.a;
    a._unbind();
    Axial.unbind();
    expect(handlerCount).toBe(2);
  });
});

describe('6. Composite interfaces', () => {
  it('6.1 should be able to compose interfaces from other interfaces', () => {
    let ifaceA = Axial.define('ifaceA', {
      x: [Axial.String, Axial.Undefined],
      y: {
        z: [Axial.Number, Axial.Undefined]
      }
    });
    let ifaceB = Axial.define('ifaceB', {
      a: ifaceA,
      b: {
        c: [Axial.Number, ifaceA]
      }
    });
    let a = ifaceB.new();
    expect(() => {
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
    expect(() => {
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
    expect(() => {
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
      })
    }).toNotThrow();
    expect(() => {
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
      })
    }).toNotThrow();
    expect(() => {
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
      })
    }).toThrow();
  });
});
