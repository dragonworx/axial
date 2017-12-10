import {
  getObjectKeys,
  getTypeOfProperty,
  getter,
  getterSetter,
  DATA,
  ACCESSOR,
  GETTER,
  SETTER
} from './util';

export class ScopeMeta {
  constructor (scope, prototype) {
    this.scope = scope;
    this.prototype = prototype;
    
    // track listeners
    const listeners = [];
    this.listeners = listeners;

    // track and expose schema array
    const schema = [];
    this.schema = schema;

    // create getters/setters for schema, bind to component
    const keys = getObjectKeys(prototype);
    keys.forEach(key => {
      const type = getTypeOfProperty(prototype, key);
      if (type === DATA) {
        getterSetter(scope, key, () => prototype[key], value => {
          const oldValue = prototype[key];
          prototype[key] = value;
          this.updateListeners(key, value, oldValue);
        });
      }
      schema.push(key);
    });
  }

  addListener (listener) {
    this.listeners.push(listener);
  }

  updateListeners (key, value, oldValue) {
    console.log('update:', this.scope.name, this.listeners);
    this.listeners.forEach(listener => listener.update(key, value, oldValue));
  }

  hasListener (listener) {
    return this.listeners.indexOf(listener) > -1;
  }

  removeListener (listener) {
    const listeners = this.listeners;
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  }
}

export default class Scope {
  constructor (prototype = {}) {
    this.$ = new ScopeMeta(this, prototype);

    // init
    const init = this.init;
    if (init && !init.hasInit) {
      init.call(this);
      init.hasInit = true;
    }
  }
};