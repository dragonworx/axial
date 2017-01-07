import Errors from './errors'
import util from './util'

/**
 * AxialType
 */
class AxialType {
  constructor (name, fn) {
    this._name = name;
    this._validator = fn;
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

  toString () {
    return this._name;
  }
}

/**
 * AxialObject
 */
class AxialObject extends AxialType {
  constructor (name, fn) {
    super(name, fn);
  }

  is (value) {
    return util.isObject(value);
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

module.exports = Types;