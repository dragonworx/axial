import util from './util'

function assert(path, type) {
  if (typeof path !== type) {
    throw new Error(`Path must be ${type}, given "${typeof path}"`);
  }
}

class AxialArrayPathExpected extends Error {}
class AxialArrayItemNotFound extends Error {}
class AxialIterablePathExpected extends Error {}
class AxialIterablePathIndexNotFound extends Error {}

let _state = {};
let _listeners = new Map;
let _loggers = [];
let _actions = new Map;
let _locked = true;

let Axial = {
  set (pathOrObject, value) {
    const modifiedPaths = util.multiSetObjectAtPath(_state, pathOrObject, value, _locked);
    let modifiedPath = null;
    const l = modifiedPaths.length;
    for (let i = 0; i < l; i++) {
      modifiedPath = modifiedPaths[i];
      this.dispatch('set', modifiedPath);
    }
    return this;
  },

  get (path, shouldThrow) {
    return util.getObjectAtPath(_state, path, shouldThrow);
  },

  on (path, fn) {
    if (!path) {
      debugger;
    }
    const listeners = _listeners;
    if (!listeners.has(path)) {
      listeners.set(path, []);
    }
    listeners.get(path).push(fn);
    return this;
  },

  log (fn) {
    _loggers.push(fn);
  },

  dispatch (type, modifiedPath, args) {
    let l = _loggers.length;
    const event = {
      type: type,
      path: modifiedPath,
      value: args ? undefined : this.get(modifiedPath),
      args: args
    };
    for (let i = 0; i < l; i++) {
      _loggers[i](event);
    }
    for (let [path, array] of _listeners.entries()) {
      if (modifiedPath.indexOf(path) === 0) {
        l = array.length;
        for (let j = 0; j < l; j++) {
          array[j](event);
        }
      }
    }
    return this;
  },

  define (pathOrObject, value) {
    const action = (path, fn) => {
      return (...args) => {
        this.dispatch('call', path, args);
        return fn.apply(this, args);
      }
    };
    let paths = [];
    if (typeof pathOrObject === 'string') {
      paths.push({path:pathOrObject, value:value});
    } else if (util.isObject(pathOrObject)) {
      paths = util.getObjectPathValues(pathOrObject);
    }
    const l = paths.length;
    for (let i = 0; i < l; i++) {
      const pathInfo = paths[i];
      const path = pathInfo.path;
      util.setObjectAtPath(_actions, path, action(path, pathInfo.value));
    }
    return this;
  },

  add (arrayPath, item) {
    assert(arrayPath, 'string');
    const array = this.get(arrayPath);
    if (!Array.isArray(array)) {
      throw new AxialArrayPathExpected(`Path "${arrayPath}" must be an Array, found ${typeof array}`);
    }
    array.push(item);
    this.dispatch('add', arrayPath);
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
    this.dispatch('remove', arrayPath);
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
    this.dispatch('clear', path);
    return this;
  },

  count (iterablePath) {
    assert(iterablePath, 'string');
    const value = this.get(iterablePath);
    if (Array.isArray(value)) {
      return value.length;
    } else if (util.isObject(value)) {
      return Object.keys(value).length;
    }
    throw new AxialIterablePathExpected(`Non-iterable path "${iterablePath}"`);
  },

  at (iterablePath, index) {
    assert(iterablePath, 'string');
    const value = this.get(iterablePath);
    if (Array.isArray(value)) {
      return value[index];
    } else if (util.isObject(value)) {
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
    return JSON.stringify(_state, null, 4);
  }
};

Axial.util = util;
Axial.call = Axial.fn = _actions;

export default Axial;