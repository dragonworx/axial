import util from './util'
import Types from './types'
import Errors from './errors'

let _schema = {};
let _state = {};
let _renderingComponent = [];

/**
 * AxialProperty
 */
class AxialProperty {
  constructor (path, type, value = undefined) {
    this._path = path;
    this._type = type;
    this._value = value;
    this._listeners = [];
  }

  get () {
    const stack = new Error().stack.split('\n');
    const callerLine = stack[3];
    const callerSource = callerLine.match('<anonymous>') ? 'anonymous' : callerLine.match(/.+\((.+)\)/)[1];
    console.log(`%cGET:[${this._path}] at ${callerSource}`, 'font-style:italic');
    if (_renderingComponent.length) {
      const currentComponent = _renderingComponent[_renderingComponent.length - 1];
      currentComponent.addBinding(this);
    }
    return this._get();
  }

  _get () {
    return this._value;
  }

  set (value) {
    console.log(`%cSET:[${this._path}] = ${typeof value === 'function' ? '<function>' : JSON.stringify(value)}`, 'color:blue;font-weight:bold');
    this._type.validate(value);
    const oldValue = this._value;
    if (oldValue === value) {
      console.log(`%cSAME!`, 'color:#999');
      return;
    }
    this._value = value;
    this._listeners.forEach(fn => {
      fn(this, value, oldValue);
    });
  }

  addListener (fn) {
    this._listeners.push(fn);
  }

  removeListener (fn) {
    const index = this._listeners.indexOf(fn);
    if (index === -1) {
      throw new Error(Errors.AxialListenerNotFound(this.name, typeof value));
    }
    this._listeners.splice(index, 1);
  }
}

/**
 * AxialBranch
 */
class AxialBranch extends AxialProperty {
  constructor (path, type, value = undefined) {
    super(path, type, value);
    delete this._value;
    delete this._listeners;
  }
}

/**
 * define
 * @param definitions
 */
function define (definitions) {
  util.getObjectPathValues(definitions).forEach(pathValue => {
    const path = pathValue.path;
    const type = pathValue.value;
    const property = new AxialProperty(path, type);
    const getter = () => property.get();
    const setter = value => property.set(value);
    util.setObjectAtPath(_schema, path, type, path => new AxialBranch(path, Types.Object));
    util.defineAccessorsAtPath(_state, path, getter, setter);
  });
}

/**
 * startCurrentScope
 * @param component
 */
function startCurrentScope (component) {
  _renderingComponent.push(component);
  component.detachBindings();
}

/**
 * endCurrentScope
 * @param component
 */
function endCurrentScope (component) {
  console.log(`%cBindings:[${component.constructor.name}]`, 'font-style:italic;color:#999');
  component.attachBindings();
  component.cacheState();
  _renderingComponent.pop();
}

module.exports = {
  startCurrentScope: startCurrentScope,
  endCurrentScope: endCurrentScope,
  define: define,
  state: _state,
  schema: _schema
};