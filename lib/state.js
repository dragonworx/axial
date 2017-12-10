import { setObjectAtPath, recursiveSetRootContext, isObjectLiteral } from './util';
import { Scope } from './scope';

const _scopes = [];

export const META_TOKEN = '__scope__';

export function scopes () {
  return _scopes.slice();
}

export function peek () {
  return _scopes[_scopes.length - 1];
}

export function push (scope) {
  scope = scope_ref(scope);
  _scopes.push(scope);
  return scope;
}

export function is_scope (ref) {
  if (ref instanceof Scope) {
    return ref;
  }
  const prop = ref[META_TOKEN];
  return prop && prop instanceof Scope;
}

export function scope_ref (scope) {
  if (is_scope(scope)) {
    return scope;
  }

  if (isObjectLiteral(scope)) {
    new Scope(scope);
  }

  return scope;
}

export function as_scope (scope) {
  if (scope[META_TOKEN]) {
    return scope[META_TOKEN];
  }
  return scope_ref(scope)[META_TOKEN];
}

export function pop () {
  return _scopes.pop();
}