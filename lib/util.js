import { Scope } from './scope';
import { is_scope, scope_ref } from './state';

export const DATA = 'data';
export const ACCESSOR = 'accessor';
export const GETTER = 'getter';
export const SETTER = 'setter';

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
    return DATA;
  } else if (typeof desc.get === 'function' && typeof desc.set === 'function') {
    return ACCESSOR;
  }
  return typeof desc.get === 'function' ? GETTER : SETTER;
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
    scope_ref(obj);
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
  // if (is_scope(obj)) {
  //   const proto = Object.getPrototypeOf(obj);
  //   const keys = Object.getOwnPropertyNames(proto)
  //     .filter(key => key !== 'constructor');
  //   keys.push.apply(keys, Object.keys(obj));
  //   return keys;
  // }
  return Object.keys(obj);
}

export function setter (obj, key, fn) {
  Object.defineProperty(obj, key, {
    set: fn
  });
}

export function getter (obj, key, fn) {
  Object.defineProperty(obj, key, {
    get: fn
  });
}

export function getterSetter (obj, key, getterFn, setterFn) {
  Object.defineProperty(obj, key, {
    get: getterFn,
    set: setterFn,
    configurable: true,
    enumerable: true
  });
}

export function log (label, data) {
  console.log(`%c${label}`, 'font-weight:bold');
  console.log(data);
}