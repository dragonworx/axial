let util;
let T = null;
const _arrayTypes = {};
const _listeners = [];
const _allSchemas = {};
const BLANK_SCHEMA_KEY = '*';

/* --------------------------------------------------------------------------------------  Errors ---------- */
const Exception = (function ExtendableBuiltin(cls){
  function ExtendableBuiltin(){
    cls.apply(this, arguments);
  }
  ExtendableBuiltin.prototype = Object.create(cls.prototype);
  Object.setPrototypeOf(ExtendableBuiltin, cls);
  return ExtendableBuiltin;
})(Error);

class AxialUnsupportedType extends Exception {
  constructor (value) {
    const message = `Unsupported type "${'' + typeof value}"`;
    super(message);
    this.value = value;
    this.message = message;
  }
}

class AxialInvalidType extends Exception {
  constructor (given, expected, key, schema) {
    const message = `Invalid type${key ? ' for property "' + key +'"' : ''} - "${given}" given, "${expected}" expected`;
    super(message);
    this.given = given;
    this.expected = expected;
    this.key = key;
    this.schema = schema;
    this.message = message;
  }
}

class AxialMissingProperty extends Exception {
  constructor (key, schema) {
    const message = `Missing schema ${key} from given object`;
    super(message);
    this.key = key;
    this.schema = schema;
    this.message = message;
  }
}

class AxialIllegalProperty extends Exception {
  constructor (key, schema) {
    const message = `Illegal key ${key} given from object, not declared in schema`;
    super(message);
    this.key = key;
    this.schema = schema;
    this.message = message;
  }
}

const Errors = {
  UnsupportedType: AxialUnsupportedType,
  InvalidType: AxialInvalidType,
  MissingProperty: AxialMissingProperty,
  IllegalProperty: AxialIllegalProperty
};

/* --------------------------------------------------------------------------------------  Types ---------- */
class AxialType {
  constructor () {
    this._defaultValue = undefined;
  }

  static get name () {
    return '?';
  }

  get name () {
    return this._name || this.constructor.name;
  }

  validate (value) {
    if (!this.is(value)) {
      throw new AxialInvalidType(this.name, util.typeOf(value).name);
    }
  }

  is (value) {
    return typeof value === this.name;
  }

  toString () {
    return this.name;
  }

  clone () {
    const copy = new this.constructor;
    for (let key in this) {
      if (this.hasOwnProperty(key)) {
        copy[key] = this[key];
      }
    }
    return copy;
  }

  define (options) {
    const copy = this.clone();
    for (let key in options) {
      if (options.hasOwnProperty(key)) {
        copy['_' + key] = options[key];
      }
    }
    return copy;
  }
}

class AxialNull extends AxialType {
  static get name () {
    return 'null';
  }

  is (value) {
    return value === null;
  }
}

class AxialUndefined extends AxialType {
  static get name () {
    return 'undefined';
  }

  is (value) {
    return typeof value === 'undefined';
  }
}

class AxialString extends AxialType {
  static get name () {
    return 'string';
  }
}

class AxialNumber extends AxialType {
  static get name () {
    return 'number';
  }
}

class AxialBoolean extends AxialType {
  static get name () {
    return 'boolean';
  }
}

class AxialDate extends AxialType {
  static get name () {
    return 'date';
  }

  is (value) {
    return value instanceof Date;
  }
}

class AxialRegex extends AxialType {
  static get name () {
    return 'regex';
  }

  is (value) {
    return value instanceof RegExp;
  }
}

class AxialFunction extends AxialType {
  static get name () {
    return 'function';
  }

  is (value) {
    return typeof value === 'function';
  }
}

class AxialArray extends AxialType {
  constructor (type) {
    super();
    this._type = type;
  }

  static get name () {
    return 'array';
  }

  is (value) {
    const isArray = Array.isArray(value);
    if (isArray) {
      if (this._type instanceof AxialType) {
        const l = value.length;
        for (let i = 0; i < l; i++) {
          if (!this._type.is(value[i])) {
            return false;
          }
        }
      }
      return true;
    } else {
      return false;
    }
  }
}

class AxialObject extends AxialType {
  static get name () {
    return 'object';
  }

  is (value) {
    return util.isPlainObject(value) || (typeof value === 'object' && (value !== null && !Array.isArray(value)));
  }
}

