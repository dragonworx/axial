import React from 'react'

let instance = null;
let stateId = 0;
const storeComponentHelperMethods = ['set', 'get', 'add', 'remove', 'clear', 'count', 'at', 'indexOf', 'contains', 'first', 'last', 'has', 'call'];

function isObject(o) {
  return typeof o === 'object' && o !== null && !Array.isArray(o);
}

function getObjectPaths(obj) {
  let keys = [];
  let ref = null;
  let path = null;
  let walk = function (o, p) {
    for (let k in o) {
      if (o.hasOwnProperty(k)) {
        ref = o[k];
        path = p ? p + '.' + k : k;
        keys.push(path);
        if (isObject(ref)) {
          walk(ref, path);
        }
      }
    }
  };
  walk(obj);
  return keys;
}

function getObjectAtPath(obj, path, shouldThrow) {
  let steps = path.split('.');
  let l = steps.length;
  let ref = obj;
  for (let i = 0; i < l; i++) {
    if (typeof ref === 'undefined' && shouldThrow === true) {
      throw new Error(`Cannot find value for path "${path}"`);
    }
    ref = ref[steps[i]];
  }
  return ref;
}

function setObjectAtPath(obj, path, value) {
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
}

function multiSetObjectAtPath(obj, pathOrObject, value) {
  let modifiedPaths = null;
  if (isObject(pathOrObject)) {
    obj = Object.assign(obj, pathOrObject);
    modifiedPaths = getObjectPaths(pathOrObject);
  } else if (typeof pathOrObject === 'string') {
    setObjectAtPath(obj, pathOrObject, value);
    modifiedPaths = [pathOrObject];
  }
  return [obj, modifiedPaths];
}

function assert(path, type) {
  if (typeof path !== type) {
    throw new Error(`Path must be ${type}, given "${typeof path}"`);
  }
}

class Store {
  constructor() {
    if (instance) {
      throw new Error('Store is a Singleton, an instance already exists.');
    }
    instance = this;
    this._state = {};
    this._listeners = new Map;
    this._actions = new Map;
  }

  set(pathOrObject, value) {
    const out = multiSetObjectAtPath(this._state, pathOrObject, value);
    this._state = out[0];
    const modifiedPaths = out[1];
    let modifiedPath = null;
    const l = modifiedPaths.length;
    for (let i = 0; i < l; i++) {
      modifiedPath = modifiedPaths[i];
      this.dispatch(modifiedPath);
    }
    return this;
  }

  get(path) {
    return getObjectAtPath(this._state, path);
  }

  on(path, fn) {
    const listeners = this._listeners;
    if (!listeners.has(path)) {
      listeners.set(path, []);
    }
    listeners.get(path).push(fn);
    return this;
  }

  dispatch(modifiedPath) {
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
  }

  define(pathOrObject, value) {
    const out = multiSetObjectAtPath(this._actions, pathOrObject, value);
    this._actions = out[0];
    return this;
  }

  call(path, ...args) {
    const fn = getObjectAtPath(this._actions, path, true);
    if (!fn) {
      throw new Error(`Undefined action "${path}"`);
    }
    return fn.apply(this, args);
  }

  add(arrayPath, item) {
    assert(arrayPath, 'string');
    const array = this.get(arrayPath);
    if (!Array.isArray(array)) {
      throw new Error(`Path "${arrayPath}" must be an Array, found ${typeof array}`);
    }
    array.push(item);
    this.dispatch(arrayPath);
    return this;
  }

  remove(arrayPath, item) {
    assert(arrayPath, 'string');
    let array = this.get(arrayPath);
    if (!Array.isArray(array)) {
      throw new Error(`Path "${arrayPath}" must be an Array, found ${typeof array}`);
    }
    let index = array.indexOf(item);
    if (index === -1) {
      throw new Error(`Item not found in Array path "${arrayPath}"`);
    }
    array.splice(index, 1);
    this.dispatch(arrayPath);
    return this;
  }

  clear(path) {
    assert(path, 'string');
    let value = this.get(path);
    if (Array.isArray(value)) {
      value.length = 0;
    } else {
      this.set(path, undefined);
    }
    this.dispatch(path);
    return this;
  }

  count(iterablePath) {
    assert(iterablePath, 'string');
    const value = this.get(iterablePath);
    if (Array.isArray(value)) {
      return value.length;
    } else if (isObject(value)) {
      return Object.keys(value).length;
    }
    throw new Error(`Non-iterable path "${iterablePath}"`);
  }

  at(iterablePath, index) {
    assert(iterablePath, 'string');
    const value = this.get(iterablePath);
    if (Array.isArray(value)) {
      return value[index];
    } else if (isObject(value)) {
      const keys = Object.keys(value);
      return value[keys[index]];
    }
    throw new Error(`Non-iterable path "${iterablePath}"`);
  }

  indexOf(iterablePath, item) {
    assert(iterablePath, 'string');
    const value = this.get(iterablePath);
    if (Array.isArray(value)) {
      return value.indexOf(item);
    }
    throw new Error(`Cannot find index in non-array value at path "${iterablePath}"`);
  }

  contains(iterablePath, item) {
    assert(iterablePath, 'string');
    return this.indexOf(iterablePath, item) > -1;
  }

  first(iterablePath) {
    assert(iterablePath, 'string');
    const value = this.get(iterablePath);
    let keys = Object.keys(value);
    return value[keys[0]];
  }

  last(iterablePath) {
    assert(iterablePath, 'string');
    let value = this.get(iterablePath);
    let keys = Object.keys(value);
    return value[keys[keys.length - 1]];
  }

  has(path) {
    assert(path, 'string');
    let value = this.get(path);
    return value !== null || typeof value !== 'undefined';
  }

  toString() {
    return JSON.stringify(this._state, null, 4);
  }

  static instance() {
    return instance;
  }
}

class StoreComponent extends React.Component {
  constructor(props) {
    super(props);
    this._isMounted = true;
    this.state = {
      id: stateId++
    };
    if (this.constructor.store) {
      if (typeof this.constructor.store !== 'string' && !Array.isArray(this.constructor.store)) {
        throw new Error('Store bindings must be either a String or Array');
      }
      let bindings = typeof this.constructor.store === 'string' ? [this.constructor.store] : this.constructor.store;
      bindings.forEach(binding => {
        let path, alias;
        if (typeof binding === 'string') {
          path = binding;
          alias = binding.split('.').pop();
        } else if (isObject(binding) && binding.path && binding.alias) {
          path = binding.path;
          alias = binding.alias;
        } else {
          throw new Error('Invalid argument for store bind, String or Array required.');
        }
        instance.on(path, () => {
          if (this._isMounted) {
            this.setState({
              id: stateId++
            });
          }
        });
        Object.defineProperty(this, alias, {
          get: function () {
            return instance.get(path);
          },
          set: function (value) {
            return instance.set(path, value);
          }
        });
      });
    }
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  deferSet(path, value) {
    return () => this.set(path, value);
  }

  action(path, ...args) {
    return () => {
      this.call.call(this, path, ...args)
    };
  }

  ref(name) {
    return this.refs[name].value;
  }

  refNum(name) {
    return parseFloat(this.ref(name));
  }
}

storeComponentHelperMethods.forEach(methodName => {
  StoreComponent.prototype[methodName] = function () {
    return instance[methodName].apply(instance, arguments);
  }
});

Store.Component = StoreComponent;

new Store;

export default Store;