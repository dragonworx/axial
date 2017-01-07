const Errors = require('./errors');

let util = {
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
          throw new Error(Errors.AxialPathNotFound(path));
        }
        return ref;
      }
    }
    return ref;
  },

  renameAtPath (obj, path, key) {
    let steps = path.split('.');
    let l = steps.length - 1;
    let ref = obj;
    let k = null;
    for (let i = 0; i < l; i++) {
      k = steps[i];
      ref = ref[k];
      if (typeof ref === 'undefined') {
        throw new Error(Errors.AxialPathNotFound(path));
      }
    }
    let lastSubKey = steps[steps.length - 1];
    ref[key] = ref[lastSubKey];
    delete ref[lastSubKey];
    return obj;
  },

  defineAccessorsAtPath (obj, path, getter, setter) {
    let steps = path.split('.');
    let l = steps.length - 1;
    let lastSubKey = steps[steps.length - 1];
    let ref = obj;
    let k = null;
    for (let i = 0; i < l; i++) {
      k = steps[i];
      if (typeof ref[k] === 'undefined') {
        ref[k] = {};
      }
      ref = ref[k];
    }
    Object.defineProperty(ref, lastSubKey, {
      get: getter,
      set: setter
    });
    return obj;
  },

  setObjectAtPath (obj, path, value, branchFactory) {
    let ref = obj;
    let steps = path.split('.');
    let l = steps.length - 1;
    let k = null;
    let branches = new Map();
    for (let i = 0; i < l; i++) {
      k = steps[i];
      if (!ref.hasOwnProperty(k)) {
        let branchPath = steps.slice(0, i + 1).join('.');
        let branch = typeof branchFactory === 'function' ? branchFactory(branchPath) : {};
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

  args (/*arguments*/) {
    return Array.prototype.slice.call(arguments);
  }
};

module.exports = util;