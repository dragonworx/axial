import {
  getObjectKeys,
  getTypeOfProperty,
  getter,
  getterSetter,
  DATA,
  ACCESSOR,
  GETTER,
  SETTER,
  recursiveSetRootContext
} from './util';
import { is_scope, scope_ref, META_TOKEN } from './state';
import {trace} from './trace';

export class Scope {
  constructor (ref) {
    trace('Scope.new', this);

    // take the ref object and convert to scope
    const keys = getObjectKeys(ref);

    // ensure any functions within nested objects have a scope of the top level ref object
    //  - this means that everything in the scope has access to the entire scope, but no higher.
    recursiveSetRootContext(ref);

    getter(ref, META_TOKEN, () => this);
    this.ref = ref;

    // track listeners
    const listeners = [];
    this.listeners = listeners;
    
    // move values to internal map, create getters/setters for schema, re-bind to component
    const values = {};
    keys.forEach(key => {
      const value = ref[key];
      const type = getTypeOfProperty(ref, key);
      const type_of = typeof value;
      if (type_of !== 'function' && type === DATA) {
        // check if array
        if (Array.isArray(value)) {
          const l = value.length;
          for (let i = 0; i < l; i++) {
            value[i] = scope_ref(value[i]);
          }
        }

        // move value into internal map
        values[key] = value;

        // create getter and setter which updates listeners
        getterSetter(ref, key, () => values[key], newValue => {
          const oldValue = values[key];
          values[key] = newValue;
          this.update(key, newValue, oldValue);
        });
      }
    });

    this.keys = keys;
  }

  bind (listener) {
    // add listeners to this scope
    const listeners = this.listeners;
    listeners.push(listener);

    // go through properties looking for Scopes, bind to them
    this.keys.forEach(k => {
      const value = this.ref[k];
      if (is_scope(value)) {
        value[META_TOKEN].bind(listener);
      }
    });
  }

  update (key, value, oldValue) {
    // assumes listeners implement .update(key, value, oldValue)
    const listeners = this.listeners;
    // console.group(`update[${this.listeners.length}]! key:"${key} value:"${value}" oldValue:"${oldValue}"`);
    console.group('update[${this.listeners.length}]!', 'key:', key, 'value:', value, 'oldValue:', oldValue);
    listeners.forEach(listener => {
       console.log('listener:', listener);
      listener.update(key, value, oldValue, this.ref);
    });
    console.groupEnd();
  }

  hasBinding (listener) {
    return this.listeners.indexOf(listener) > -1;
  }

  unbind (listener) {
    const listeners = this.listeners;
    const index = listeners.indexOf(listener);
    if (index === -1) {
      // handle case when not-bound
      return;
    }
    listeners.splice(index, 1);
  }
}