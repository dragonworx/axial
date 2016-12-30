// http://stackoverflow.com/questions/33870684/why-doesnt-instanceof-work-on-instances-of-error-subclasses-under-babel-node
function ExtendableBuiltin (cls){
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }

  ExtendableBuiltin.prototype = Object.create(cls.prototype);
  Object.setPrototypeOf(ExtendableBuiltin, cls);

  return ExtendableBuiltin;
}

const ERROR = {
  AxialPathNotFound: class AxialPathNotFound extends ExtendableBuiltin(Error) {},
  AxialArrayExpected: class AxialArrayExpected extends ExtendableBuiltin(Error) {}
};

const TYPE = {
  '*': '<any>',
  STRING: '<string>',
  NUMBER: '<number>',
  BOOLEAN: '<boolean>',
  ARRAY: function (type) {
    return `<array>[${type || '*'}]`;
  },
  OBJECT: '<object>',
  REGEX: '<regex>',
  DATE: '<date>',
  FUNCTION: '<function>',
  NULL: '<null>',
  UNDEFINED: '<undefined>',
  UNKNOWN: '<unknown>'
};

let util = {
  logEnabled: false,
  log () {
    if (this.logEnabled) {
      console.log.apply(console, arguments);
    }
  },

  error () {
    if (this.logEnabled) {
      console.error.apply(console, arguments);
    }
  },

  isObject (o) {
    let t = o;
    return typeof o !== 'object' || o === null ?
      false :
      (function () {
        while (!false) {
          if (Object.getPrototypeOf(t = Object.getPrototypeOf(t)) === null) {
            break;
          }
        }
        return Object.getPrototypeOf(o) === t;
      })();
  },

  getObjectPaths (obj, includeBranchPaths) {
    let keys = [];
    let ref = null;
    let path = null;
    let walk = (o, p) => {
      for (let k in o) {
        if (o.hasOwnProperty(k)) {
          ref = o[k];
          path = p ? p + '.' + k : k;
          if (this.isObject(ref)) {
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

  getObjectPathValues (obj, includeBranchPaths) {
    let keyValues = [];
    let ref = null;
    let path = null;
    let walk = (o, p) => {
      for (let k in o) {
        if (o.hasOwnProperty(k)) {
          ref = o[k];
          path = p ? p + '.' + k : k;
          if (this.isObject(ref)) {
            if (includeBranchPaths === true) {
              keyValues.push({path:path, value:ref, isBranch:true});
            }
            walk(ref, path);
          } else {
            keyValues.push({path:path, value:ref, isBranch:false});
          }
        }
      }
    };
    walk(obj);
    return keyValues;
  },

  getObjectAtPath (obj, path, shouldThrowIfNotFound) {
    let steps = path.split('.');
    let l = steps.length;
    let ref = obj;
    let k = null;
    for (let i = 0; i < l; i++) {
      k = steps[i];
      ref = ref[k];
      if (ref === null || typeof ref === 'undefined') {
        if (shouldThrowIfNotFound === true) {
          throw new ERROR.AxialPathNotFound(`Undefined value at path "${path}"`);
        }
        return ref;
      }
    }
    return ref;
  },

  setObjectAtPath (obj, path, value) {
    let ref = obj;
    let steps = path.split('.');
    let l = steps.length - 1;
    let k = null;
    for (let i = 0; i < l; i++) {
      k = steps[i];
      if (!ref.hasOwnProperty(k)) {
        ref[k] = {};
      }
      ref = ref[k];
    }
    ref[steps[l]] = value;
  },

  multiSetObjectAtPath (obj, pathOrObject, value, shouldThrowIfNotFound) {
    let modifiedPaths = null;
    if (this.isObject(pathOrObject)) {
      this.merge(obj, pathOrObject);
      modifiedPaths = this.getObjectPaths(pathOrObject);
    } else if (typeof pathOrObject === 'string') {
      this.setObjectAtPath(obj, pathOrObject, value);
      modifiedPaths = [pathOrObject];
    }
    return modifiedPaths;
  },

  merge (source, target) {
    let copy = (_source, _target) => {
      for (let key in _target) {
        if (_target.hasOwnProperty(key)) {
          let sourceValue = _source[key];
          let targetValue = _target[key];
          if (this.isObject(targetValue)) {
            if (this.isObject(sourceValue)) {
              copy(sourceValue, targetValue);
            } else {
              let obj = {};
              _source[key] = obj;
              copy(obj, targetValue);
            }
          } else {
            _source[key] = targetValue;
          }
        }
      }
    };
    copy(source, target);
    return source;
  },

  isArray (type) {
    return type.indexOf('<array>') === 0;
  },

  isTypedArray (type) {
    return this.isArray(type) && type !== TYPE.ARRAY();
  },

  getArrayType (type) {
    return type.match(/.*\[(.+)\]/)[1];
  },

  typeOf (value) {
    if (value === null) {
      return TYPE.NULL;
    } else if (value === undefined) {
      return TYPE.UNDEFINED;
    } else if (this.isObject(value)) {
      return TYPE.OBJECT;
    } else if (typeof value === 'string') {
      return TYPE.STRING;
    } else if (typeof value === 'number') {
      return TYPE.NUMBER;
    } else if (typeof value === 'boolean') {
      return TYPE.BOOLEAN;
    } else if (value instanceof RegExp) {
      return TYPE.REGEX;
    } else if (value instanceof Date) {
      return TYPE.DATE;
    } if (Array.isArray(value)) {
      return TYPE.ARRAY(value.length ? this.typeOf(value[0]) : TYPE.ANY);
    } else if (typeof value === 'function') {
      return TYPE.FUNCTION;
    }
    return TYPE.UNKNOWN;
  },
  args (args) {
    return Array.prototype.slice.call(arguments);
  }
};

util.ExtendableBuiltin = ExtendableBuiltin;

util.log = util.log.bind(util);
util.error = util.error.bind(util);

util.TYPE = TYPE;
util.ERROR = ERROR;

module.exports = util;