function assert(path, type) {
  if (typeof path !== type) {
    throw new Error(`Path must be ${type}, given "${typeof path}"`);
  }
}

class AxialPathNotFound extends Error {}
class AxialUndefinedAction extends Error {}
class AxialArrayPathExpected extends Error {}
class AxialArrayItemNotFound extends Error {}
class AxialIterablePathExpected extends Error {}
class AxialIterablePathIndexNotFound extends Error {}

const Axial = {
  _state: {},
  _listeners: new Map,
  _actions: new Map,

  isObject (o) {
    return typeof o === 'object' && o !== null && !Array.isArray(o);
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

  set (pathOrObject, value) {
    const out = this.multiSetObjectAtPath(this._state, pathOrObject, value);
    this._state = out[0];
    const modifiedPaths = out[1];
    let modifiedPath = null;
    const l = modifiedPaths.length;
    for (let i = 0; i < l; i++) {
      modifiedPath = modifiedPaths[i];
      this.dispatch(modifiedPath);
    }
    return this;
  },

  get (path, shouldThrow) {
    return this.getObjectAtPath(this._state, path, shouldThrow);
  },

  on (path, fn) {
    const listeners = this._listeners;
    if (!listeners.has(path)) {
      listeners.set(path, []);
    }
    listeners.get(path).push(fn);
    return this;
  },

  dispatch (modifiedPath) {
    for (let [path, array] of this._listeners.entries()) {
      if (path === '*' || modifiedPath.indexOf(path) === 0) {
        for (let j = 0; j < array.length; j++) {
          let fn = array[j];
          fn({
            path: modifiedPath,
            value: this.get(modifiedPath)
          });
        }
      }
    }
    return this;
  },

  define (pathOrObject, value) {
    const out = this.multiSetObjectAtPath(this._actions, pathOrObject, value);
    this._actions = out[0];
    return this;
  },

  call (path, ...args) {
    const fn = this.getObjectAtPath(this._actions, path, true);
    if (!fn) {
      throw new AxialUndefinedAction(`Undefined action "${path}"`);
    }
    return fn.apply(this, args);
  },

  add (arrayPath, item) {
    assert(arrayPath, 'string');
    const array = this.get(arrayPath);
    if (!Array.isArray(array)) {
      throw new AxialArrayPathExpected(`Path "${arrayPath}" must be an Array, found ${typeof array}`);
    }
    array.push(item);
    this.dispatch(arrayPath);
    return this;
  },

  remove (arrayPath, item) {
    assert(arrayPath, 'string');
    let array = this.get(arrayPath);
    if (!Array.isArray(array)) {
      throw new AxialArrayPathExpected(`Path "${arrayPath}" must be an Array, found ${typeof array}`);
    }
    let index = array.indexOf(item);
    if (index === -1) {
      throw new AxialArrayItemNotFound(`Item not found in Array path "${arrayPath}"`);
    }
    array.splice(index, 1);
    this.dispatch(arrayPath);
    return this;
  },

  clear (path) {
    assert(path, 'string');
    let value = this.get(path);
    if (Array.isArray(value)) {
      value.length = 0;
    } else {
      this.set(path, undefined);
    }
    this.dispatch(path);
    return this;
  },

  count (iterablePath) {
    assert(iterablePath, 'string');
    const value = this.get(iterablePath);
    if (Array.isArray(value)) {
      return value.length;
    } else if (this.isObject(value)) {
      return Object.keys(value).length;
    }
    throw new AxialIterablePathExpected(`Non-iterable path "${iterablePath}"`);
  },

  at (iterablePath, index) {
    assert(iterablePath, 'string');
    const value = this.get(iterablePath);
    if (Array.isArray(value)) {
      return value[index];
    } else if (this.isObject(value)) {
      const keys = Object.keys(value);
      return value[keys[index]];
    }
    throw new AxialIterablePathExpected(`Non-iterable path "${iterablePath}"`);
  },

  indexOf (iterablePath, item) {
    assert(iterablePath, 'string');
    const value = this.get(iterablePath);
    if (Array.isArray(value)) {
      return value.indexOf(item);
    }
    throw new AxialIterablePathIndexNotFound(`Cannot find index in non-array value at path "${iterablePath}"`);
  },

  contains (iterablePath, item) {
    assert(iterablePath, 'string');
    return this.indexOf(iterablePath, item) > -1;
  },

  first (iterablePath) {
    assert(iterablePath, 'string');
    const value = this.get(iterablePath);
    let keys = Object.keys(value);
    return value[keys[0]];
  },

  last (iterablePath) {
    assert(iterablePath, 'string');
    let value = this.get(iterablePath);
    let keys = Object.keys(value);
    return value[keys[keys.length - 1]];
  },

  has (path) {
    assert(path, 'string');
    let value = this.get(path);
    return value !== null || typeof value !== 'undefined';
  },

  toString () {
    return JSON.stringify(this._state, null, 4);
  }
};

export default Axial;