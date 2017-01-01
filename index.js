const escapeStringRegexp = require('escape-string-regexp');
const util = require('./util');
const ERROR = util.ERROR;
const TYPE = util.TYPE;
const TYPES = util.TYPES;
const log = util.log;

let _schema = {};
let _paths = new Map();

// Errors...
ERROR.AxialPathExists = 'AxialPathExists';
ERROR.AxialSchemaLocked = 'AxialSchemaLocked';
ERROR.AxialUndefinedPath = 'AxialUndefinedPath';
ERROR.AxialInvalidType = 'AxialInvalidType';
ERROR.AxialUndefinedType = 'AxialUndefinedType';
ERROR.AxialArrayExpected = 'AxialArrayExpected';
ERROR.AxialTypeExists = 'AxialTypeExists';

// helpers...
function _getPathsFromArgs(args) {
  let paths = [];
  const pathOrObject = args[0];
  if (util.typeOf(pathOrObject) === TYPE.STRING) {
    paths.push({path: pathOrObject, value: args[1]});
  } else if (util.typeOf(pathOrObject) === TYPE.OBJECT) {
    paths = util.getObjectPathValues(pathOrObject, true);
  }
  return paths;
}

function _validatePathExists(path) {
  if (!_paths.has(path)) {
    throw new Error(util.err(ERROR.AxialUndefinedPath, `Path not found "${path}"`));
  }
}

// Schema Property...
class AxialSchemaProperty {
  constructor (path, type) {
    this._path = path;
    this._type = Array.isArray(type) ? type : [type];
    this._values = [];
    this._validator = this.validate;
    this._isLocked = false;
    this._type.forEach(type => {
      if (!util.isType(type)) {
        throw new Error(util.err(ERROR.AxialUndefinedType, `Undefined type "${type}"`));
      }
    });
  }

  types (fn) {
    const types = this._type;
    for (let i = 0, l = this._type.length; i < l; i++) {
      fn(types[i]);
    }
  }

  validate (value) {
    const valueType = util.typeOf(value);
    for (let i = 0; i < this._type.length; i++) {
      // for each type to validate...
      const thisType = this._type[i];
      const arrayType = util.getArrayType(thisType);
      if ((thisType === TYPE.ANY) || (util.isArray(valueType) && thisType === TYPE.ARRAY())) {
        // allow any type or array of any type
        return;
      } else if (util.isArray(thisType) && Array.isArray(value)) {
        const isCustomType = util.isCustomType(arrayType);
        for (let j = 0; j < value.length; j++) {
          const val = value[j];
          if (isCustomType) {
            util.getCustomType(arrayType).validate(val, this);
          } else if (util.typeOf(val) !== arrayType) {
            throw new Error(util.err(ERROR.AxialInvalidType, `Invalid type for ${thisType}[${j}] at path "${this._path}" - ${arrayType} expected, ${util.typeOf(value[j])} given.`));
          }
        }
        return;
      } else if (util.isCustomType(thisType)) {
        const type = util.getCustomType(thisType);
        type.validate(value, this);
      } else if (valueType === thisType) {
        return;
      }
    }
    throw new Error(util.err(ERROR.AxialInvalidType, `Invalid type for path "${this._path}" - ${Array.isArray(this._type) ? this._type.join('|') : this._type} expected, ${util.typeOf(value)} given.`));
  }

  value (value) {
    if (arguments.length === 0) {
      return this._values.length ? this._values[this._values.length - 1] : null;
    }
    this._validator.call(this, value);
    this._values.push(value);
  }

  metaValue () {
    return this._type;
  }

  remove () {
    _paths.delete(this._path);
    util.deleteAtPath(_schema, this._path);
  }

  subPaths () {
    const paths = [];
    for (let i = 0; i < this._type.length; i++) {
      // for each type to validate...
      const thisType = this._type[i];

      const isArray = util.isArray(thisType);
      const arrayType = util.getArrayType(thisType);
      let T = TYPES[util.getCustomTypeKey(isArray ? arrayType : thisType)];

      paths.push.apply(paths, T.subPaths());
    }
    return paths;
  }

  toString () {
    return `"${this._path}":[${this._type.join('|')}]`;
  }
}