/* ------------------------------------------------------------------------------ AxialSchema */
class AxialSchema extends AxialObject {
  constructor (name = BLANK_SCHEMA_KEY, prototype, rootSchema) {
    super();

    if (util.isPlainObject(name) && typeof prototype === 'undefined') {
      // handle case where just single object prototype argument given
      prototype = name;
      name = BLANK_SCHEMA_KEY;
    }

    this._name = name;
    this._properties = new Map();
    this._allProps = new Map();
    this._rootSchema = rootSchema;

    this.from(prototype);

    if (name) {
      Axial.Schema[this._name.replace(/\./g, '_')] = this;
    }

    const _name = this._name;
    _allSchemas[_name] = _allSchemas[_name] ? _allSchemas[_name] : [];
    _allSchemas[_name].push(this);
  }

  get name () {
    return this._name;
  }

  get root () {
    return this._rootSchema ? this._rootSchema : this;
  }

  get isRootSchema () {
    return this.root === this;
  }

  get isSubSchema () {
    return !this.isRootSchema;
  }

  validate (value) {
    // check value is object
    if (!AxialObject.prototype.is.call(this, value)) {
      throw new AxialInvalidType(util.typeOf(value).name)
    }
  }

  is (value) {
    // check value is object
    if (!AxialObject.prototype.is.call(this, value)) {
      return false;
    }
    for (let [key, property] in this._properties) {
      // for each property, check value has key
      if (!value.hasOwnProperty(key)) {
        throw new AxialMissingProperty(key, this);
      }
      // check if expected type recognises value for current key
      let val = value[key];
      let type = property.type;
      if (!type.is(val)) {
        throw new Error('Invalid type');
      }
    }
    return true;
  }

  prop (name) {
    let path = name;
    if (this._name && path.indexOf(this._name) !== 0) {
      path = this._name + '.' + path;
    }
    return this.root._allProps.get(path);
  }

  keys () {
    const keys = [];
    for (let [path, property] of this.root._allProps) {
      keys.push(path);
    }
    return keys;
  }

  from (prototype) {
    for (let key in prototype) {
      if (prototype.hasOwnProperty(key)) {
        let type = prototype[key];
        const path = this._name ? this._name + '.' + key : `${BLANK_SCHEMA_KEY}.` + key;
        if (util.isPlainObject(type)) {
          type = new AxialSchema(path, type, this.root);
        } else {
          if (!util.isType(type)) {
            throw new AxialUnsupportedType(type);
          }
        }
        this._properties.set(key, new AxialSchemaProperty(this, key, type, path));
      }
    }
  }

  create (defaultValues = {}) {
    // check undefined keys are not being passed
    const isInstance = defaultValues instanceof AxialInstance;
    const isPlainObject = util.isPlainObject(defaultValues);
    for (let key in defaultValues) {
      if (isPlainObject && defaultValues.hasOwnProperty(key)) {
        if (!this._properties.has(key)) {
          throw new AxialIllegalProperty(key, this);
        }
      }
    }

    // create instance
    const instance = new AxialInstance(this);

    this._properties.forEach((property, key) => {
      // install getters and setters for each property in schema
      let value = defaultValues[key];
      const expectedType = property.type;
      const givenType = util.typeOf(value);

      // expect property definition type to be valid AxialType
      if (defaultValues.hasOwnProperty(key) && !property.is(givenType)) {
        throw new AxialInvalidType(givenType.toString(), expectedType.join('|'), key, this);
      }

      instance._defineAccessors(property);

      if (property.is(Axial.Schema)) {
        value = property.primarySchemaType.create(value);
      } else if (!defaultValues.hasOwnProperty(key)) {
        value = property.defaultValue;
      }

      if (typeof value !== 'undefined') {
        property.set(instance, value);
      }
    });

    return instance;
  }
}

/* ------------------------------------------------------------------------------ AxialInstance */
class AxialInstance {
  constructor (schema) {
    this._state = {};
    this._schema = schema;
    this._listeners = {};
  }

  _defineAccessors (property) {
    const key = property.key;
    if (this.hasOwnProperty(key)) {
      // TODO: user real error
      throw new Error('Illegal property key');
    }
    Object.defineProperty(this, key, {
      // create setter for instance
      set: function (value) {
        // wrap property setter
        return property.set(this, value);
      },
      // create getter for instance
      get: function () {
        // wrap property getter
        return property.get(this);
      }
    });
  }

