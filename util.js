class AxialPathNotFound extends Error {
}

export default {
  isObject(o) {
    let t = o;
    return (typeof o !== 'object' || o === null ?
        false :
        (
          (function () {
            while (!false) {
              if (Object.getPrototypeOf(t = Object.getPrototypeOf(t)) === null) {
                break;
              }
            }
            return Object.getPrototypeOf(o) === t;
          })()
        )
    );
  },

  getObjectPaths (obj) {
    let keys = [];
    let ref = null;
    let path = null;
    let walk = (o, p) => {
      for (let k in o) {
        if (o.hasOwnProperty(k)) {
          ref = o[k];
          path = p ? p + '.' + k : k;
          keys.push(path);
          if (this.isObject(ref)) {
            walk(ref, path);
          }
        }
      }
    };
    walk(obj);
    return keys;
  },

  getObjectAtPath (obj, path, shouldThrow) {
    let steps = path.split('.');
    let l = steps.length;
    let ref = obj;
    let k = null;
    for (let i = 0; i < l; i++) {
      k = steps[i];
      ref = ref[k];
      if (ref === null || typeof ref === 'undefined') {
        if (shouldThrow === true) {
          throw new AxialPathNotFound(`Undefined value at path "${path}"`);
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

  multiSetObjectAtPath (obj, pathOrObject, value) {
    let modifiedPaths = null;
    if (this.isObject(pathOrObject)) {
      obj = Object.assign(obj, pathOrObject);
      modifiedPaths = this.getObjectPaths(pathOrObject);
    } else if (typeof pathOrObject === 'string') {
      this.setObjectAtPath(obj, pathOrObject, value);
      modifiedPaths = [pathOrObject];
    }
    return [obj, modifiedPaths];
  },
};