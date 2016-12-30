const util = require('./util');
const ERROR = util.ERROR;
const TYPE = util.TYPE;
const log = util.log;
const _schema = {};

// Errors...
ERROR.AxialSchemaExists = class AxialSchemaExists extends util.ExtendableBuiltin(Error) {};
ERROR.AxialUndefinedPath = class AxialUndefinedPath extends util.ExtendableBuiltin(Error) {};
ERROR.AxialInvalidType = class AxialInvalidType extends util.ExtendableBuiltin(Error) {};

// Schema Property...
class AxialSchemaProperty {
  constructor(path, type, isLocked = false) {
    this.path = path;
    this.type = type;
    this.isLocked = isLocked;
    this.values = [];
    this.validator = this.validate;
  }
  validate(value) {
    const type = util.typeOf(value);
    if (util.isArray(type) && this.type === TYPE.ARRAY()) {
      return;
    }
    if (type !== this.type) {
      throw new ERROR.AxialInvalidType(`Invalid type for path "${this.path}" - ${this.type} expected, ${util.typeOf(value)} given.?`);
    }
  }
  value(value) {
    if (arguments.length === 0) {
      return this.values[this.values.length - 1];
    }
    this.validator(value);
    this.values.push(value);
  }
  remove() {
    delete _schema[this.path];
    log(`%c#undefine(${this.toString()})`, 'color:brown');
  }
  toString() {
    return `"${this.path}":${this.type}${this.isLocked ? '<LOCKED>' : ''}`;
  }
}

// helpers...
function _getPathsFromArgs (args) {
  let paths = [];
  const pathOrObject = args[0];
  if (util.typeOf(pathOrObject) === TYPE.STRING) {
    paths.push({path: pathOrObject, value: args[1]});
  } else if (util.typeOf(pathOrObject) === TYPE.OBJECT) {
    paths = util.getObjectPathValues(pathOrObject);
  }
  return paths;
}

function _validatePathExists (path) {
  if (!_schema.hasOwnProperty(path)) {
    throw new ERROR.AxialUndefinedPath(`Path not found "${path}"?`);
  }
}

// Axial Singleton...
let Axial = {
  paths () {
    return Object.keys(_schema);
  },
  has (pathPattern) {
    return !!this.match(pathPattern, true).length;
  },
  match (pathPattern, firstOnly) {
    const matches = [];
    for (let key in _schema) {
      if (_schema.hasOwnProperty(key)) {
        let regex = new RegExp(typeof pathPattern === 'string' ? '^' + pathPattern : pathPattern);
        if (key.match(regex)) {
          matches.push(_schema[key]);
          if (firstOnly) {
            return matches;
          }
        }
      }
    }
    return matches;
  },
  define (pathOrObject, type) {
    _getPathsFromArgs(arguments).forEach(info => {
      if (this.has(info.path) && _schema.hasOwnProperty(info.path) && _schema[info.path].isLocked) {
        throw new ERROR.AxialSchemaExists(`Cannot define path "${info.path}", path already exists and is locked.`);
      }
      this.match(info.path).forEach(match => match.remove());
      _schema[info.path] = new AxialSchemaProperty(info.path, info.value);
      log(`%c#define(${_schema[info.path].toString()})`, 'color:blue');
    });
    return this;
  },
  lock () {
    _getPathsFromArgs(arguments).forEach(info => {
      const path = info.path;
      _validatePathExists(path);
      if (!_schema.hasOwnProperty(path)) {
        _schema[path] = new AxialSchemaProperty(path, TYPE.UNSET, true);
      } else {
        _schema[path].isLocked = true;
      }
    });
    return this;
  },
  typeOf (path) {
    _validatePathExists(path);
    return _schema[path].type;
  },
  set (pathOrObject, value) {
    _getPathsFromArgs(arguments).forEach(info => {
      const path = info.path;
      _validatePathExists(path);
      _schema[path].value(info.value);
    });
    return this;
  },
  add (path, value) {
    _validatePathExists(path);
    const prop = _schema[path];
    if (!util.isArray(prop.type)) {
      throw new AxialArrayExpected(`Expected an array for path "${path}", ${prop.type} found`);
    }
    if (util.isTypedArray(prop.type)) {

    }
    const array = prop.value();
    array.push(value);
    return this;
  },
  get (path) {
    _validatePathExists(path);
    return _schema[path].value();
  },
  dump: function (toJSON) {
    log(`----+< ${toJSON === true ? 'JSON' : 'Schema'} >+----`);
    if (toJSON === true) {
      log(`%c${JSON.stringify(this.toJSON(), null, 4)}`, 'color:darkBlue');
    } else {
      for (let path in _schema) {
        if (_schema.hasOwnProperty(path)) {
          log(`%c${_schema[path].toString()}=${JSON.stringify(this.get(path))}`, 'color:darkBlue');
        }
      }
    }
    return this;
  },
  toJSON: function () {
    const json = {};
    for (let path in _schema) {
      if (_schema.hasOwnProperty(path)) {
        util.setObjectAtPath(json, path, _schema[path].value());
      }
    }
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
Axial.util = util;

// export window...
if (typeof window !== 'undefined') {
  window.Axial = Axial;
}

// export module.exports...
if (typeof module === 'object') {
  module.exports = Axial;
}