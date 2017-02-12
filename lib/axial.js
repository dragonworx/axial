module.exports = (function Define_Axial () {
  const CONST = require('./const');
  let util, T;
  const _arrayTypes = {};
  const _listeners = [];
  const _interfaces = {};
  const _instances = {};
  const _bindings = [];
  const BLANK_INTERFACE_NAME = CONST.BLANK_INTERFACE_NAME;
  const _instanceMembers = CONST.INSTANCE_MEMBERS;
  const _arrayMembers = CONST.ARRAY_MEMBERS;
  const _arrayMutators = CONST.ARRAY_MUTATORS;

  // -------------------------------------------------------------------------------------- Errors
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
      const message = `Unsupported type "${'' + typeof value}". Only AxialTypes can be provided.`;
      super(message);
      this.value = value;
      this.message = message;
    }
  }

  class AxialInvalidType extends Exception {
    constructor (given, expected, key, iface) {
      const message = `Invalid type${key ? ' for property "' + key +'"' : ''} - "${given}" given, "${expected}" expected`;
      super(message);
      this.given = given;
      this.expected = expected;
      this.key = key;
      this.iface = iface;
      this.message = message;
    }
  }

  class AxialInvalidNumericRange extends Exception {
    constructor (given, min, max) {
      const message = `Invalid numeric range - expected [${min} .. ${max}], given ${given}`;
      super(message);
      this.given = given;
      this.min = min;
      this.max = max;
      this.message = message;
    }
  }

  class AxialInvalidStringPattern extends Exception {
    constructor (given, pattern) {
      const message = `Invalid string pattern - expected "${pattern}", given "${given}"`;
      super(message);
      this.given = given;
      this.pattern = pattern;
      this.message = message;
    }
  }

  class AxialUndefinedValue extends Exception {
    constructor (source, path) {
      const message = `Undefined value for object path "${path}"`;
      super(message);
      this.source = source;
      this.path = path;
      this.message = message;
    }
  }

  class AxialTypeAlreadyDefined extends Exception {
    constructor (typeName, key, schema) {
      const message = `Type "${typeName}" is already defined for property "${key}" in schema "${schema.name}"`;
      super(message);
      this.typeName = typeName;
      this.key = key;
      this.schema = schema;
      this.message = message;
    }
  }

  class AxialInvalidArgument extends Exception {
    constructor (index, expected, given) {
      const message = `Invalid argument #${index} - Expected "${expected}", given "${given}"`;
      super(message);
      this.index = index;
      this.expected = expected;
      this.given = given;
    }
  }

  class AxialMissingProperty extends Exception {
    constructor (key, iface) {
      const message = `Missing interface ${key} from given object`;
      super(message);
      this.key = key;
      this.iface = iface;
      this.message = message;
    }
  }

  class AxialIllegalProperty extends Exception {
    constructor (key, iface) {
      const message = `Illegal key "${key}" not declared in interface "${iface._name}"`;
      super(message);
      this.key = key;
      this.iface = iface;
      this.message = message;
    }
  }

  const Errors = {
    UnsupportedType: AxialUnsupportedType,
    InvalidType: AxialInvalidType,
    InvalidNumericRange: AxialInvalidNumericRange,
    InvalidStringPattern: AxialInvalidStringPattern,
    UndefinedValue: AxialUndefinedValue,
    TypeAlreadyDefined: AxialTypeAlreadyDefined,
    InvalidArgument: AxialInvalidArgument,
    MissingProperty: AxialMissingProperty,
    IllegalProperty: AxialIllegalProperty
  };

  // -------------------------------------------------------------------------------------- Types
  class AxialType {
    constructor () {
      this._defaultValue = undefined;
      this._baseType = this;
      this._validator = null;
    }

    static get name () {
      return '?';
    }

    get name () {
      return this._name || this.constructor.name;
    }

    validate (value) {
      if (typeof this._validator === 'function') {
        this._validator(value);
        return;
      }
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
      copy._baseType = this.baseType;
      return copy;
    }

    extend (options) {
      const copy = this.clone();
      for (let key in options) {
        if (options.hasOwnProperty(key)) {
          copy['_' + key] = options[key];
        }
      }
      return copy;
    }

    get baseType () {
      return this._baseType ? this._baseType : this;
    }

    defaultValue (value) {
      const copy = this.clone();
      copy._defaultValue = value;
      return copy;
    }
  }

  const AxialTypePrototype = AxialType.prototype;

  class AxialNull extends AxialType {
    constructor () {
      super();
      this._defaultValue = null;
    }

    static get name () {
      return 'null';
    }

    is (value) {
      return value === null;
    }
  }

  class AxialUndefined extends AxialType {
    constructor () {
      super();
      this._defaultValue = undefined;
    }

    static get name () {
      return 'undefined';
    }

    is (value) {
      return typeof value === 'undefined';
    }
  }

  class AxialString extends AxialType {
    constructor () {
      super();
      this._pattern = null;
      this._defaultValue = '';
    }

    validate (value) {
      if (typeof this._validator === 'function') {
        this._validator(value);
        return;
      }
      if (!this.is(value)) {
        if (typeof value !== 'string') {
          throw new AxialInvalidType('string', util.typeOf(value).name);
        }
        throw new AxialInvalidStringPattern(value, this._pattern);
      }
    }

    is (value) {
      return AxialTypePrototype.is.call(this, value)
        && (this._pattern ? !!value.match(this._pattern) : true);
    }

    static get name () {
      return 'string';
    }
  }

  class AxialNumber extends AxialType {
    constructor () {
      super();
      this._min = Number.MIN_SAFE_INTEGER;
      this._max = Number.MAX_SAFE_INTEGER;
      this._defaultValue = 0;
    }

    validate (value) {
      if (typeof this._validator === 'function') {
        this._validator(value);
        return;
      }
      if (!this.is(value)) {
        if (typeof value !== 'number') {
          throw new AxialInvalidType('number', util.typeOf(value).name);
        }
        throw new AxialInvalidNumericRange(value, this._min, this._max);
      }
    }

    is (value) {
      return AxialTypePrototype.is.call(this, value)
        && (value >= this._min && value <= this._max);
    }

    static get name () {
      return 'number';
    }
  }

  class AxialBoolean extends AxialType {
    constructor () {
      super();
      this._defaultValue = false;
    }

    static get name () {
      return 'boolean';
    }
  }

  class AxialDate extends AxialType {
    constructor () {
      super();
      this._defaultValue = new Date();
    }

    static get name () {
      return 'date';
    }

    is (value) {
      return value instanceof Date;
    }
  }

  class AxialRegex extends AxialType {
    constructor () {
      super();
      this._defaultValue = new RegExp('.*', 'i');
    }

    static get name () {
      return 'regex';
    }

    is (value) {
      return value instanceof RegExp;
    }
  }

  class AxialFunction extends AxialType {
    constructor () {
      super();
      this._defaultValue = new Function();
    }

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
      this._defaultValue = [];
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

    validate (value) {
      if (!Array.isArray(value)) {
        throw new AxialInvalidType(this.name, util.typeOf(value).name);
      }
      if (this._type) {
        const l = value.length;
        const t = this._type;
        for (let i = 0; i < l; i++) {
          t.validate(value[i]);
        }
      }
    }
  }

  class AxialObject extends AxialType {
    constructor () {
      super();
      this._defaultValue = {};
    }

    static get name () {
      return 'object';
    }

    is (value) {
      return util.isPlainObject(value) || (typeof value === 'object' && (value !== null && !Array.isArray(value)));
    }
  }

  class AxialInterface extends AxialObject {
    constructor (interfaceName = BLANK_INTERFACE_NAME, prototype, rootInterface) {
      super();

      if (util.isPlainObject(interfaceName) && typeof prototype === 'undefined') {
        // handle case where just single object prototype argument given
        prototype = interfaceName;
        interfaceName = BLANK_INTERFACE_NAME;
      }

      this._name = interfaceName;
      this._properties = new Map();
      this._allProps = new Map();
      this._rootInterface = rootInterface;
      this._methods = new Map();

      this.define(prototype);

      if (interfaceName) {
        Axial.Interface[this._name.replace(/\./g, '_')] = this;
      }

      const _name = this._name;
      _interfaces[_name] = _interfaces[_name] ? _interfaces[_name] : [];
      _interfaces[_name].push(this);
    }

    define (prototype) {
      util.expandDotSyntaxKeys(prototype, (path, key, object) => {
        util.setObjectAtPath(prototype, path, object);
      });

      for (let key in prototype) {
        if (prototype.hasOwnProperty(key)) {
          let definedTypes = {};
          let typeDef = prototype[key];
          let isTypePlainObject = util.isPlainObject(typeDef);
          let typeArray = Array.isArray(typeDef) ? typeDef : [typeDef];

          const path = this._name ? this._name + '.' + key : `${BLANK_INTERFACE_NAME}.` + key;

          if (isTypePlainObject) {
            typeArray = [new AxialInterface(path, typeDef, this.root)];
          } else {
            // check type is only defined once and is AxialType
            for (let i = 0; i < typeArray.length; i++) {
              let t = typeArray[i];
              if (!util.isType(t)) {
                throw new AxialUnsupportedType(t);
              }
              let typeName = t.name;
              if (definedTypes[typeName]) {
                throw new AxialTypeAlreadyDefined(t.name, key, this);
              } else {
                definedTypes[typeName] = true;
              }
            }
          }

          const property = new AxialInterfaceProperty(this, key, typeArray, path);

          if (property.is(Axial.Function)) {
            this._methods.set(key, property.getType(Axial.Function)._defaultValue);
          }

          this._properties.set(key, property);
        }
      }
    }

    create (defaultValues = {}, parentInstance) {
      // create instance
      const instance = new AxialInstance(this, parentInstance);

      // check undefined keys are not being passed
      const isPlainObject = util.isPlainObject(defaultValues);

      if (isPlainObject) {
        util.expandDotSyntaxKeys(defaultValues, (path, key, object) => {
          if (!this._properties.has(key)) {
            throw new AxialIllegalProperty(key, this);
          }
          const prop = this._properties.get(key);
          const subPath = path.split('.').slice(1).join('.');
          const obj = {};
          util.setObjectAtPath(obj, subPath, object);
          defaultValues[key] = prop.primaryInterface.create(obj, instance);
        });
      }

      for (let key in defaultValues) {
        if (isPlainObject && defaultValues.hasOwnProperty(key)) {
          if (!this._properties.has(key)) {
            throw new AxialIllegalProperty(key, this);
          }
        }
      }

      this._properties.forEach((property, key) => {
        // install getters and setters for each property in interface
        let value = defaultValues[key];
        const expectedType = property.type;
        const givenType = util.typeOf(value);

        // expect property definition type to be valid AxialType
        if (defaultValues.hasOwnProperty(key)) {
          property.validate(value);
        }

        // define the getter and setter property of the instance
        instance._defineAccessors(property);

        // if this is an interface, swap with AxialInstance from interface using plain object sub-tree as default values
        if (property.is(Axial.Interface) && !value) {
          value = property.primaryInterface.create(value, instance);
        } else if (!defaultValues.hasOwnProperty(key)) {
          value = property.defaultValue;
        }

        // if this is an array, swap with AxialInstanceArray from array value
        if (Axial.Array.is(value)) {
          value = new AxialInstanceArray(instance, property, value);
        }

        // set the value of the property
        if (typeof value !== 'undefined') {
          property.set(instance, value);
        }
      });

      return instance;
    }

    validate (value) {
      // check value is object
      if (!AxialObject.prototype.is.call(this, value)) {
        throw new AxialInvalidType(util.typeOf(value).name)
      }

      // check value has no extra props
      for (let key in value) {
        if (value.hasOwnProperty(key)) {
          if (_instanceMembers.indexOf(key) === -1 && !this._properties.has(key)) {
            throw new AxialIllegalProperty(key, this);
          }
        }
      }

      // check each prop validates
      for (let [k, property] of this._properties.entries()) {
        if (!value.hasOwnProperty(k)) {
          throw new AxialMissingProperty(k, this);
        }
        property.validate(value[k]);
      }
    }

    is (value) {
      if (!AxialObject.prototype.is.call(this, value)) {
        return false;
      }
      try {
        this.validate(value);
        return true;
      } catch (e) {
        return false;
      }
    }

    has (key) {
      return this._properties.has(key);
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

    get name () {
      return this._name;
    }

    get root () {
      return this._rootInterface ? this._rootInterface : this;
    }

    get isRootInterface () {
      return this.root === this;
    }

    get isSubInterface () {
      return !this.isRootInterface;
    }

    extend (interfaceName, prototype = {}) {
      if (typeof interfaceName !== 'string') {
        // TODO: make proper error
        throw new Error('Interface requires name');
      }
      const iface = new AxialInterface(interfaceName, prototype);
      iface._iparent = this;
      let obj = this;
      while (obj) {
        for (let [key, property] of obj._properties.entries()) {
          if (!iface.has(key)) {
            iface._properties.set(key, property);
            iface._allProps.set(interfaceName + '.' + key, property);
          }
        }
        obj = obj._iparent;
      }
      return iface;
    }
  }

  // -------------------------------------------------------------------------------------- Instances
  class AxialInstance {
    constructor (iface, parentInstance) {
      this._state = {};
      this._iface = iface;
      this._listeners = {};
      this._parentInstance = parentInstance;
      this._isWatching = false;
      this._super = {};

      if (iface) {
        const _name = this._iface._name;
        // track instance
        // TODO: remove from tracking when dispose?
        _instances[_name] = _instances[_name] ? _instances[_name] : [];
        _instances[_name].push(this);

        // go through each Interface _methodIndex and bind to this instance
        // TODO: up through parent interfaces (iparent)
        let ifaceToIndex = iface;
        while (ifaceToIndex) {
          let methods = {};
          this._super[ifaceToIndex.name] = methods;
          for (let [key, fn] of ifaceToIndex._methods.entries()) {
            methods[key] = fn.bind(this);
          }
          ifaceToIndex = ifaceToIndex._iparent;
        }
      }
    }

    _defineAccessors (property) {
      const key = property.key;
      if (this.hasOwnProperty(key)) {
        // TODO: use real error
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
      return this._iface.prop(path);
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
          // dispatch for each event listener to interface keys
          listeners[i](eventData);
        }
      }
    }

    get _root () {
      let obj = this._parentInstance;
      let root = this;
      while (obj) {
        root = obj;
        obj = obj._parentInstance;
      }
      return root;
    }

    _value (path, shouldThrowIfNotFound) {
      const root = this._root;
      return util.getObjectAtPath(root, path, shouldThrowIfNotFound);
    }

    get _watch () {
      return this._isWatching;
    }

    set _watch (bool) {
      if (bool && this._isWatching) {
        return;
      }
      if (!bool && this._isWatching) {
        clearInterval(this._watchIntervalId);
      }
      this._isWatching = bool;
      if (bool) {
        const props = this._iface._properties;
        this._watchIntervalId = setInterval(() => {
          for (let key in this) {
            if (this.hasOwnProperty(key) && _instanceMembers.indexOf(key) === -1 && !props.has(key)) {
              clearInterval(this._watchIntervalId);
              throw new AxialIllegalProperty(key, this._iface);
            }
          }
        }, 30);
      }
    }
  }

  class AxialInterfaceProperty {
    constructor (iface, key, type, path) {
      this._iface = iface;
      this._key = key;
      this._type = type;
      this._path = path;
      iface.root._allProps.set(path, this);
    }

    is (type) {
      const t = this._type;
      const l = t.length;
      for (let i = 0; i < l; i++) {
        const pType = t[i];
        if (pType instanceof type.constructor) {
          if (pType instanceof AxialArray) {
            if (type._type && pType._type !== type._type) {
              return false;
            }
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
      let errors = [];
      let rawValue = value;
      if (value instanceof AxialInstanceArray) {
        value = value._array;
      }
      for (let i = 0; i < l; i++) {
        let type = t[i];
        try {
          type.validate(value);
          hasValidated = true;
        } catch (e) {
          e.key = this.key;
          errors.push({type:type, error:e});
        }
      }
      if (!hasValidated) {
        for (let i = 0; i < errors.length; i++) {
          if (errors[i].type.baseType.is(value)) {
            throw errors[i].error;
          }
        }

        throw new AxialInvalidType(util.typeOf(value).name, t.map(x => x.name).join('|'), this._key, this._iface);
      }
    }

    /**
     * setter
     * @param instance
     * @param value
     */
    set (instance, value) {
      const oldValue = instance._state[this._key];
      const rawValue = value;

      console.log('%cSET: ' + this._path + ':<' + this._type.join('|') + '> = ' + util.stringify(value), 'color:orange');

      this.validate(value);

      // convert to AxialInstance if Interface and object given
      if (this.is(Axial.Interface) && util.isPlainObject(value)) {
        for (let i = 0; i < this._type.length; i++) {
          if (this._type[i] instanceof AxialInterface) {
            if (this._type[i].is(value)) {
              value = this._type[i].create(value, instance);
              break;
            }
          }
        }
      }

      // convert to AxialInstanceArray if array
      if (this.is(Axial.Array()) && Array.isArray(value)) {
        value = new AxialInstanceArray(instance, this, value);
      }

      // convert to bound function (if function)
      if (this.is(Axial.Function) && typeof value === 'function' && !value._isAxialBound) {
        const fn = value;
        value = function () {
          const args = [];
          const l = arguments.length;
          for (let i = 0; i < l; i++) {
            try {
              args.push(JSON.stringify(arguments[i]));
            } catch (e) {
              args.push(util.typeOf(arguments[i]).name);
            }
          }
          console.log('%cCALL: ' + this._key + `(${args.length ? '<' : ''}` + args.join('>, <') + `${args.length ? '>' : ''})`, 'color:pink');

          instance._dispatch(this._key, {
            instance: instance,
            property: this,
            method: 'call',
            key: this._key,
            value: arguments,
            arguments: arguments,
            newValue: fn,
            oldValue: fn
          });

          return fn.apply(instance, arguments);
        }.bind(this);
        value._isAxialBound = true;
      }

      // set state in obj
      instance._state[this._key] = value;

      // dispatch event
      instance._dispatch(this._key, {
        instance: instance,
        property: this,
        method: 'set',
        key: this._key,
        value: rawValue,
        newValue: value,
        oldValue: oldValue
      });
    }

    /**
     * getter
     * @param instance
     * @returns {*}
     */
    get (instance) {
      const value = instance._state[this._key];

      console.log('%cGET: ' + this._path + ':<' + this._type.join('|') + '> = ' + util.stringify(value), 'color:#999');

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

    getType (type) {
      for (let i = 0; i < this._type.length; i++) {
        if (this._type[i].constructor === type.constructor) {
          return this._type[i];
        }
      }
      // TODO: proper error
      throw new Error('Type not found');
    }

    get path () {
      return this._path;
    }

    get iface () {
      return this._iface;
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

    get isInterface () {
      return this.is(Axial.Interface);
    }

    get primaryType () {
      return this._type[0];
    }

    get primaryInterface () {
      return this._type.find(type => type instanceof AxialInterface);
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
      _bindings.push(this);
    }

    unbind () {
      this._instance._unbind(this._key, this._handler);
      this._active = false;
      const i = _bindings.indexOf(this);
      _bindings.splice(i, 1);
    }

    dispose () {
      if (this._active) {
        this.unbind();
      }
      delete this._instance;
      delete this._handler;
    }

    get () {
      return this._instance._state[this._key];
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

  class AxialInstanceArray {
    constructor (instance, property, array = []) {
      this._instance = instance;
      this._property = property;
      this._key = property.key;
      this._array = array;

      _arrayMembers.forEach(member => {
        // handle immutable array methods
        let fn = function () {
          let returnValue = Array.prototype[member].apply(array, arguments);

          property.validate(array);

          if (_arrayMutators.indexOf(member) > -1) {
            // dispatch event
            instance._dispatch(this._key, {
              instance: instance,
              property: this._property,
              method: 'set',
              arrayMethod: member,
              key: this._key,
              value: returnValue,
              newValue: this,
              oldValue: null
            });
          }

          return returnValue;
        };

        // TODO: refactor/work this - need clear plan for different methods...
        // can this be merged with above? simplify and make parts dynamic?

        if (member === 'push' || member === 'splice') {
          fn = function () {
            const args = Array.prototype.slice.call(arguments);

            if (member === 'push') {
              property.validate(args);
            } else if (member === 'splice') {
              property.validate(args.slice(2));
            }

            let returnValue = Array.prototype[member].apply(array, args);
            this.length = array.length;

            if (_arrayMutators.indexOf(member) > -1) {
              // dispatch event
              instance._dispatch(this._key, {
                instance: instance,
                property: this._property,
                method: 'set',
                arrayMethod: member,
                key: this._key,
                value: returnValue,
                newValue: this,
                oldValue: null
              });
            }

            return returnValue;
          };
        }

        // stub each member of Array.prototype
        Object.defineProperty(this, member, {
          enumerable: false,
          value: fn
        });
      });
    }
  }

  // -------------------------------------------------------------------------------------- Util
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
      } else if (T.Interface.is(value)) {
        return T.Interface;
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
    },

    getObjectPaths (obj, includeBranchPaths) {
      let keys = [];
      let ref = null;
      let path = null;
      let walk = (o, p) => {
        for (let k in o) {
          if (o.hasOwnProperty(k)) {
            ref = o[k];
            path = p ? p + '.' + k : k;
            if (this.isPlainObject(ref)) {
              if (includeBranchPaths === true) {
                keys.push(path);
              }
              walk(ref, path);
            } else {
              keys.push(path);
            }
          }
        }
      };
      walk(obj);
      return keys;
    },

    getObjectPathValues (obj, includeBranchPaths) {
      let keyValues = [];
      let ref = null;
      let path = null;
      let walk = (o, p) => {
        for (let k in o) {
          if (o.hasOwnProperty(k)) {
            ref = o[k];
            path = p ? p + '.' + k : k;
            if (this.isPlainObject(ref)) {
              if (includeBranchPaths === true) {
                keyValues.push({path:path, value:ref, isBranch:true});
              }
              walk(ref, path);
            } else {
              keyValues.push({path:path, value:ref, isBranch:false});
            }
          }
        }
      };
      walk(obj);
      return keyValues;
    },

    getObjectAtPath (obj, path, shouldThrowIfNotFound) {
      let steps = path.split('.');
      let l = steps.length;
      let ref = obj;
      let k = null;
      for (let i = 0; i < l; i++) {
        k = steps[i];
        ref = ref[k];
        if (ref === null || typeof ref === 'undefined') {
          if (shouldThrowIfNotFound === true) {
            throw new AxialUndefinedValue(obj, path);
          }
          return ref;
        }
      }
      return ref;
    },

    setObjectAtPath (obj, path, value) {
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
    },

    multiSetObjectAtPath (obj, pathOrObject, value) {
      let modifiedPaths = null;
      if (this.isPlainObject(pathOrObject)) {
        this.merge(obj, pathOrObject);
        modifiedPaths = this.getObjectPaths(pathOrObject);
      } else if (typeof pathOrObject === 'string') {
        this.setObjectAtPath(obj, pathOrObject, value);
        modifiedPaths = [pathOrObject];
      }
      return modifiedPaths;
    },

    expandDotSyntaxKeys (obj, resolver) {
      for (let path in obj) {
        if (obj.hasOwnProperty(path)) {
          if (path.indexOf('.') > -1) {
            const key = path.split('.')[0];
            resolver(path, key, obj[path]);
            delete obj[path];
          }
        }
      }
      return obj;
    },

    stringify (value) {
      if (T.Object.is(value)) {
        return '{' + Object.keys(value).map(k => k + ':<' + typeof value[k] + '>') + '}';
      } else if (T.Function.is(value)) {
        return 'function () {..}';
      } else {
        return JSON.stringify(value);
      }
    }
  };

  // -------------------------------------------------------------------------------------- Define Types
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
        t._baseType = this.Array();
        t._name = 'array[' + typeId + ']';
      }
      return t;
    },
    Object: new AxialObject,
    Interface: new AxialInterface(null)
  };

  Object.keys(T).forEach(typeName => {
    T[typeName].orUndefined = function () {
      return [T[typeName], Axial.Undefined];
    };
    T[typeName].orNull = function () {
      return [T[typeName], Axial.Null];
    };
    T[typeName].orUndefinedOrNull = function () {
      return [T[typeName], Axial.Undefined, Axial.Null];
    };
  });

  T.Array.is = function (value) {
    return Array.isArray(value);
  };
  T.Array.Type = T.Array();

  // -------------------------------------------------------------------------------------- Axial
  let Axial = {
    define (name, prototype) {
      return new AxialInterface(name, prototype);
    },
    getInterface (name = 'null') {
      const ifaceArray = _interfaces[name];
      if (ifaceArray) {
        return ifaceArray[ifaceArray.length - 1];
      }
    },
    interfaceNames () {
      return Object.keys(_interfaces).filter(name => _interfaces[name].isRootInterface);
    },
    interfaces () {
      const o = {};
      this.interfaceNames().forEach(name => o[name] = _interfaces[name]);
      return o;
    },
    get instances () {
      return _instances;
    },
    get bindings () {
      return _bindings;
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

  // export for testing
  window.Axial = Axial;

  // merge in types and errors
  util.merge(Axial, T);
  util.merge(Axial, Errors);

  // extend Axial public interface
  Axial.Instance = new AxialInstance();
  Axial.util = util;

  // extend misc types public interface
  AxialInterface.prototype.new = AxialInterface.prototype.create;
  AxialType.prototype.set = AxialType.prototype.defaultValue;

  return Axial;
})();