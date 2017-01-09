import React from 'react'
import AxialSchema from './schema'

class AxialComponent extends React.Component {
  constructor (...args) {
    super(...args);
    this._bindings = [];

    const _render = this.render;

    this.render = () => {
      console.group(`RENDER:[${this.constructor.name}]`);
      AxialSchema.beginRender(this);
      const output = _render();
      const wrapper = output === null ? output : <div style={{backgroundColor:'rgba(0,0,0,0.1)',border:'5px dashed rgba(0,0,0,0.1)',margin:'5px',padding:'5px'}}>{output}</div>;
      AxialSchema.endRender(this);
      console.groupEnd();
      return wrapper;
    };
  }

  addBinding (property) {
    if (this._bindings.indexOf(property) === -1) {
      this._bindings.push(property);
    }
  }

  detachBindings () {
    this._bindings.forEach(property => {
      property.removeListener(this.fn);
    });
    this._bindings.length = 0;
  }

  attachBindings () {
    this.fn = this.onPropertyChange.bind(this);
    this._bindings.forEach(property => {
      console.log(`%c  [${property._path}]:${property._type.toString()}`, 'color:green');
      property.addListener(this.fn);
    });
  }

  onPropertyChange (property, value, oldValue) {
    console.log(`%cCHANGE:[${property._path}]`, 'color:orange');
    if (value === oldValue) {
      console.log(`%%cEQUAL:[${property._path}]`, 'color:#999');
      return;
    }
    const state = {};
    state[property._path] = value;
    this.setState(state);
  }

  cacheState () {
    const cache = {};
    this._bindings.forEach(property => {
      cache[property._path] = property._get();
    });
    this.state = cache;
  }

  shouldComponentUpdate (nextProps, nextState) {
    const state = this.state;
    let isEqual = true;
    for (let path in state) {
      if (state.hasOwnProperty(path)) {
        if (state[path] !== nextState[path]) {
          isEqual = false;
          console.log(`%c[${this.constructor.name}.${path}] bindings changed`, 'color:green');
          break;
        }
      }
    }
    if (isEqual) {
      console.log(`%c[${this.constructor.name}] bindings are equal`, 'color:red');
    }
    return !isEqual;
  }
}

export default AxialComponent;