  _bind (key, fn) {
    this._listeners[key] = this._listeners[key] ? this._listeners[key] : [];
    this._listeners[key].push(fn);
  }

  _prop (path) {
    return this._schema.prop(path);
  }

  _unbind (key, fn) {
    if (arguments.length === 0) {
      this._listeners = {};
    } else if (key && !fn) {
      this._listeners[key].length = 0;
    } else {
      const index = this._listeners[key].indexOf(fn);
      this._listeners[key].splice(index, 1);
    }
  }

  _dispatch (key, eventData) {
    // dispatch globally too
    Axial.dispatch(eventData);
    const listeners = this._listeners[key];
    if (listeners) {
      const l = listeners.length;
      for (let i = 0; i < l; i++) {
        // dispatch for each event listener to schema keys
        listeners[i](eventData);
      }
    }
  }

  _set (key, value) {
    this._state[key] = value;
  }

  _get (key) {
    return this._state[key];
  }
}

/* ------------------------------------------------------------------------------ AxialSchemaProperty */
class AxialSchemaProperty {
  constructor (schema, key, type, path) {
    this._schema = schema;
    this._key = key;
    this._type = Array.isArray(type) ? type : [type];
    this._path = path;
    schema.root._allProps.set(path, this);
  }

  is (type) {
    const t = this._type;
    const l = t.length;
    for (let i = 0; i < l; i++) {
      if (t[i] instanceof type.constructor) {
        if (t[i] instanceof AxialArray && t[i]._type !== type._type) {
          return false;
        }
        return true;
      }
    }
    return false;
  }

  validate (value) {
    const t = this._type;
    const l = t.length;
    let hasValidated = false;
    for (let i = 0; i < l; i++) {
      let type = t[i];
      try {
        type.validate(value);
        hasValidated = true;
      } catch (e) {
        /* nothing... */
      }
      if (type.is(value)) {
        return;
      }
    }
    if (!hasValidated) {
      throw new AxialInvalidType(util.typeOf(value).name, t.join('|'), this._key, this._schema);
    }
  }

  /**
   * setter
   * @param instance
   * @param value
   */
  set (instance, value) {
    const oldValue = instance._get(this._key);
    const rawValue = value;

    console.log('%cSET: ' + this._path + ':<' + this._type.join('|') + '> = ' + value, 'color:orange');

    this.validate(value);

    if (this.is(Axial.Schema) && util.isPlainObject(value)) {
      for (let i = 0; i < this._type.length; i++) {
        if (this._type[i] instanceof AxialSchema) {
          if (this._type[i].is(value)) {
            value = this._type[i].create(value);
            break;
          }
        }
      }
    }

    // dispatch event
    instance._dispatch(this._key, {
      instance: instance,
      property: this,
      method: 'set',
      key: this._key,
      value: rawValue,
      newValue: rawValue,
      oldValue: oldValue
    });

    // set state in obj
    instance._set(this._key, value);
  }

  /**
   * getter
   * @param instance
   * @returns {*}
   */
  get (instance) {
    const value = instance._get(this._key);

    console.log('%cGET: ' + this._path + ':<' + this._type.join('|') + '> = ' + (T.Object.is(value) ? `{}` : value), 'color:#999');

    // dispatch event
    instance._dispatch(this._key, {
      instance: instance,
      property: this,
      method: 'get',
      key: this._key,
      value: value
    });

    return value;
  }

  get path () {
    return this._path;
  }

  get schema () {
    return this._schema;
  }

  get key () {
    return this._key;
  }

  get type () {
    return this._type;
  }

  get defaultValue () {
    return this.primaryType._defaultValue;
  }

  get isSingleType () {
    return this._type.length === 1;
  }

  get primaryType () {
    return this._type[0];
  }

  get primarySchemaType () {
    return this._type.find(type => type instanceof AxialSchema);
  }
}

class AxialBinding {
  constructor (instance, key, handler) {
    this._instance = instance;
    this._key = key;
    this._property = instance._prop(this._key);
    this._handler = handler;
    this._active = false;
  }

  bind () {
    this._instance._bind(this._key, this._handler);
    this._active = true;
  }

  unbind () {
    this._instance._unbind(this._key, this._handler);
    this._active = false;
  }

  dispose () {
    if (this._active) {
      this.unbind();
    }
    delete this._instance;
    delete this._handler;
  }

  get () {
    return this._instance[this._key];
  }

