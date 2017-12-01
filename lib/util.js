import Axis from './axis';
import settings from './settings';

export function  isReservedKey (key) {
  return settings.reservedKeys.indexOf(key) > -1;
}

export function setObjectAtPath (obj, path, value) {
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

export function getObjectAtPath (obj, path, shouldThrowIfNotFound = false) {
  let steps = path.split('.');
  let l = steps.length;
  let ref = obj;
  let k = null;
  for (let i = 0; i < l; i++) {
    k = steps[i];
    ref = ref[k];
    if (ref === null || typeof ref === 'undefined') {
      if (shouldThrowIfNotFound === true) {
        throw new Error(`Object not found at path "${path}"`);
      }
      return ref;
    }
  }
  return ref;
}

export function getTypeOfProperty(object, property) {
  let desc = Object.getOwnPropertyDescriptor(object, property);
  if (typeof desc === 'undefined') {
    desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(object), property);
  }
  if (desc.hasOwnProperty('value')) {
    return 'data';
  } else if (typeof desc.get === 'function' && typeof desc.set === 'function') {
    return 'accessor';
  }
  return typeof desc.get === 'function' ? 'getter' : 'setter';
}

export function isObjectLiteral (o) {
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
}

export function recursiveSetRootContext (root) {
  const bind = (prop) => function () {
    return prop.apply(root, arguments);
  };

  const setRootContext = obj => {
    const keys = getObjectKeys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const prop = obj[key];
      if (typeof prop === 'function') {
        obj[key] = bind(prop);
      } else if (isObjectLiteral(prop)) {
        setRootContext(prop);
      }
    }
  };

  const keys = getObjectKeys(root);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (isObjectLiteral(root[key])) {
      setRootContext(root[key]);
    }
  }
}

export function getObjectKeys (obj) {
  if (obj instanceof Axis) {
    const proto = Object.getPrototypeOf(obj);
    const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(key => key !== 'constructor');
    keys.push.apply(keys, Object.keys(obj).filter(key => settings.reservedKeys.indexOf(key) === -1 && key !== settings.token));
    return keys;
  }
  return Object.keys(obj);
}