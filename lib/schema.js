import util from './util'
import Types from './types'
import Errors from './errors'

let _renderingComponent = [];

/**
 * AxialSchema
 */
class AxialSchema {
  constructor (definitions) {
    this._schema = {};
    this._state = {};
    if (util.isObject(definitions)) {
      this.define(definitions);
    }
  }

  define (definitions) {
    util.getObjectPathValues(definitions).forEach(pathValue => {
      const path = pathValue.path;
      const type = pathValue.value;
      if (!type) {
        throw new Error(Errors.AxialUndefinedType(type));
      }
      if (util.getObjectAtPath(this._schema, path)) {
        throw new Error(Errors.AxialSchemaPathExists(path));
      }
      const property = new AxialProperty(this, path, type);
      const getter = () => property.get();
      const setter = value => property.set(value);
      util.setObjectAtPath(this._schema, path, type, path => new AxialBranch(this, path, Types.Object));
      util.defineAccessorsAtPath(this._state, path, getter, setter);
    });
  }

  state () {
    return this._state;
  }

  paths () {
    const paths = [];
    const walk = (ref, path) => {
      for (let k in ref) {
        if (k.charAt(0) === '_') {
          continue;
        }
        if (ref.hasOwnProperty(k)) {
          const v = ref[k];
          const p = path ? path + '.' + k : k;
          const isBranch = v instanceof AxialBranch;
          paths.push({
            isBranch: isBranch,
            path: p,
            value: v
          });
          if (isBranch) {
            walk(v, p);
          }
        }
      }
    };
    walk(this._schema);
    return paths;
  }

  validate (value) {
    if (!util.isObject(value)) {
      throw new Error(Errors.AxialInvalidType('object', typeof value));
    }
    const schemaPaths = this.paths();
    const valuePaths = util.getObjectPathValues(value, true);

    if (schemaPaths.length !== valuePaths.length) {
      throw new Error(Errors.AxialInvalidPath('*', 'unequal path count'));
    }

    const valueHash = {};

    let l = valuePaths.length;
    for (let i = 0; i < l; i++) {
      const valuePathValue = valuePaths[i];
      valueHash[valuePathValue.path] = valuePathValue.value;
    }

    l = schemaPaths.length;
    for (let i = 0; i < l; i++) {
      const schemaPathValue = schemaPaths[i];
      const schemaPath = schemaPathValue.path;
      const schemaType = schemaPathValue.value;
      if (valueHash.hasOwnProperty(schemaPathValue.path)) {
        const valueValue = valueHash[schemaPathValue.path];
        try {
          schemaType.validate(valueValue);
        } catch (e) {
          throw new Error(e.message + ` for path "${schemaPath}"`);
        }
      } else {
        if (schemaType._isRequired) {
          throw new Error(Errors.AxialPathNotFound(schemaPath));
        }
      }
    }
  }
}

/**
 * AxialProperty
 */
class AxialProperty {
  constructor (schema, path, type, value = null) {
    this._schema = schema;
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
  validate (value) {
    this._type.validate(value);
  }

  is (value) {
    return util.isObject(value);
  }
}

/**
 * startCurrentScope
 * @param component
 */
function beginRender (component) {
  _renderingComponent.push(component);
  component.detachBindings();
}

/**
 * endCurrentScope
 * @param component
 */
function endRender (component) {
  console.log(`%cBindings:[${component.constructor.name}]`, 'font-style:italic;color:#999');
  component.attachBindings();
  component.cacheState();
  _renderingComponent.pop();
}

AxialSchema.beginRender = beginRender;
AxialSchema.endRender = endRender;

export default AxialSchema;