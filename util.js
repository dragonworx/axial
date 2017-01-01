const ERROR = {
  AxialPathNotFound: 'AxialPathNotFound',
  AxialArrayExpected: 'AxialArrayExpected'
};

const TYPE = {
  ANY: '<any>',
  STRING: '<string>',
  NUMBER: '<number>',
  BOOLEAN: '<boolean>',
  ARRAY: function (type) {
    return `<array>[${type || '<any>'}]`;
  },
  OBJECT: '<object>',
  REGEX: '<regex>',
  DATE: '<date>',
  FUNCTION: '<function>',
  NULL: '<null>',
  UNDEFINED: '<undefined>',
  UNKNOWN: '<unknown>',
  BRANCH: '<branch>'
};

const TYPES = {};

function err (type, message) {
  return `${type}: ${message}`;
}

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

  isType (t) {
    const types = Array.isArray(t) ? t : [t];
    let count = 0;
    for (let i = 0; i < types.length; i++) {
      const type = types[i];
      if (typeof type !== 'string') {
        return false;
      }
      if (type === TYPE.ARRAY()) {
        return true;
      }
      for (let typeName in TYPE) {
        if (TYPE.hasOwnProperty(typeName)) {
          if (type === TYPE[typeName]) {
            count++;
          }
          if (typeName !== 'ARRAY') {
            const arrayType = TYPE.ARRAY(TYPE[typeName]);
            if (type === arrayType) {
              count++;
            }
          }
        }
      }
    }
    return count === types.length;
  },

  isCustomType (t) {
    return typeof this.getCustomType(t) !== 'undefined';
  },

  getCustomTypeKey (t) {
    return t.replace(/^<|>$/g, '').toUpperCase();
  },

  getCustomType (t) {
    const a = Array.isArray(t) ? t : [t];
    for (let i = 0, l = a.length; i < l; i++) {
      const tk = a[i];
      let T;
      try {
        T = TYPES[this.getCustomTypeKey(this.isArray(tk) ? this.getArrayType(tk) : tk)];
      } catch (e) {
      }
      if (typeof T !== 'undefined') {
        return T;
      }
    }
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
              keyValues.push({path: path, value: ref, isBranch: true});
            }
            walk(ref, path);
          } else {
            keyValues.push({path: path, value: ref, isBranch: false});
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
      if (typeof ref === 'undefined') {
        if (shouldThrowIfNotFound === true) {
          throw new Error(err(ERROR.AxialPathNotFound, `Undefined value at path "${path}"`));
        }
        return ref;
      }
    }
    return ref;
  },

  /**
   *
   * @param obj
   * @param path
   * @param value
   * @param banchFactory - use this factory function to return a branche that do not exist for new and deeper paths
   * @returns {Map}
   */
  setObjectAtPath (obj, path, value, banchFactory) {
    let ref = obj;
    let steps = path.split('.');
    let l = steps.length - 1;
    let k = null;
    let branches = new Map();
    for (let i = 0; i < l; i++) {
      k = steps[i];
      if (!ref.hasOwnProperty(k)) {
        let branchPath = steps.slice(0, i + 1).join('.');
        let branch = typeof banchFactory === 'function' ? banchFactory(branchPath) : {};
        ref[k] = branch;
        branches.set(branchPath, branch);
      }
      ref = ref[k];
    }
    ref[steps[l]] = value;
    return branches;
  },

  deleteAtPath (obj, path) {
    const parts = path.split('.');
    if (parts.length === 1) {
      delete obj[path];
    } else {
      const parentPath = parts.slice(0, parts.length - 1).join('.');
      let parentObj = this.getObjectAtPath(obj, parentPath);
      delete parentObj[path.split('.').pop()];
    }
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
    return ('' + type).indexOf('<array>') === 0;
  },

  isTypedArray (type) {
    return this.isArray(type) && type !== TYPE.ARRAY();
  },

  getArrayType (type) {
    return type.replace(/^<array>/, '').replace(/^\[/, '').replace(/\]$/, '');
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
    }
    if (Array.isArray(value)) {
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

util.log = util.log.bind(util);
util.error = util.error.bind(util);
util.err = err;

util.TYPE = TYPE;
util.TYPES = TYPES;
util.ERROR = ERROR;

module.exports = util;