// AxialSchemaBranch...
class AxialSchemaBranch extends AxialSchemaProperty {
  constructor (path) {
    super(path, TYPE.BRANCH);
  }

  value () {
    if (!this._value) {
      this._value = {};
    }
    return this._value;
  }

  metaValue () {
    if (!this._metavalue) {
      this._metavalue = {};
    }
    return this._metavalue;
  }
}

// AxialType...
class AxialType {
  constructor (typeValue, typeOrObject) {
    this._typeValue = typeValue;
    if (typeof typeOrObject === 'string') {
      this._typeDefition = typeOrObject;
    } else if (typeof typeOrObject) {
      this._definition = typeOrObject;
      this._paths = util.getObjectPaths(typeOrObject);
    }
  }

  subPaths () {
    if (this._typeDefition) {
      return [];
    } if (this._definition) {
      return util.getObjectPathValues(this._definition);
    }
  }

  validate (value, prop) {
    if (this._typeDefition) {
      if (util.typeOf(value) === this._typeValue) {
        throw new Error(util.err(ERROR.AxialInvalidType, `Invalid type for path "${prop._path}" - ${this._typeValue} expected, ${util.typeOf(value)} given.`));
      }
    } else if (this._definition) {
      const paths = this._paths;
      for (let i = 0, l = paths.length; i < l; i++) {
        let path = paths[i];
        let absPath = prop._path + '.' + path;
        try {
          const val = util.getObjectAtPath(value, path, true);
          _paths.get(absPath).validate(val, prop);
        } catch (e) {

        }
      }
    }
  }

  toString () {
    let typeInfo = this._typeDefition ? this._typeDefition : JSON.stringify(this._definition, null, 4);
    return `[${util.getCustomTypeKey(this._typeValue)}]: ${typeInfo}`;
  }
}

