const Axial = require('../lib/axial');
const util = Axial.util;
const expect = require('expect');
const PROXY = Axial.PROXY_KEY;

if (typeof window !== 'undefined') {
  window.Axial = Axial;
  Axial.addDefaultLogListeners();
}

window.debug = false;
Object.defineProperty(window, '$debug', {
  get: function () {
    window.debug = true;
  }
});

//$debug

describe('1. Types', () => {
  it('1.1 should determine correct types', () => {
    // return as type instances
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
    // check name of type
    expect(util.typeOf(null).id).toBe('null');
    expect(util.typeOf(undefined).id).toBe('undefined');
    expect(util.typeOf('abc').id).toBe('string');
    expect(util.typeOf(123).id).toBe('number');
    expect(util.typeOf(true).id).toBe('boolean');
    expect(util.typeOf(false).id).toBe('boolean');
    expect(util.typeOf(new Date).id).toBe('date');
    expect(util.typeOf(/abc/).id).toBe('regex');
    expect(util.typeOf(function () {}).id).toBe('function');
    expect(util.typeOf([]).id).toBe('array[*]');
    expect(util.typeOf([]).type).toBe(undefined);
    expect(util.typeOf(['abc']).id).toBe('array[string]');
    expect(util.typeOf(['abc']).type.id).toBe('string');
    expect(util.typeOf([1,2,3]).id).toBe('array[number]');
    expect(util.typeOf([1,2,3]).type.id).toBe('number');
    expect(util.typeOf({}).id).toBe('object');
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
    expect(iface.prop('iface.x.y.z').iface.id).toBe('iface.x.y');
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

  it('2.5 should be able to define multiple interface with same name (as stack)', () => {
    const a = Axial.define('iface25', {
      a: Axial.String
    });
    expect(Axial.getInterface('iface25').has('a')).toBe(true);
    const b = Axial.define('iface25', {
      b: Axial.String
    });
    expect(Axial.getInterface('iface25').has('a')).toBe(false);
    expect(Axial.getInterface('iface25').has('b')).toBe(true);
    const c = Axial.define('iface25', {
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

  it('2.6 should be able to test equality of interfaces to objects', () => {
    const iface26A = Axial.define('iface26A', {
      a: Axial.String,
      b: Axial.Number
    });
    const iface26B = Axial.define('iface26B', {
      a: Axial.Boolean,
      b: iface26A
    });
    const instA = iface26B.new({
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

describe('3. Creating Instances', () => {
  let iface;
  let a = null;

  before(() => {
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

  it('3.1.b should be able to create instances of interfaces with given values', () => {
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
        b: function () {
          return this[PROXY].rootContainer.x.y.z;
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
    expect(() => {
      iface.new({
        a: {
          b: 3
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
    expect(Axial.proxy(a).stringify()).toBe('{"a":[],"b":["abc"],"c":[{"x":1}],"d":[["abc"],["efg"]]}');
  });

  it('3.5 should be able to use objects', () => {
    iface = Axial.define('iface', {
      a: Axial.Object
    });
    a = iface.new();
    a.a = {x:1};
    expect(() => a.a = null).toThrow(Axial.InvalidType);
    expect(() => a.a = [123]).toThrow(Axial.InvalidType);
  });

  it('3.6 should NOT be able to create empty instances with required properties', () => {
    iface = Axial.define({
      a: [Axial.String.required()]
    });
    expect(() => {
      a = iface.new();
    }).toThrow();
    expect(() => {
      a = iface.new({
        a: 'foo'
      });
    }).toNotThrow();
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
        defaultValue: 'foo',
        pattern: /foo/
      }),
      a: Axial.String.extend({
        defaultValue: 'baz',
        validate: value => {
          if (value !== 'baz') {
            throw new Error('Not a baz!');
          }
        }
      }),
      b: Axial.Number.extend({
        validate: value => {
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
    a[PROXY].bind('a', fn);
    a.a = {y:5};
    a[PROXY].unbind();
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
    a[PROXY].bind('a', fn);
    const test = a.a;
    a[PROXY].unbind();
    Axial.unbind();
    expect(handlerCount).toBe(2);
  });
});

describe('6. Composite interfaces', () => {
  let ifaceA, ifaceB;

  it('6.1 should be able to compose interfaces from other interfaces', () => {
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

  it('6.2 should be able to test whether an object matches an interface', () => {
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
      y: {}  //<- partial value ok
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
          x: 3,  //<- error
          y: {
            z: 1
          }
        }
      }
    })).toBe(false);
  });
});

describe('7. Arrays', () => {
  it('7.1.a should detect nested array types', () => {
    expect(Axial.Array(Axial.Array(Axial.Array(Axial.String))).is([[['abc']]])).toBe(true);
    expect(Axial.Array(Axial.Array(Axial.Array(Axial.String))).is([[[3]]])).toBe(false);
    expect(Axial.Array(Axial.Array(Axial.Array(Axial.String))).is([[['abc', 3]]])).toBe(false);
  });

  it('7.1.b should detect complex array types' , () => {
    const subIFace = Axial.define({
      x: Axial.String
    });
    const iface = Axial.define({
      a: Axial.Array(Axial.Array(subIFace))
    });
    expect(() => iface.new({a:[[{x:'foo'}]]})).toNotThrow();
    expect(() => iface.new({a:[[{x:1}]]})).toThrow();
    expect(() => iface.new({a:[[{y:'foo'}]]})).toThrow();
    expect(iface.new({a:[[{x:'foo'}]]}).a[0][0].constructor).toBe(Axial.Instance.constructor);
    expect(iface.new({a:[[{x:'foo'}]]}).a[0][0][PROXY].iface).toBe(subIFace);
  });

  it('7.2 should be able to bind array mutations to instance values', () => {
    const IFace = Axial.define({
      a: Axial.Array(Axial.Number)
    });
    const instance = IFace.new({
      a: [1, 2, 3]
    });
    const array = instance.a;
    const proxy = instance[PROXY];
    let dispatch = 0;

    // get indexes
    proxy.bind('a', e => {
      expect(e.method).toBe('get');
      expect(e.arrayMethod).toBe('index');
      expect(e.index).toBe(2);
      expect(e.value).toEqual(3);
      dispatch++;
    });
    expect(array[2]).toBe(3);
    proxy.unbind('a');

    // get indexes
    proxy.bind('a', e => {
      expect(e.method).toBe('set');
      expect(e.arrayMethod).toBe('index');
      expect(e.index).toBe(2);
      expect(e.value).toEqual(6);
      dispatch++;
    });
    array[2] = 6;
    proxy.unbind('a');

    // copyWithin
    proxy.bind('a', e => {
      expect(e.arrayMethod).toBe('copyWithin');
      expect(array.length).toBe(3);
      expect(array.array).toEqual([2,6,6]);
      dispatch++;
    });
    array.copyWithin(0, 1);
    proxy.unbind('a');

    // fill
    proxy.bind('a', e => {
      expect(e.arrayMethod).toBe('fill');
      expect(array.length).toBe(3);
      expect(array.array).toEqual([4,4,4]);
      dispatch++;
    });
    array.fill(4);
    proxy.unbind('a');

    // pop
    proxy.bind('a', e => {
      expect(e.arrayMethod).toBe('pop');
      expect(array.length).toBe(2);
      expect(array.array).toEqual([4,4]);
      dispatch++;
    });
    array.pop();
    proxy.unbind('a');

    // push
    proxy.bind('a', e => {
      expect(e.arrayMethod).toBe('push');
      expect(array.length).toBe(3);
      expect(array.array).toEqual([4,4,5]);
      dispatch++;
    });
    array.push(5);
    proxy.unbind('a');

    // reverse
    proxy.bind('a', e => {
      expect(e.arrayMethod).toBe('reverse');
      expect(array.length).toBe(3);
      expect(array.array).toEqual([5,4,4]);
      dispatch++;
    });
    array.reverse();
    proxy.unbind('a');

    // shift
    proxy.bind('a', e => {
      expect(e.arrayMethod).toBe('shift');
      expect(array.length).toBe(2);
      expect(array.array).toEqual([4,4]);
      dispatch++;
    });
    expect(array.shift()).toBe(5);
    proxy.unbind('a');

    // sort
    array.push(3);
    proxy.bind('a', e => {
      expect(e.arrayMethod).toBe('sort');
      expect(array.length).toBe(3);
      expect(array.array).toEqual([3,4,4]);
      dispatch++;
    });
    array.sort((a, b) => {
      return a < b ? -1 : a > b ? 1 : 0;
    });
    proxy.unbind('a');

    // splice
    let round = 1;
    proxy.bind('a', e => {
      expect(e.arrayMethod).toBe('splice');
      if (round === 1) {
        expect(array.length).toBe(2);
        expect(array.array).toEqual([3,4]);
      } else if (round === 2) {
        expect(array.length).toBe(5);
        expect(array.array).toEqual([1,2,3,3,4]);
      } else {
        throw new Error('Too many rounds!');
      }
      round++;
      dispatch++;
    });
    array.splice(1, 1);
    array.splice(0, 0, 1,2,3);
    proxy.unbind('a');

    // unshift
    proxy.bind('a', e => {
      expect(e.arrayMethod).toBe('unshift');
      expect(array.length).toBe(7);
      expect(array.array).toEqual([7,8,1,2,3,3,4]);
      dispatch++;
    });
    expect(array.unshift(7,8)).toBe(7);
    proxy.unbind('a');

    expect(dispatch).toBe(12);
  });

  it('7.3 should not be able to add illegal type to typed array', () => {
    const Item = Axial.define({text: Axial.String});
    const List = Axial.define({items: Axial.Array(Item)});
    const list = List.new();
    const validItem = Item.new({text:'valid'});
    const invalidItem = {foo:'bar'};
    list.items.add(validItem);
    expect(() => {
      list.items.add(invalidItem);
    }).toThrow();
    expect(list.items.contains(validItem)).toBe(true);
    expect(list.items.contains(invalidItem)).toBe(false);
    list.items.remove(validItem);
    expect(list.items.isEmpty).toBe(true);
    expect(list.items.contains(validItem)).toBe(false);
  });

  it('7.4 should convert arrays to AxialInstanceArray', () => {
    const iface = Axial.define({
      a: Axial.Array(Axial.Array(Axial.Number))
    });
    const inst = iface.new({a:[[123]]});
    expect(inst.a).toBeA(Axial.InstanceArray);
    expect(inst.a[0].constructor).toBeA(Axial.InstanceArray.constructor);
    expect(inst.a[0][0].constructor).toBeA(Axial.InstanceArray.constructor);
  });

  it('7.5 should convert plain objects to AxialInstances', () => {
    const iface = Axial.define({
      a: Axial.String
    });
    const aiface = Axial.define({
      x: Axial.Array(iface)
    });
    const inst = aiface.new({x:[{a:'abc'}]});
    expect(inst.x[0].constructor).toBe(Axial.Instance.constructor);
    inst.x[0] = {a:'efg'};
    expect(inst.x[0].constructor).toBe(Axial.Instance.constructor);
    expect(inst.x[0].a).toBe('efg');
  });
});

describe('8. Interface Inheritance', () => {
  let ifaceA, ifaceB, ifaceC;
  let inst;

  it('8.1 should be able to define interfaces which inherit from another interface', () => {
    ifaceA = Axial.define('ifaceA', {
      a: Axial.String.set('a'),
      foo: Axial.String,
      who: Axial.Function.set(x => {
        return 'ifaceA-' + x;
      })
    });

    ifaceB = ifaceA.extend('ifaceB', {
      b: Axial.String.set('b'),
      foo: Axial.Number,
      who: Axial.Function.set(x => {
        return 'ifaceB-' + x;
      })
    });

    ifaceC = ifaceB.extend('ifaceC', {
      c: Axial.String.set('c'),
      foo: Axial.Boolean,
      who: Axial.Function.set(x => {
        return 'ifaceC-' + x;
      })
    });
  });

  it('8.2.a interface should be able to inherit from another interface by one level', () => {
    inst = ifaceB.new();
    expect(() => {
      inst.foo = 'string'; // invalid input
    }).toThrow();
    expect(() => {
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

  it('8.2.b interface should be able to to inherit from another interface by multiple levels', () => {
    inst = ifaceC.new();
    expect(() => {
      inst.foo = 3; // invalid input
    }).toThrow();
    expect(() => {
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