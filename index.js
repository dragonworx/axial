import util from './util'

function assert(path, type) {
  if (typeof path !== type) {
    throw new Error(`Path must be ${type}, given "${typeof path}"`);
  }
}

class AxialUndefinedAction extends Error {}
class AxialArrayPathExpected extends Error {}
class AxialArrayItemNotFound extends Error {}
class AxialIterablePathExpected extends Error {}
class AxialIterablePathIndexNotFound extends Error {}

let _state = {};
let _listeners = new Map;
let _actions = new Map;

const Axial = {
  set (pathOrObject, value) {
    const modifiedPaths = util.multiSetObjectAtPath(_state, pathOrObject, value);
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

  dispatch (type, modifiedPath) {
    for (let [path, array] of _listeners.entries()) {
      if (path === '*' || modifiedPath.indexOf(path) === 0) {
        for (let j = 0; j < array.length; j++) {
          let fn = array[j];
          fn({
            type: type,
            path: modifiedPath,
            value: this.get(modifiedPath)
          });
        }
      }
    }
    return this;
  },

  define (pathOrObject, value) {
    util.multiSetObjectAtPath(_actions, pathOrObject, value);
    return this;
  },

  call (path, ...args) {
    const fn = util.getObjectAtPath(_actions, path);
    if (!fn) {
      throw new AxialUndefinedAction(`Undefined action "${path}"`);
    }
    let out = fn.apply(this, args);
    this.dispatch('call', path);
    return out;
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
  },

  listeners() {
    return _listeners;
  }
};

Axial.util = util;

export default Axial;