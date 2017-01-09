import Errors from './errors'
import util from './util'

/**
 * AxialType
 */
class AxialType {
  constructor (name, fn) {
    this._name = name;
    this._validator = fn;
    this._isRequired = true;
    this._defaultValue = null;
  }

  validate (value) {
    if (!this._validator(value)) {
      throw new Error(Errors.AxialInvalidType(this._name, typeof value));
    }
  }

  is (value) {
    try {
      this.validate(value);
      return true;
    } catch (e) {
      return false;
    }
  }

  required (bool) {
    this._isRequired = bool;
    return this;
  }

  defaultValue (value) {
    this._defaultValue = value;
    return this;
  }

  toString () {
    return this._name;
  }
}

/**
 * AxialObject
 */
class AxialObject extends AxialType {
  is (value) {
    return util.isObject(value);
  }
}

/**
 * AxialCustomType
 */
class AxialCustomType extends AxialType {
  constructor (name, schema) {
    super(name);
    delete this._validator;
    this._schema = schema;
  }

  validate (value) {
    this._schema.validate(value);
  }
}

/**
 * Types
 */
let Types = {
  String: new AxialType('string', value => typeof value === 'string'),
  Number: new AxialType('number', value => typeof value === 'number'),
  Boolean: new AxialType('boolean', value => typeof value === 'boolean'),
  Function: new AxialType('function', value => typeof value === 'function'),
  Object: new AxialObject('object', value => util.isObject(value)),
  Custom: {}
};

/**
 * typeOf
 * @param value
 * @returns {AxialType}
 */
Types.typeOf = function (value) {
  return (Types.String.is(value) && Types.String)
    || (Types.Number.is(value) && Types.Number)
    || (Types.Boolean.is(value) && Types.Boolean)
    || (Types.Function.is(value) && Types.Function)
    || (Types.Object.is(value) && Types.Object);
};

Types.Custom._define = function (name, schema) {
  const type = new AxialCustomType(name, schema);
  Types.Custom[name] = type;
  return type;
};

export default Types;