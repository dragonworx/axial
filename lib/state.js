import { setObjectAtPath, recursiveSetRootContext, isObjectLiteral } from './util';
import Scope from './scope';

const _scopes = [];

export function scopes () {
  return _scopes.slice();
}

export function peek () {
  return _scopes[_scopes.length - 1];
}

export function push (scope) {
  _scopes.push(asScope(scope));
}

export function asScope (scope) {
  if (scope instanceof Scope) {
    // return instance
    return scope;
  } else if (isObjectLiteral(scope)) {
    // check if any scope instances exist with those values, if so return them
    const l = _scopes.length;
    for (let i = 0; i < l; i++) {
      const scope_i = _scopes[i];
      if (scope_i.prototype === scope) {
        return scope_i;
      }
    }
    // otherwise return a new instance
    return new Scope(scope);
  }
}

export function pop () {
  return _scopes.pop();
}