// Axial Singleton...
let Axial = {
  paths () {
    const a = [];
    for (let path of _paths.keys()) {
      a[a.length] = path;
    }
    a.sort();
    return a;
  },

  has (pathPattern) {
    return !!this.match(pathPattern, true).length;
  },

  match (pathPattern, oneOnly) {
    const matches = [];
    const regex = new RegExp(typeof pathPattern === 'string' ? '^' + escapeStringRegexp(pathPattern) : pathPattern);
    const paths = this.paths();
    const l = paths.length;
    for (let i = 0; i < l; i++) {
      let path = paths[i];
      if (path.match(regex)) {
        matches.push(_paths.get(path));
        if (oneOnly) {
          return matches;
        }
      }
    }
    return matches;
  },

  lock (pathOrObject) {
    let paths = [];
    if (arguments.length) {
      _getPathsFromArgs(arguments).forEach(info => {
        _validatePathExists(info.path);
        paths.push(info.path);
      });
      paths.sort();
    } else {
      paths = this.paths();
    }
    paths.forEach(path => {
      _paths.get(path)._isLocked = true;
    });
  },

  define (pathOrObject, type) {
    _getPathsFromArgs(arguments).forEach(info => {
      const path = info.path;
      const type = info.value;
      if (this.has(path)) {
        // path exists
        throw new Error(err(ERROR.AxialPathExists, `Cannot define new path "${path}", path already exists`));
      }
      if (Array.isArray(type)) {
        // handle mult-types (via array definition)
        for (let i = 0; i < type.length; i++) {
          const t = type[i];
          if (!util.isType(t)) {
            throw new Error(util.err(ERROR.AxialUndefinedType, `Undefined type "${t}"`));
          }
        }
      }
      let node;
      if (util.isObject(type) || _paths.get(path) instanceof AxialSchemaBranch) {
        node = new AxialSchemaBranch(path);
      } else if (util.isType(type)) {
        // Custom type...
        node = new AxialSchemaProperty(path, type);
        if (util.isCustomType(type)) {
          node.subPaths().forEach(subPath => {
            if (!subPath.isBranch) {
              // extend sub path for custom type (leaf nodes only)
              this.define(path + '.' + subPath.path, subPath.value);
            }
          });
        }
      } else if (!Array.isArray(type)) {
        debugger;
        throw new Error(util.err(ERROR.AxialUndefinedType, `Undefined type "${type}"`));
      }
      _paths.set(path, node);
      const branches = util.setObjectAtPath(_schema, path, node, p => new AxialSchemaBranch(p));
      for (let [pth, branch] of branches.entries()) {
        _paths.set(pth, branch);
      }
      log(`%c#define(${_paths.get(path).toString()})`, 'color:blue');
    });
    return this;
  },

  undefine (pathOrObject) {
    _getPathsFromArgs(arguments).forEach(info => {
      const path = info.path;
      _validatePathExists(path);
      const matches = this.match(path);
      matches.reverse();
      matches.forEach(node => {
        if (node._isLocked) {
          throw new Error(util.err(ERROR.AxialSchemaLocked, `Cannot undefine path "${node._path}", path is locked`));
        }
        log(`%c#undefine(${_paths.get(path).toString()})`, 'color:brown');
        node.remove();
      });
    });
    return this;
  },

  defineType (typeName, typeOrObject) {
    const typeKey = typeName.replace(/^<+|>+$/g, '').toUpperCase();
    const typeValue = `<${typeName.toLowerCase()}>`;
    if (TYPE.hasOwnProperty(typeKey) || Axial.hasOwnProperty(typeKey)) {
      throw new Error(util.err(ERROR.AxialTypeExists, `Cannot define type, already exists "${typeKey}"`));
    }
    TYPE[typeKey] = typeValue;
    this[typeKey] = typeValue;

    const type = new AxialType(typeValue, typeOrObject);
    TYPES[typeKey] = type;

    return type;
  },

  set (pathOrObject, value) {
    _getPathsFromArgs(arguments).forEach(info => {
      const path = info.path;
      const val = info.value;
      _validatePathExists(path);
      const prop = _paths.get(path);
      const isCustomType = util.isCustomType(prop._type);
      if (!isCustomType) {
        prop.value(val);
      } else {
        if (Array.isArray(val)) {
          prop.value(val);
        } else {
          if (util.isObject(val)) {
            const paths = util.getObjectPathValues(val);
            for (let i = 0, l = paths.length; i < l; i++) {
              const pv = paths[i];
              this.set(path + '.' + pv.path, pv.value);
            }
          } else {
            prop.value(val);
          }
        }
      }
    });
    return this;
  },

  add (path, value) {
    _validatePathExists(path);
    const prop = _schema[path];
    if (!util.isArray(prop.type)) {
      throw new Error(util.err(ERROR.AxialArrayExpected, `Expected an array for path "${path}", ${prop.type} found`));
    }
    if (util.isTypedArray(prop.type)) {

    }
    const array = prop.value();
    array.push(value);
    return this;
  },

  get (path) {
    _validatePathExists(path);
    return _paths.get(path).value();
  },

  getNullPaths () {
    const nullPaths = [];
    for (let [path, node] of _paths) {
      if (node.value() === null) {
        nullPaths.push(path);
      }
    }
    return nullPaths;
  },

  dump: function () {
    log(`----+< State >+----`);
    const json = {};
    this.paths().forEach(path => {
      const node = _paths.get(path);
      if (!(node instanceof AxialSchemaBranch)) {
        util.setObjectAtPath(json, `${path}:${node._type}`, node.value());
      }
    });
    log(`%c${JSON.stringify(json, null, 4)}`, 'color:darkBlue');
    log(`----+< Types >+----`);
    for (let typeKey in TYPES) {
      if (TYPES.hasOwnProperty(typeKey)) {
        log(`%c${TYPES[typeKey].toString()}`, 'color:darkBlue');
      }
    }
    return this;
  },

  toJSON: function () {
    const json = {};
    this.paths().forEach(path => {
      util.setObjectAtPath(json, path, _paths.get(path).value());
    });
    return json;
  }
};

// copy util types directly into Axial
util.merge(Axial, TYPE);
Axial.ERROR = {};
util.merge(Axial.ERROR, ERROR);
Axial.schema = _schema;
Axial.log = util.log;
Axial.error = util.error;
Axial.type = TYPE;
Axial.types = TYPES;
Axial.util = util;
Axial.prop = function (path) {
  return _paths.get(path);
};
Axial.isValidType = util.isType;

// export window...
if (typeof window !== 'undefined') {
  window.Axial = Axial;
}

// export module.exports...
if (typeof module === 'object') {
  module.exports = Axial;
}