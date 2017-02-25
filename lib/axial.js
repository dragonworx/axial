module.exports = (function Define_Axial () {
  const CONST = require('./const');
  const PROXY_KEY = CONST.PROXY_KEY;
  const BLANK_INTERFACE_NAME = CONST.BLANK_INTERFACE_NAME;
  const _arrayTypes = {};
  const _listeners = [];
  const _interfaces = {};
  const _instances = {};
  const _bindings = [];
  const _arrayMembers = CONST.ARRAY_MEMBERS;
  const _arrayMutators = CONST.ARRAY_MUTATORS;
  const _logListeners = {};

  let _logListenerCount = 0;
  let _pushId = 0;
  let util, T;
  let _instanceId = 0, _interfaceId = 0, _instanceArrayId = 0;

  function _proxy(instance) {
    return instance[PROXY_KEY];
  }

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
    constructor (given, expected, instance, property) {
      const instString = instance ? _proxy(instance).toString() : '?';
      const message = 'Invalid type for property "' + property.path + `" ~ "${given}" given, "${expected}" expected`;
      super(message);
      this.given = given;
      this.expected = expected;
      this.instance = instance;
      this.property = property;
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
    constructor (key, iface, object) {
      const message = `Missing interface property "${key}" from given object`;
      super(message);
      this.key = key;
      this.object = object;
      this.iface = iface;
      this.message = message;
    }
  }

  class AxialIllegalProperty extends Exception {
    constructor (key, iface, instance) {
      const message = `Illegal key "${key}" not declared in interface "${iface._name}"`;
      super(message);
      this.key = key;
      this.iface = iface;
      this.instance = instance;
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
      this._required = false;
      this._baseType = this;
      this._validator = null;
    }

    static get name () {
      return '?';
    }

    get name () {
      return this._name || this.constructor.name;
    }

    validate (value, instance, property) {
      if (typeof this._validator === 'function') {
        this._validator(value, instance, property);
        return;
      }
      if (!this.is(value)) {
        //given, expected, key, instance
        throw new AxialInvalidType(this.name, util.typeOf(value).name, instance, property);
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
      if (util.isPlainObject(options)) {
        for (let key in options) {
          if (options.hasOwnProperty(key)) {
            copy['_' + key] = options[key];
          }
        }
      } else if (typeof options !== 'undefined') {
        copy._defaultValue = options;
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

    required () {
      const copy = this.clone();
      copy._required = true;
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

    validate (value, instance, property) {
      if (typeof this._validator === 'function') {
        this._validator(value, instance, property);
        return;
      }
      if (!this.is(value)) {
        if (typeof value !== 'string') {
          throw new AxialInvalidType(util.typeOf(value).name, 'string', instance, property);
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

    validate (value, instance, property) {
      if (typeof this._validator === 'function') {
        this._validator(value, instance, property);
        return;
      }
      if (!this.is(value)) {
        if (typeof value !== 'number') {
          throw new AxialInvalidType('number', util.typeOf(value).name, instance, property);
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

    isItem (item) {
      if (this._type) {
        return util.typeOf(item).name === this._type.name;
      }
      return true;
    }

    validate (value, instance, property) {
      if (!Array.isArray(value)) {
        throw new AxialInvalidType(this.name, util.typeOf(value).name, instance, property);
      }
      if (this._type) {
        const l = value.length;
        const t = this._type;
        for (let i = 0; i < l; i++) {
          t.validate(value[i], instance, property);
        }
      }
    }

    get type () {
      return this._type;
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

      if (interfaceName === BLANK_INTERFACE_NAME) {
        interfaceName += ++_interfaceId;
      }

      this._name = interfaceName;
      this._properties = new Map();
      this._allProps = new Map();
      this._rootInterface = rootInterface;
      this._methods = new Map();

      this.define(prototype);

      if (interfaceName) {
        Axial.Interface[this._name] = this;
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
          typeArray = util.expandArray(typeArray);

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
      const instance = new AxialInstance();
      const proxy = new AxialInstanceProxy(instance, this, parentInstance);

      // check undefined keys are not being passed
      const isPlainObject = util.isPlainObject(defaultValues);

      if (isPlainObject) {
        util.expandDotSyntaxKeys(defaultValues, (path, key, object) => {
          if (!this._properties.has(key)) {
            throw new AxialIllegalProperty(key, this, instance);
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
            throw new AxialIllegalProperty(key, this, instance);
          }
        }
      }

      this._properties.forEach((property, key) => {
        // install getters and setters for each property in interface
        let value = defaultValues[key];

        // expect property definition type to be valid AxialType
        if (defaultValues.hasOwnProperty(key)) {
          property.validate(value, instance);
        }

        // define the getter and setter property of the instance
        instance[Axial.PROXY_KEY].defineAccessors(property);

        // if this is an interface, swap with AxialInstance from interface using plain object sub-tree as default values
        if (property.is(Axial.Interface) && !value) {
          value = property.primaryInterface.create(value, instance);
        } else if (!defaultValues.hasOwnProperty(key)) {
          if (property.isRequired) {
            throw new AxialMissingProperty(key, this, defaultValues);
          } else {
            value = property.defaultValue;
          }
        }

        // set the value of the property
        if (typeof value !== 'undefined') {
          property.set(instance, value);
        }
      });

      return instance;
    }

    validate (value, instance, property) {
      // check value is object
      if (!AxialObject.prototype.is.call(this, value)) {
        throw new AxialInvalidType(util.typeOf(value).name, this.name, instance, property);
      }

      // check value has no extra props
      for (let key in value) {
        if (value.hasOwnProperty(key)) {
          if (key !== Axial.PROXY_KEY && !this._properties.has(key)) {
            throw new AxialIllegalProperty(key, this, instance);
          }
        }
      }

      // check each prop validates
      for (let [k, property] of this._properties.entries()) {
        if (!value.hasOwnProperty(k) && property.isRequired && !property.primaryType instanceof AxialFunction) {
          throw new AxialMissingProperty(k, this, value);
        }
        if (value.hasOwnProperty(k)) {
          property.validate(value[k], instance);
        }
      }
    }

    is (value) {
      if (this._name === null) {
        // the initial Interface type will never match values
        return false;
      }

      if (!AxialObject.prototype.is.call(this, value)) {
        return false;
      }

      // check has no extra props
      for (let key in value) {
        if (value.hasOwnProperty(key)) {
          if (!this._properties.has(key)) {
            return false;
          }
        }
      }

      // check each prop validates
      for (let [k, property] of this._properties.entries()) {
        if (property.primaryType instanceof AxialFunction) {
          continue;
        }
        if (!value.hasOwnProperty(k)) {
          return false;
        }
        try {
          property.validate(value[k]);
        } catch (e) {
          return false;
        }
      }

      return true;
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

    forEach (fn) {
      for (let [key, property] of this._properties) {
        fn(property, key);
      }
    }

    keys () {
      const keys = [];
      for (let path of this.root._allProps.keys()) {
        keys.push(path);
      }
      return keys;
    }

    get name () {
      return this._name;
    }

    set name (name) {
      if (this._name) {
        delete Axial.Interface[this._name];
        //test-all gone?
      }
      this._name = name;
      Axial.Interface[this._name] = this;
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

  }

  class AxialInstanceProxy {
    constructor(instance, iface, parentInstance) {
      instance[Axial.PROXY_KEY] = this;
      this._instance = instance;
      this._state = {};
      this._iface = iface;
      this._listeners = {};
      this._parentInstance = parentInstance;
      this._isWatching = false;
      this._super = {};
      this._instanceId = ++_instanceId;
      this._history = [];

      if (iface) {
        const _name = iface._name;
        // track instance
        // TODO: remove from tracking when dispose?
        _instances[_name] = _instances[_name] ? _instances[_name] : [];
        _instances[_name].push(this._instance);

        // go through each AxialInterface._methods and bind copy to this instance
        let ifaceToIndex = iface;
        while (ifaceToIndex) {
          let methods = {};
          this._super[ifaceToIndex.name] = methods;
          for (let [key, fn] of ifaceToIndex._methods.entries()) {
            methods[key] = fn.bind(this._instance);
          }
          ifaceToIndex = ifaceToIndex._iparent;
        }
      }
    }

    defineAccessors(property) {
      const key = property.key;
      if (this._instance.hasOwnProperty(key)) {
        // TODO: use real error
        throw new Error('Illegal property key');
      }
      Object.defineProperty(this._instance, key, {
        // create setter for instance
        set: function (value) {
          // wrap property setter
          return property.set(this._instance, value);
        }.bind(this),
        // create getter for instance
        get: function () {
          // wrap property getter
          return property.get(this._instance);
        }.bind(this)
      });
    }

    equals (instance) {
      if (this === instance) {
        return true;
      }
      if (util.isPlainObject(instance)) {
        try {
          instance = this._iface.create(instance);
        } catch (e) {
          return false;
        }
      }
      if (!(instance instanceof AxialInstance)) {
        return false;
      }
      for (let [key, property] of this._iface._properties.entries()) {
        const sourceValue = this._state[key];
        const targetValue = instance[key];
        if (sourceValue instanceof AxialInstance) {
          if (targetValue instanceof AxialInstance) {
            return sourceValue[PROXY_KEY].equals(targetValue);
          } else {
            return false;
          }
        } else if (sourceValue instanceof AxialInstanceArray) {
          if (targetValue instanceof AxialInstanceArray) {
            return sourceValue.equals(targetValue);
          } else {
            return false;
          }
        } else if (sourceValue !== targetValue) {
          return false;
        }
      }
      return true;
    }

    bind(key, fn) {
      this._listeners[key] = this._listeners[key] ? this._listeners[key] : [];
      this._listeners[key].push(fn);
    }

    prop(path) {
      return this._iface.prop(path);
    }

    forEach(fn) {
      const iface = this._iface;
      for (let key of iface._properties.keys()) {
        fn(key, this._state[key]);
      }
      return this;
    }

    map(fn) {
      const array = [];
      const iface = this._iface;
      for (let key of iface._properties.keys()) {
        array.push(fn(key, this._state[key]));
      }
      return array;
    }

    unbind(key, fn) {
      if (arguments.length === 0) {
        this._listeners = {};
      } else if (key && !fn) {
        this._listeners[key].length = 0;
      } else {
        const index = this._listeners[key].indexOf(fn);
        this._listeners[key].splice(index, 1);
      }
    }

    dispatch(key, eventData) {
      // dispatch globally too
      let returnValue = Axial.dispatch(eventData);
      if (returnValue) {
        return returnValue;
      }
      const listeners = this._listeners[key];
      if (listeners) {
        const l = listeners.length;
        for (let i = 0; i < l; i++) {
          // dispatch for each event listener to interface keys
          returnValue = listeners[i](eventData);
          if (returnValue) {
            return returnValue;
          }
        }
      }
    }

    dispose() {
      //test-all gone?
      this._iface.forEach((property, key) => {
        const item = this._state[key];
        if (typeof item.dispose === 'function') {
          item.dispose();
        }
        delete this._state[key];
        delete this._instance[key];
      });
      delete this._instance[Axial.PROXY_KEY];
    }

    get root() {
      let obj = this._parentInstance;
      let root = this;
      while (obj) {
        root = obj;
        obj = obj._parentInstance;
      }
      return root;
    }

    get super() {
      return this._super;
    }

    value(path, shouldThrowIfNotFound) {
      const root = this.root;
      return util.getObjectAtPath(root, path, shouldThrowIfNotFound);
    }

    lock() {
      if (this._isWatching) {
        return;
      }
      this._isWatching = true;
      const props = this._iface._properties;
      this._watchIntervalId = setInterval(() => {
        const instance = this._instance;
        for (let key in instance) {
          if (instance.hasOwnProperty(key) && key !== Axial.PROXY_KEY && !props.has(key)) {
            clearInterval(this._watchIntervalId);
            delete instance[key];
            throw new AxialIllegalProperty(key, this._iface, this);
          }
        }
      }, 30);
      return true;
    }

    get isLocked () {
      return this._isWatching;
    }

    unlock () {
      if (!this._isWatching) {
        return;
      }
      this._isWatching = false;
      clearInterval(this._watchIntervalId);
      return true;
    }

    get(key, defaultValue) {
      const value = this.instance[key];
      return this._state.hasOwnProperty(key) ? value : defaultValue;
    }

    set(key, value) {
      this.instance[key] = value;
    }

    toPlainObject() {
      const json = {};
      for (let key of this._iface._properties.keys()) {
        const value = this._state[key];
        const type = typeof value;
        if (value instanceof AxialInstance) {
          json[key] = value[Axial.PROXY_KEY].toPlainObject();
        } else if (value instanceof AxialInstanceArray) {
          json[key] = value.toPlainObject();
        } else if (type === 'string' || type === 'number' || type === 'boolean' || util.isPlainObject(value)) {
          json[key] = value;
        }
      }
      return json;
    }

    stringify (prettyPrint) {
      return JSON.stringify.call(null, this.toPlainObject(), null, prettyPrint === true ? 4 : undefined);
    }

    push(name) {
      if (!name) {
        name = '' + ++_pushId;
      }
      try {
        const history = {
          name: name,
          time: Date.now(),
          state: this.stringify()
        };
        this._history.push(history);
      } catch (e) {
        // TODO: proper error
        throw new Error('Cannot serialise state for history - ' + e.message);
      }
      return name;
    }

    get instance() {
      return this._instance;
    }

    get instanceId() {
      return this._instanceId;
    }

    get iface() {
      return this._iface;
    }

    toString () {
      return '(AxialInstance)' + this._iface.name + '#' + this._instanceId;
//      return util.stringify(this._instance);
    }
  }

  class AxialInterfaceProperty {
    constructor (iface, key, types, path) {
      this._iface = iface;
      this._key = key;
      this._types = types;
      this._path = path;
      iface.root._allProps.set(path, this);
    }

    is (type) {
      const t = this._types;
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

    validate (value, instance) {
      const t = this._types;
      const l = t.length;
      let hasValidated = false;
      let errors = [];
      if (value instanceof AxialInstanceArray) {
        value = value._array;
      }
      for (let i = 0; i < l; i++) {
        let type = t[i];
        try {
          type.validate(value, instance, this);
          hasValidated = true;
        } catch (e) {
          e.key = this.key;
          errors.push({type:type, error:e});
        }
      }
      if (!hasValidated) {
        throw errors[0].error;
      }
    }

    /**
     * setter
     * @param instance
     * @param value
     */
    set (instance, value) {
      const oldValue = instance[Axial.PROXY_KEY]._state[this._key];
      const rawValue = value;

      this.validate(value, instance);

      // convert to AxialInstance if Interface and object given
      if (this.is(Axial.Interface) && util.isPlainObject(value)) {
        const iface = this.primaryInterface;
        value = iface.create(value, instance);
      }

      // convert to AxialInstanceArray if array
      if (this.is(Axial.Array()) && Array.isArray(value)) {
        value = new AxialInstanceArray(instance, this, value);
      }

      // convert to bound function (if function)
      if (this.is(Axial.Function) && typeof value === 'function' && !value._isAxialBound) {
        const fn = value;
        value = function () {
          // dispatch call, execute function
          instance[Axial.PROXY_KEY].dispatch(this._key, {
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

      // set state
      instance[Axial.PROXY_KEY]._state[this._key] = value;

      // dispatch event
      const returnValue = instance[Axial.PROXY_KEY].dispatch(this._key, {
        instance: instance,
        property: this,
        method: 'set',
        key: this._key,
        value: rawValue,
        newValue: value,
        oldValue: oldValue
      });

      if (returnValue) {
        // re-set state from intercepted listener return value
        instance[this._key] = returnValue;
      }
    }

    /**
     * getter
     * @param instance
     * @returns {*}
     */
    get (instance) {
      const value = instance[Axial.PROXY_KEY]._state[this._key]

      // dispatch event
      instance[Axial.PROXY_KEY].dispatch(this._key, {
        instance: instance,
        property: this,
        method: 'get',
        key: this._key,
        value: value
      });

      return value;
    }

    getType (type) {
      for (let i = 0; i < this._types.length; i++) {
        if (this._types[i].constructor === type.constructor) {
          return this._types[i];
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

    get types () {
      return this._types;
    }

    get defaultValue () {
      return this.primaryType._defaultValue;
    }

    get isSingleType () {
      return this._types.length === 1;
    }

    get isInterface () {
      return this.is(Axial.Interface);
    }

    get primaryType () {
      return this._types[0];
    }

    get primaryInterface () {
      return this._types.find(type => type instanceof AxialInterface);
    }

    get primaryArrayType () {
      const array = this._types.find(type => type instanceof AxialArray);
      return array ? array.type : null;
    }

    get isRequired () {
      for (let i = 0; i < this._types.length; i++) {
        if (this._types[i]._required) {
          return true;
        }
      }
      return false;
    }

    toString () {
      return this._iface.name + '#' + this._instanceId;
    }
  }

  class AxialBinding {
    constructor (instance, key, handler) {
      this._instance = instance;
      this._key = key;
      this._property = instance[Axial.PROXY_KEY].prop(this._key);
      this._handler = handler;
      this._active = false;
    }

    bind () {
      this._instance[Axial.PROXY_KEY].bind(this._key, this._handler);
      this._active = true;
      _bindings.push(this);
    }

    unbind () {
      this._instance[Axial.PROXY_KEY].unbind(this._key, this._handler);
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
      return this._instance[Axial.PROXY_KEY]._state[this._key];
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

    toString () {
      return this._instance[PROXY_KEY].toString() + ':' + this._key;
    }
  }

  class AxialInstanceArray {
    constructor (instance, property, array = []) {
      this._instance = instance;
      this._instanceId = ++_instanceArrayId;
      this._property = property;
      this._key = property.key;
      this._indexLength = null;
      const self = this;

      // expand items to instances if interface type
      this._array = array;
      if (array.length) {
        this._array = this.convertArray(array);
        this.length = this._array.length;
      }

      _arrayMembers.forEach(member => {
        // stub each member of Array.prototype
        // validate arguments if mutator...
        Object.defineProperty(this, member, {
          enumerable: false,
          value: function () {
            let args = Array.prototype.slice.call(arguments);
            const isMutator = _arrayMutators.indexOf(member) > -1;
            let hasValidated = true;

            if (member === 'push') {
              property.validate(args, self._instance);
              args = this.convertArray(args);
            } else if (member === 'splice') {
              if (args.length > 2) {
                // inserting
                property.validate(args.slice(2), self._instance);
              }
              args = this.convertArray(args);
            } else if (member === 'unshift') {
              property.validate(args, self._instance);
              args = this.convertArray(args);
            } else if (member === 'fill') {
              property.primaryType.isItem(args);
              args = [args[0]];
              args = this.convertArray(args);
            } else {
              hasValidated = true;
            }

            let returnValue = Array.prototype[member].apply(this._array, args);
            this.length = this._array.length;

            // ...otherwise validate array (is valid type?) afterwards
            if (!hasValidated) {
              property.validate(this._array, self._instance);
            }

            // if this is an array mutator method, dispatch event
            if (isMutator) {
              self.bindIndexes();
              instance[Axial.PROXY_KEY].dispatch(this._key, {
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
          }
        });
      });

      this.bindIndexes();
    }

    convertArray (rawArray) {
      // convert plain array to array of wrapped objects ~ AxialInstance or AxialInstanceArray or value
      const array = [];
      const l = rawArray.length;
      for (let i = 0; i < l; i++) {
        const item = rawArray[i];
        if (item instanceof AxialInstance || item instanceof AxialInstanceArray) {
          array[i] = item;
          continue;
        }
        const type = Axial.typeOf(item);
        if (type instanceof AxialInterface) {
          // create instance of interface with item as default values
          array[i] = type.create(item, this._instance);
          continue;
        } else if (type instanceof AxialArray) {
          array[i] = new AxialInstanceArray(this._instance, this._property, item);
          continue;
        }
        // plain value
        array[i] = item;
      }
      return array;
    }

    equals (array) {
      if (this === array) {
        return true;
      }
      const targetArray = array instanceof AxialInstanceArray ? array._array : array;
      if (array.length !== this.length || !Array.isArray(targetArray)) {
        return false;
      }
      // iterate through and check equal items
      const l = targetArray.length;
      const sourceArray = this._array;
      for (let i = 0; i < l; i++) {
        const sourceItem = sourceArray[i];
        const targetItem = targetArray[i];
        if (sourceItem instanceof AxialInstance) {
          if (targetItem instanceof AxialInstance) {
            return sourceItem[PROXY_KEY].equals(targetItem);
          } else {
            return false;
          }
        } else if (sourceItem instanceof AxialInstanceArray) {
          if (targetItem instanceof AxialInstanceArray) {
            return sourceItem[PROXY_KEY].equals(targetItem);
          } else {
            return false;
          }
        } else if (sourceItem !== targetItem) {
          return false;
        }
      }
      return true;
    }

    bindIndexes () {
      const array = this._array;
      const instance = this._instance;
      const property = this._property;
      // delete previous indexes
      if (this._indexLength) {
        const l = this._indexLength;
        for (let i = 0; i < l; i++) {
          delete this[i];
        }
      }
      // write each index as an accessor
      const l = array.length + 1;
      for (let i = 0; i < l; i++) {
        this._indexLength++;
        const key = '' + i;
        if (!this.hasOwnProperty(key)) {
          Object.defineProperty(this, key, {
            get: function () {
              // dispatch event
              instance[Axial.PROXY_KEY].dispatch(property.key, {
                instance: instance,
                property: property,
                arrayMethod: 'index',
                method: 'get',
                index: i,
                key: property.key,
                value: array[i]
              });
              return array[i];
            },
            set: function (value) {
              const oldValue = array[i];
              const rawValue = value;

              property.validate([value], instance);

              // convert to AxialInstance if Interface and object given
              const arrayType = property.primaryArrayType;
              if (arrayType && util.isPlainObject(value) && arrayType.is(value)) {
                value = arrayType.create(value, instance);
              }

              // convert to AxialInstanceArray if array
              if (property.is(Axial.Array()) && Array.isArray(value)) {
                value = new AxialInstanceArray(instance, property, value);
              }

              // convert to bound function (if function)
              if (property.is(Axial.Function) && typeof value === 'function' && !value._isAxialBound) {
                const fn = value;
                value = function () {
                  // dispatch call, execute function
                  instance[Axial.PROXY_KEY].dispatch(property._key, {
                    instance: instance,
                    property: property,
                    method: 'call',
                    key: property._key,
                    value: arguments,
                    arguments: arguments,
                    newValue: fn,
                    oldValue: fn
                  });

                  return fn.apply(instance, arguments);
                }.bind(this);
                value._isAxialBound = true;
              }

              array[i] = value;

              instance[Axial.PROXY_KEY].dispatch(property.key, {
                instance: instance,
                property: property,
                arrayMethod: 'index',
                method: 'set',
                index: i,
                key: property.key,
                value: value,
                oldValue: oldValue,
                newValue: rawValue
              });
            },
            enumerable: true,
            configurable: true
          });
        }
      }
    }

    add (/*items, ...*/) {
      const items = util.argsToItems.apply(null, arguments);
      this.push.apply(this, items);
    }

    remove (/*items, ...*/) {
      const array = this._array;
      const items = util.argsToItems.apply(null, arguments);
      const l = items.length;
      for (let i = 0; i < l; i++) {
        const item = items[i];
        const index = array.indexOf(item);
        this._array.splice(index, 1);
      }
      this.length = this._array.length;
    }

    contains (/*items, ...*/) {
      const items = util.argsToItems.apply(null, arguments);
      const l = items.length;
      const array = this._array;
      for (let i = 0; i < l; i++) {
        if (array.indexOf(items[i]) > -1) {
          return true;
        }
      }
      return false;
    }

    get isEmpty() {
      return this.length === 0;
    }

    get instance () {
      return this._instance;
    }

    get instanceId () {
      return this._instanceId;
    }

    get property () {
      return this._property;
    }

    get key () {
      return this._key;
    }

    get array () {
      return this._array;
    }

    toPlainObject () {
      const array = [];
      const l = this._array.length;
      for (let i = 0; i < l; i++) {
        const item = this._array[i];
        if (item instanceof AxialInstance) {
          array[i] = _proxy(item).toPlainObject();
        } else if (item instanceof AxialInstanceArray) {
          array[i] = item.toPlainObject();
        } else {
          array[i] = item;
        }
      }
      return array;
    }

    stringify (prettyPrint) {
      return JSON.stringify.call(null, this.toPlainObject(), null, prettyPrint === true ? 4 : undefined);
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
      if (value instanceof AxialInstance) {
        return value[PROXY_KEY]._iface;
      }
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
                keyValues.push({path: path, value: ref, isBranch: true});
              }
              walk(ref, path);
            } else {
              keyValues.push({path: path, value: ref, isBranch: false});
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

    expandArray (inArray, outArray = []) {
      const l = inArray.length;
      for (let i = 0; i < l; i++) {
        const item = inArray[i];
        if (Array.isArray(item)) {
          this.expandArray(item, outArray);
        } else {
          outArray[outArray.length] = item;
        }
      }
      return outArray;
    },

    stringify (value) {
      if (typeof value === 'function') {
        return 'function () {...}';
      }
      if (Array.isArray(value)) {
        return '[#' + value.length + ']';
      }
      if (value instanceof AxialInstance) {
        const props = _proxy(value).map((k, v) => k + ':' + this.stringify(v));
        return '*' + value[PROXY_KEY].iface.name + '#' + value[PROXY_KEY].instanceId + '{' + props.join(', ') + '}';
      }
      if (value instanceof AxialInstanceArray) {
        const items = value.map(item => '<' + Axial.typeOf(item).name + '>:' + this.stringify(item));
        return '*array#' + value.instanceId + '[' + items.join(', ') + ']';
      }
      try {
        return JSON.stringify(value);
      } catch (e) {
        return '' + value;
      }
    },

    argsToItems () {
      const array = [];
      const l = arguments.length;
      if (l === 1 && Array.isArray(arguments[0])) {
        array.push.apply(array, arguments);
      } else if (l > 0) {
        for (let i = 0; i < l; i++) {
          const item = arguments[i];
          array.push(item);
        }
      }
      return array;
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
  const Axial = {
    define (name, prototype) {
      return new AxialInterface(name, prototype);
    },
    getInterface (name = 'null') {
      // return first one defined (allows easy mocking/testing)
      const ifaceArray = _interfaces[name];
      if (ifaceArray) {
        return ifaceArray[ifaceArray.length - 1];
      }
    },
    interfaceNames () {
      return Object.keys(_interfaces).filter(name => {
        const ifaceArray = _interfaces[name];
        return ifaceArray[0].isRootInterface;
      });
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
    get bindingInfo () {
      return this.bindings.map(binding => binding.instance._instanceId + ':' + binding.key);
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
      if (_logListenerCount) {
        // logging is a separate listener collection,
        // in case Axial.unbind() is called logging can continue.
        this.log(eventData);
      }
      const l = _listeners.length;
      for (let i = 0; i < l; i++) {
        let returnValue = _listeners[i](eventData);
        if (returnValue) {
          return returnValue;
        }
      }
    },
    Binding: AxialBinding,
    PROXY_KEY: PROXY_KEY,
    CONST: CONST,
    Instance: new AxialInstance(),
    InstanceArray: AxialInstanceArray,
    util: util,
    addLogListener (method, fn) {
      _logListeners[method] = _logListeners[method] || [];
      _logListeners[method].push(fn);
      _logListenerCount++;
      return this;
    },
    removeLogListener (method, fn) {
      if (typeof fn === 'undefined') {
        _logListeners[method] = [];
        return;
      }
      const index = _logListeners[method].indexOf(fn);
      _logListeners[method].splice(index, 1);
      _logListenerCount--;
      return this;
    },
    log (e) {
      if (_logListeners.hasOwnProperty(e.method)) {
        const array = _logListeners[e.method];
        const l = array.length;
        for (let i = 0; i < l; i++) {
          array[i](e);
        }
      }
    },
    addDefaultLogListeners () {
      this.addLogListener('get', e => {
        console.log('%cGET: ' + e.property.path + (e.hasOwnProperty('index') ? '[' + e.index +  ']' : '')  + ':<' + e.property.types.join('|') + '> = ' + util.stringify(e.value), 'color:#999');
      }).addLogListener('set', e => {
        console.log('%cSET: ' + e.property.path + ':<' + e.property.types.join('|') + '> = ' + util.stringify(e.value), 'color:orange');
      }).addLogListener('call', e => {
        const args = [];
        const l = e.arguments.length;
        for (let i = 0; i < l; i++) {
          let arg;
          try {
            arg = JSON.stringify(e.arguments[i]);
          } catch (e) {
            arg = util.typeOf(e.arguments[i]).name;
          }
          args.push(arg + ':' + typeof e.arguments[i]);
        }
        console.log('%cCALL: ' + e.property.path + `(${args.length ? '<' : ''}` + args.join('>, <') + `${args.length ? '>' : ''})`, 'color:pink');
      });
    },
    typeOf (value) {
      const type = util.typeOf(value);
      if (type.constructor === AxialObject) {
        const ifaceNames = this.interfaceNames();
        const l = ifaceNames.length;
        for (let i = 0; i < l; i++) {
          const name = ifaceNames[i];
          const iface = this.getInterface(name);
          // gets latest version with same name
          if (iface.is(value)) {
            return iface;
          }
        }
      }
      return type;
    },
    proxy: _proxy
  };

  // merge in types and errors
  util.merge(Axial, T);
  util.merge(Axial, Errors);

  // extend misc types public interface
  AxialInterface.prototype.new = AxialInterface.prototype.create;
  AxialType.prototype.set = AxialType.prototype.defaultValue;

  if (typeof window !== 'undefined') {
    window.Axial = Axial;
  }

  return Axial;
})();