  set (value) {
    this._instance[this._key] = value;
  }

  get instance () {
    return this._instance;
  }

  get key () {
    return this._key;
  }

  get property () {
    return this._property;
  }

  get handler () {
    return this._handler;
  }

  get isActive () {
    return this._active;
  }
}

/* --------------------------------------------------------------------------------------  Util ---------- */
util = {
  isPlainObject (o) {
    let t = o;
    return typeof o !== 'object' || o === null ?
      false :
      (function () {
        while (true) {
          if (Object.getPrototypeOf(t = Object.getPrototypeOf(t)) === null) {
            break;
          }
        }
        return Object.getPrototypeOf(o) === t;
      })();
  },

  merge (source, target) {
    let copy = (_source, _target) => {
      for (let key in _target) {
        if (_target.hasOwnProperty(key)) {
          let sourceValue = _source[key];
          let targetValue = _target[key];
          if (this.isPlainObject(targetValue)) {
            if (this.isPlainObject(sourceValue)) {
              copy(sourceValue, targetValue);
            } else {
              let obj = {};
              _source[key] = obj;
              copy(obj, targetValue);
            }
          } else {
            _source[key] = targetValue;
          }
        }
      }
      return source;
    };
    return copy(source, target);
  },

  typeOf (value) {
    if (T.Null.is(value)) {
      return T.Null;
    } else if (T.Undefined.is(value)) {
      return T.Undefined;
    } else if (T.String.is(value)) {
      return T.String
    } else if (T.Number.is(value)) {
      return T.Number
    } else if (T.Boolean.is(value)) {
      return T.Boolean
    } else if (T.Date.is(value)) {
      return T.Date
    } else if (T.Regex.is(value)) {
      return T.Regex
    } else if (T.Function.is(value)) {
      return T.Function
    } else if (T.Array.is(value)) {
      if (value.length) {
        return T.Array(this.typeOf(value[0]));
      } else {
        return T.Array();
      }
    } else if (T.Object.is(value)) {
      return T.Object
    } else if (T.Schema.is(value)) {
      return T.Schema;
    }
    throw new AxialUnsupportedType(value);
  },

  isType (type) {
    type = Array.isArray(type) ? type : [type];
    const l = type.length;
    for (let i = 0; i < l; i++) {
      if (!(type[i] instanceof AxialType)) {
        return false;
      }
    }
    return true;
  }
};

/* --------------------------------------------------------------------------------------  Define Types ---------- */
T = {
  Null: new AxialNull,
  Undefined: new AxialUndefined,
  String: new AxialString,
  Number: new AxialNumber,
  Boolean: new AxialBoolean,
  Date: new AxialDate,
  Regex: new AxialRegex,
  Function: new AxialFunction,
  Array: function (type) {
    const typeId = type ? type.name : '*';
    let t = _arrayTypes[typeId];
    if (t) {
      return t;
    } else {
      t = _arrayTypes[typeId] = new AxialArray(type);
      t._name = 'array[' + typeId + ']';
    }
    return t;
  },
  Object: new AxialObject,
  Schema: new AxialSchema(null),
  Instance: new AxialInstance
};

T.Array.is = function (value) {
  return Array.isArray(value);
};

/* --------------------------------------------------------------------------------------  Axial ---------- */
let Axial = window.Axial = {
  define (name, prototype) {
    return new AxialSchema(name, prototype);
  },
  schema (name = 'null') {
    const schemaArray = _allSchemas[name];
    if (schemaArray) {
      return schemaArray[schemaArray.length - 1];
    }
  },
  schemaNames () {
    return Object.keys(_allSchemas);
  },
  schemas () {
    const o = {};
    this.schemaNames().forEach(name => o[name] = _allSchemas[name]);
    return o;
  },
  bind (fn) {
    _listeners.push(fn);
  },
  unbind (fn) {
    if (fn) {
      const index = _listeners.indexOf(fn);
      _listeners.splice(index, 1);
    } else {
      _listeners.length = 0;
    }
  },
  dispatch (eventData) {
    const l = _listeners.length;
    for (let i = 0; i < l; i++) {
      _listeners[i](eventData);
    }
  },
  Binding: AxialBinding
};

// merge in types and errors
util.merge(Axial, T);
util.merge(Axial, Errors);

Axial.util = util;
AxialSchema.prototype.new = AxialSchema.prototype.create;

module.exports = Axial;