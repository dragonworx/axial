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

describe('2. Defining Schemas', () => {
  let schema = null;
  let a = null;

  it('2.1 should be able to define a schema without an id', () => {
    schema = Axial.define({
      x: {
        y: {
          z: [Axial.Number, Axial.Boolean]
        }
      }
    });
    expect(schema).toBeA(Axial.Schema.constructor);
  });

  it('2.2 should be able to define a schema with an id', () => {
    schema = Axial.define('schema', {
      x: {
        y: {
          z: [Axial.Number, Axial.Boolean]
        }
      },
      v: Axial.Array(),
      w: Axial.Array(Axial.String)
    });
    expect(schema.prop('schema.x.y.z').schema.name).toBe('schema.x.y');
  });

  it('2.3 should be able to access schema properties by path', () => {
    expect(schema.prop('schema.x').is(Axial.Schema)).toBe(true);
    expect(schema.prop('schema.x').is(Axial.String)).toBe(false);
    expect(schema.prop('schema.x.y.z').is(Axial.Number)).toBe(true);
    expect(schema.prop('schema.x.y.z').is(Axial.Boolean)).toBe(true);
    expect(schema.prop('schema.v').is(Axial.Array())).toBe(true);
    expect(schema.prop('schema.v').is(Axial.Array(Axial.String))).toBe(false);
    expect(schema.prop('schema.w').is(Axial.Array(Axial.String))).toBe(true);
    expect(schema.prop('schema.w').is(Axial.Array(Axial.Number))).toBe(false);
  });
});

describe('3. Creating Instances', () => {
  let schema = Axial.define('schema', {
    x: {
      y: {
        z: [Axial.Number, Axial.Boolean, Axial.Undefined]
      }
    }
  });
  let a = null;

  it('3.1.a should be able to create instances of schemas', () => {
    a = schema.new();
    expect(a).toBeA(Axial.Instance.constructor);
  });

  it('3.1.b should be able to create instances of schemas from default values', () => {
    a = schema.new({
      x: {
        y: {
          z: 1
        }
      }
    });
    expect(a.x).toBeA(Axial.Instance.constructor);
    expect(a.x.y).toBeA(Axial.Instance.constructor);
    expect(a.x.y.z).toBe(1);
  });

  it('3.1.c should be able to create instances of schemas from partial set of default values', () => {
    a = schema.new({
      x: {}
    });
    expect(a.x.y).toBeA(Axial.Instance.constructor);
    a.x.y = {z: 5};
    expect(a.x.y.z).toBe(5);
  });

  it('3.2.a should NOT be allowed to create instance with non-schema property', () => {
    expect(() => {
      schema.new({
        a: 1
      });
    }).toThrow(Axial.UnknownSchemaKey);
  });

  it('3.2.b should NOT be allowed to create instance with invalid type', () => {
    expect(() => {
      schema.new({
        x: {
          y: false
        }
      });
    }).toThrow(Axial.InvalidType);
    expect(() => {
      schema.new({
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
    schema = Axial.define('schema', {
      a: Axial.Array(),
      b: Axial.Array(Axial.String),
      c: Axial.Array(Axial.Object),
      d: Axial.Array(Axial.Array(Axial.String))
    });
    a = schema.new();
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
    schema = Axial.define('schema', {
      a: Axial.Object
    });
    a = schema.new();
    a.a = {x:1};
    expect(() => a.a = false).toThrow(Axial.InvalidType);
    expect(() => a.a = [123]).toThrow(Axial.InvalidType);
  });
});

describe('4. Configuring Schema Property Types', () => {
  let schema;

  it('4.1 should be able to set default property', () => {
    schema = Axial.define({
      x: Axial.Number.define({
        defaultValue: 5
      })
    });
    expect(schema.new().x).toBe(5);
  });


});

describe('5. Listening to instance changes', () => {
  let schema = Axial.define('schema', {
    a: Axial.Object
  });
  let a = schema.new();

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

describe('6. Composite schemas', () => {
  it('6.1 should be able to compose schemas from other schemas', () => {
    let schemaA = Axial.define('schemaA', {
      x: [Axial.String, Axial.Undefined],
      y: {
        z: [Axial.Number, Axial.Undefined]
      }
    });
    let schemaB = Axial.define('schemaB', {
      a: schemaA,
      b: {
        c: [Axial.Number, schemaA]
      }
    });
    let a = schemaB.new();
    expect(() => {
      schemaB.new({
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
      schemaB.new({
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
      schemaB.new({
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
      schemaB.new({
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
      schemaB.new({
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
