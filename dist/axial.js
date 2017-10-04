/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	module.exports = function Define_Axial() {
	  var _Axial;
	
	  var CONST = __webpack_require__(2);
	  var BLANK_INTERFACE_NAME = CONST.BLANK_INTERFACE_NAME;
	  var _arrayTypes = {};
	  var _listeners = [];
	  var _interfaces = {};
	  var _instances = {};
	  var _instancesCreated = [];
	  var _bindings = [];
	  var _arrayMembers = CONST.ARRAY_MEMBERS;
	  var _arrayMutators = CONST.ARRAY_MUTATORS;
	  var _validKeys = CONST.VALID_KEYS;
	  var _logListeners = {};
	
	  var _logListenerCount = 0;
	  var util = void 0,
	      T = void 0;
	  var _interfaceId = 0,
	      _instanceArrayId = 0,
	      _instanceIds = {};
	
	  function _isValidKey(key) {
	    return _validKeys.indexOf(key) > -1;
	  }
	
	  function getInstanceId(iface) {
	    if (!iface) {
	      return '0';
	    }
	    var ifaceId = iface.id;
	    if (!_instanceIds[ifaceId]) {
	      _instanceIds[ifaceId] = 0;
	    }
	    _instanceIds[ifaceId]++;
	    return iface.id + '#' + _instanceIds[ifaceId];
	  }
	
	  // -------------------------------------------------------------------------------------- Errors
	  var Exception = function ExtendableBuiltin(cls) {
	    function ExtendableBuiltin() {
	      cls.apply(this, arguments);
	    }
	    ExtendableBuiltin.prototype = Object.create(cls.prototype);
	    Object.setPrototypeOf(ExtendableBuiltin, cls);
	    return ExtendableBuiltin;
	  }(Error);
	
	  var AxialUnsupportedType = function (_Exception) {
	    _inherits(AxialUnsupportedType, _Exception);
	
	    function AxialUnsupportedType(value, iface, key) {
	      _classCallCheck(this, AxialUnsupportedType);
	
	      var type = void 0;
	      if (value instanceof AxialInstance) {
	        type = value.iface.id + '(AxialInstance)';
	      } else {
	        try {
	          type = util.typeOf(value).id;
	        } catch (e) {
	          type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	        }
	      }
	      var message = 'Unsupported Axial type "' + type + '"' + (iface ? ' used to define property "' + key + '" of interface "' + iface.id + '"' : '') + '. Only instances of AxialType can be provided.';
	
	      var _this = _possibleConstructorReturn(this, (AxialUnsupportedType.__proto__ || Object.getPrototypeOf(AxialUnsupportedType)).call(this, message));
	
	      _this.value = value;
	      _this.message = message;
	      return _this;
	    }
	
	    return AxialUnsupportedType;
	  }(Exception);
	
	  var AxialInvalidType = function (_Exception2) {
	    _inherits(AxialInvalidType, _Exception2);
	
	    function AxialInvalidType(given, expected, instance, property) {
	      _classCallCheck(this, AxialInvalidType);
	
	      var instString = instance ? instance.toString() : '?';
	      var message = 'Invalid type for property "' + property.path + ('" ~ "' + given + '" given, "' + expected + '" expected.');
	
	      var _this2 = _possibleConstructorReturn(this, (AxialInvalidType.__proto__ || Object.getPrototypeOf(AxialInvalidType)).call(this, message));
	
	      _this2.given = given;
	      _this2.expected = expected;
	      _this2.instance = instance;
	      _this2.property = property;
	      _this2.message = message;
	      return _this2;
	    }
	
	    return AxialInvalidType;
	  }(Exception);
	
	  var AxialInvalidNumericRange = function (_Exception3) {
	    _inherits(AxialInvalidNumericRange, _Exception3);
	
	    function AxialInvalidNumericRange(given, min, max) {
	      _classCallCheck(this, AxialInvalidNumericRange);
	
	      var message = 'Invalid numeric range - expected [' + min + ' .. ' + max + '], given ' + given + '.';
	
	      var _this3 = _possibleConstructorReturn(this, (AxialInvalidNumericRange.__proto__ || Object.getPrototypeOf(AxialInvalidNumericRange)).call(this, message));
	
	      _this3.given = given;
	      _this3.min = min;
	      _this3.max = max;
	      _this3.message = message;
	      return _this3;
	    }
	
	    return AxialInvalidNumericRange;
	  }(Exception);
	
	  var AxialInvalidStringPattern = function (_Exception4) {
	    _inherits(AxialInvalidStringPattern, _Exception4);
	
	    function AxialInvalidStringPattern(given, pattern) {
	      _classCallCheck(this, AxialInvalidStringPattern);
	
	      var message = 'Invalid string pattern - expected "' + pattern + '", given "' + given + '".';
	
	      var _this4 = _possibleConstructorReturn(this, (AxialInvalidStringPattern.__proto__ || Object.getPrototypeOf(AxialInvalidStringPattern)).call(this, message));
	
	      _this4.given = given;
	      _this4.pattern = pattern;
	      _this4.message = message;
	      return _this4;
	    }
	
	    return AxialInvalidStringPattern;
	  }(Exception);
	
	  var AxialUndefinedValue = function (_Exception5) {
	    _inherits(AxialUndefinedValue, _Exception5);
	
	    function AxialUndefinedValue(source, path) {
	      _classCallCheck(this, AxialUndefinedValue);
	
	      var message = 'Undefined value for object path "' + path + '".';
	
	      var _this5 = _possibleConstructorReturn(this, (AxialUndefinedValue.__proto__ || Object.getPrototypeOf(AxialUndefinedValue)).call(this, message));
	
	      _this5.source = source;
	      _this5.path = path;
	      _this5.message = message;
	      return _this5;
	    }
	
	    return AxialUndefinedValue;
	  }(Exception);
	
	  var AxialTypeAlreadyDefined = function (_Exception6) {
	    _inherits(AxialTypeAlreadyDefined, _Exception6);
	
	    function AxialTypeAlreadyDefined(typeName, key, iface) {
	      _classCallCheck(this, AxialTypeAlreadyDefined);
	
	      var message = 'Type "' + typeName + '" is already defined for property "' + key + '" in schema "' + iface.id + '".';
	
	      var _this6 = _possibleConstructorReturn(this, (AxialTypeAlreadyDefined.__proto__ || Object.getPrototypeOf(AxialTypeAlreadyDefined)).call(this, message));
	
	      _this6.typeName = typeName;
	      _this6.key = key;
	      _this6.iface = iface;
	      _this6.message = message;
	      return _this6;
	    }
	
	    return AxialTypeAlreadyDefined;
	  }(Exception);
	
	  var AxialInvalidArgument = function (_Exception7) {
	    _inherits(AxialInvalidArgument, _Exception7);
	
	    function AxialInvalidArgument(index, expected, given) {
	      _classCallCheck(this, AxialInvalidArgument);
	
	      var message = 'Invalid argument #' + index + ' - Expected "' + expected + '", given "' + given + '".';
	
	      var _this7 = _possibleConstructorReturn(this, (AxialInvalidArgument.__proto__ || Object.getPrototypeOf(AxialInvalidArgument)).call(this, message));
	
	      _this7.index = index;
	      _this7.expected = expected;
	      _this7.given = given;
	      return _this7;
	    }
	
	    return AxialInvalidArgument;
	  }(Exception);
	
	  var AxialMissingProperty = function (_Exception8) {
	    _inherits(AxialMissingProperty, _Exception8);
	
	    function AxialMissingProperty(key, iface, object) {
	      _classCallCheck(this, AxialMissingProperty);
	
	      var message = 'Missing interface property "' + key + '" from given object.';
	
	      var _this8 = _possibleConstructorReturn(this, (AxialMissingProperty.__proto__ || Object.getPrototypeOf(AxialMissingProperty)).call(this, message));
	
	      _this8.key = key;
	      _this8.object = object;
	      _this8.iface = iface;
	      _this8.message = message;
	      return _this8;
	    }
	
	    return AxialMissingProperty;
	  }(Exception);
	
	  var AxialUnexpectedProperty = function (_Exception9) {
	    _inherits(AxialUnexpectedProperty, _Exception9);
	
	    function AxialUnexpectedProperty(key, iface, instance) {
	      _classCallCheck(this, AxialUnexpectedProperty);
	
	      var message = 'Unexpected key "' + key + '" found in given object not declared in interface "' + iface.id + '".';
	
	      var _this9 = _possibleConstructorReturn(this, (AxialUnexpectedProperty.__proto__ || Object.getPrototypeOf(AxialUnexpectedProperty)).call(this, message));
	
	      _this9.key = key;
	      _this9.iface = iface;
	      _this9.instance = instance;
	      _this9.message = message;
	      return _this9;
	    }
	
	    return AxialUnexpectedProperty;
	  }(Exception);
	
	  var AxialDockRejection = function (_Exception10) {
	    _inherits(AxialDockRejection, _Exception10);
	
	    function AxialDockRejection(message) {
	      _classCallCheck(this, AxialDockRejection);
	
	      message = 'Dock Rejected: ' + message;
	
	      var _this10 = _possibleConstructorReturn(this, (AxialDockRejection.__proto__ || Object.getPrototypeOf(AxialDockRejection)).call(this, message));
	
	      _this10.message = message;
	      return _this10;
	    }
	
	    return AxialDockRejection;
	  }(Exception);
	
	  var Errors = {
	    UnsupportedType: AxialUnsupportedType,
	    InvalidType: AxialInvalidType,
	    InvalidNumericRange: AxialInvalidNumericRange,
	    InvalidStringPattern: AxialInvalidStringPattern,
	    UndefinedValue: AxialUndefinedValue,
	    TypeAlreadyDefined: AxialTypeAlreadyDefined,
	    InvalidArgument: AxialInvalidArgument,
	    MissingProperty: AxialMissingProperty,
	    IllegalProperty: AxialUnexpectedProperty,
	    DockRejection: AxialDockRejection
	  };
	
	  // -------------------------------------------------------------------------------------- Types
	
	  var AxialType = function () {
	    function AxialType() {
	      _classCallCheck(this, AxialType);
	
	      this._defaultValue = undefined;
	      this._required = false;
	      this._baseType = this;
	      this._validate = null;
	      this._exports = true;
	    }
	
	    _createClass(AxialType, [{
	      key: 'validate',
	      value: function validate(value, instance, property) {
	        if (typeof this._validate === 'function') {
	          return this._validate.call(instance, value);
	        }
	        if (!this.is(value)) {
	          //given, expected, key, instance
	          throw new AxialInvalidType(this.id, util.typeOf(value).id, instance, property);
	        }
	      }
	    }, {
	      key: 'is',
	      value: function is(value) {
	        return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === this.id;
	      }
	    }, {
	      key: 'toString',
	      value: function toString() {
	        return this.id;
	      }
	    }, {
	      key: 'clone',
	      value: function clone() {
	        var copy = new this.constructor();
	        for (var key in this) {
	          if (this.hasOwnProperty(key)) {
	            copy[key] = this[key];
	          }
	        }
	        copy._baseType = this.baseType;
	        return copy;
	      }
	    }, {
	      key: 'extend',
	      value: function extend(options) {
	        var copy = this.clone();
	        if (util.isPlainObject(options)) {
	          for (var key in options) {
	            if (options.hasOwnProperty(key)) {
	              if (key === 'value') {
	                copy['_defaultValue'] = options[key];
	              } else {
	                copy['_' + key] = options[key];
	              }
	            }
	          }
	        } else if (typeof options !== 'undefined') {
	          copy._defaultValue = options;
	        }
	        return copy;
	      }
	    }, {
	      key: 'defaultValue',
	      value: function defaultValue(value) {
	        var copy = this.clone();
	        copy._defaultValue = value;
	        return copy;
	      }
	    }, {
	      key: 'value',
	      value: function value(_value) {
	        return this.defaultValue(_value);
	      }
	    }, {
	      key: 'required',
	      value: function required() {
	        var copy = this.clone();
	        copy._required = true;
	        return copy;
	      }
	    }, {
	      key: 'exports',
	      value: function exports(bool) {
	        var copy = this.clone();
	        copy._exports = bool;
	        return copy;
	      }
	    }, {
	      key: 'id',
	      get: function get() {
	        return this._id || this.constructor.id;
	      }
	    }, {
	      key: 'baseType',
	      get: function get() {
	        return this._baseType ? this._baseType : this;
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return '?';
	      }
	    }]);
	
	    return AxialType;
	  }();
	
	  var AxialTypePrototype = AxialType.prototype;
	
	  var AxialNull = function (_AxialType) {
	    _inherits(AxialNull, _AxialType);
	
	    function AxialNull() {
	      _classCallCheck(this, AxialNull);
	
	      var _this11 = _possibleConstructorReturn(this, (AxialNull.__proto__ || Object.getPrototypeOf(AxialNull)).call(this));
	
	      _this11._defaultValue = null;
	      return _this11;
	    }
	
	    _createClass(AxialNull, [{
	      key: 'is',
	      value: function is(value) {
	        return value === null;
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'null';
	      }
	    }]);
	
	    return AxialNull;
	  }(AxialType);
	
	  var AxialUndefined = function (_AxialType2) {
	    _inherits(AxialUndefined, _AxialType2);
	
	    function AxialUndefined() {
	      _classCallCheck(this, AxialUndefined);
	
	      var _this12 = _possibleConstructorReturn(this, (AxialUndefined.__proto__ || Object.getPrototypeOf(AxialUndefined)).call(this));
	
	      _this12._defaultValue = undefined;
	      return _this12;
	    }
	
	    _createClass(AxialUndefined, [{
	      key: 'is',
	      value: function is(value) {
	        return typeof value === 'undefined';
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'undefined';
	      }
	    }]);
	
	    return AxialUndefined;
	  }(AxialType);
	
	  var AxialString = function (_AxialType3) {
	    _inherits(AxialString, _AxialType3);
	
	    function AxialString() {
	      _classCallCheck(this, AxialString);
	
	      var _this13 = _possibleConstructorReturn(this, (AxialString.__proto__ || Object.getPrototypeOf(AxialString)).call(this));
	
	      _this13._pattern = null;
	      _this13._defaultValue = '';
	      return _this13;
	    }
	
	    _createClass(AxialString, [{
	      key: 'validate',
	      value: function validate(value, instance, property) {
	        if (typeof this._validate === 'function') {
	          return this._validate.call(instance, value);
	        }
	        if (!this.is(value)) {
	          if (typeof value !== 'string') {
	            throw new AxialInvalidType(util.typeOf(value).id, 'string', instance, property);
	          }
	          throw new AxialInvalidStringPattern(value, this._pattern);
	        }
	      }
	    }, {
	      key: 'is',
	      value: function is(value) {
	        return AxialTypePrototype.is.call(this, value) && (this._pattern ? !!value.match(this._pattern) : true);
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'string';
	      }
	    }]);
	
	    return AxialString;
	  }(AxialType);
	
	  var AxialNumber = function (_AxialType4) {
	    _inherits(AxialNumber, _AxialType4);
	
	    function AxialNumber() {
	      _classCallCheck(this, AxialNumber);
	
	      var _this14 = _possibleConstructorReturn(this, (AxialNumber.__proto__ || Object.getPrototypeOf(AxialNumber)).call(this));
	
	      _this14._min = Number.MIN_SAFE_INTEGER;
	      _this14._max = Number.MAX_SAFE_INTEGER;
	      _this14._defaultValue = 0;
	      return _this14;
	    }
	
	    _createClass(AxialNumber, [{
	      key: 'validate',
	      value: function validate(value, instance, property) {
	        if (typeof this._validate === 'function') {
	          return this._validate.call(instance, value);
	        }
	        if (!this.is(value)) {
	          if (typeof value !== 'number') {
	            throw new AxialInvalidType('number', util.typeOf(value).id, instance, property);
	          }
	          throw new AxialInvalidNumericRange(value, this._min, this._max);
	        }
	      }
	    }, {
	      key: 'is',
	      value: function is(value) {
	        if (this._clip === true) {
	          value = this.clip(value);
	        }
	        return AxialTypePrototype.is.call(this, value) && value >= this._min && value <= this._max;
	      }
	    }, {
	      key: 'clip',
	      value: function clip(value) {
	        value = Math.max(value, this._min);
	        value = Math.min(value, this._max);
	        return value;
	      }
	    }, {
	      key: 'between',
	      value: function between(min, max, clip) {
	        var opts = {
	          clip: !!clip
	        };
	        if (typeof min === 'number') {
	          opts.min = min;
	        }
	        if (typeof max === 'number') {
	          opts.max = max;
	        }
	        return this.extend(opts);
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'number';
	      }
	    }]);
	
	    return AxialNumber;
	  }(AxialType);
	
	  var AxialBoolean = function (_AxialType5) {
	    _inherits(AxialBoolean, _AxialType5);
	
	    function AxialBoolean() {
	      _classCallCheck(this, AxialBoolean);
	
	      var _this15 = _possibleConstructorReturn(this, (AxialBoolean.__proto__ || Object.getPrototypeOf(AxialBoolean)).call(this));
	
	      _this15._defaultValue = false;
	      return _this15;
	    }
	
	    _createClass(AxialBoolean, null, [{
	      key: 'id',
	      get: function get() {
	        return 'boolean';
	      }
	    }]);
	
	    return AxialBoolean;
	  }(AxialType);
	
	  var AxialDate = function (_AxialType6) {
	    _inherits(AxialDate, _AxialType6);
	
	    function AxialDate() {
	      _classCallCheck(this, AxialDate);
	
	      var _this16 = _possibleConstructorReturn(this, (AxialDate.__proto__ || Object.getPrototypeOf(AxialDate)).call(this));
	
	      _this16._defaultValue = new Date();
	      return _this16;
	    }
	
	    _createClass(AxialDate, [{
	      key: 'is',
	      value: function is(value) {
	        return value instanceof Date;
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'date';
	      }
	    }]);
	
	    return AxialDate;
	  }(AxialType);
	
	  var AxialRegex = function (_AxialType7) {
	    _inherits(AxialRegex, _AxialType7);
	
	    function AxialRegex() {
	      _classCallCheck(this, AxialRegex);
	
	      var _this17 = _possibleConstructorReturn(this, (AxialRegex.__proto__ || Object.getPrototypeOf(AxialRegex)).call(this));
	
	      _this17._defaultValue = new RegExp('.*', 'i');
	      return _this17;
	    }
	
	    _createClass(AxialRegex, [{
	      key: 'is',
	      value: function is(value) {
	        return value instanceof RegExp;
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'regex';
	      }
	    }]);
	
	    return AxialRegex;
	  }(AxialType);
	
	  var AxialFunction = function (_AxialType8) {
	    _inherits(AxialFunction, _AxialType8);
	
	    function AxialFunction() {
	      _classCallCheck(this, AxialFunction);
	
	      var _this18 = _possibleConstructorReturn(this, (AxialFunction.__proto__ || Object.getPrototypeOf(AxialFunction)).call(this));
	
	      _this18._defaultValue = new Function();
	      return _this18;
	    }
	
	    _createClass(AxialFunction, [{
	      key: 'is',
	      value: function is(value) {
	        return typeof value === 'function';
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'function';
	      }
	    }]);
	
	    return AxialFunction;
	  }(AxialType);
	
	  var AxialArray = function (_AxialType9) {
	    _inherits(AxialArray, _AxialType9);
	
	    function AxialArray(type) {
	      _classCallCheck(this, AxialArray);
	
	      var _this19 = _possibleConstructorReturn(this, (AxialArray.__proto__ || Object.getPrototypeOf(AxialArray)).call(this));
	
	      _this19._type = type;
	      _this19._defaultValue = [];
	      return _this19;
	    }
	
	    _createClass(AxialArray, [{
	      key: 'is',
	      value: function is(value) {
	        var isArray = Array.isArray(value);
	        if (isArray) {
	          if (this._type instanceof AxialType) {
	            var l = value.length;
	            for (var i = 0; i < l; i++) {
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
	    }, {
	      key: 'isItem',
	      value: function isItem(item) {
	        if (this._type) {
	          return util.typeOf(item).id === this._type.id;
	        }
	        return true;
	      }
	    }, {
	      key: 'validate',
	      value: function validate(value, instance, property) {
	        if (!Array.isArray(value)) {
	          throw new AxialInvalidType(this.id, util.typeOf(value).id, instance, property);
	        }
	        if (this._type) {
	          var l = value.length;
	          var t = this._type;
	          for (var i = 0; i < l; i++) {
	            t.validate(value[i], instance, property);
	          }
	        }
	      }
	    }, {
	      key: 'type',
	      get: function get() {
	        return this._type;
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'array';
	      }
	    }]);
	
	    return AxialArray;
	  }(AxialType);
	
	  var AxialObject = function (_AxialType10) {
	    _inherits(AxialObject, _AxialType10);
	
	    function AxialObject() {
	      _classCallCheck(this, AxialObject);
	
	      var _this20 = _possibleConstructorReturn(this, (AxialObject.__proto__ || Object.getPrototypeOf(AxialObject)).call(this));
	
	      _this20._defaultValue = {};
	      return _this20;
	    }
	
	    _createClass(AxialObject, [{
	      key: 'is',
	      value: function is(value) {
	        return util.isPlainObject(value) || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null && !Array.isArray(value);
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'object';
	      }
	    }]);
	
	    return AxialObject;
	  }(AxialType);
	
	  var AxialReference = function (_AxialType11) {
	    _inherits(AxialReference, _AxialType11);
	
	    function AxialReference() {
	      _classCallCheck(this, AxialReference);
	
	      var _this21 = _possibleConstructorReturn(this, (AxialReference.__proto__ || Object.getPrototypeOf(AxialReference)).call(this));
	
	      _this21._defaultValue = null;
	      return _this21;
	    }
	
	    _createClass(AxialReference, [{
	      key: 'is',
	      value: function is(value) {
	        return value instanceof AxialInstance;
	      }
	    }, {
	      key: 'validate',
	      value: function validate(value, instance, property) {
	        if (value === null) {
	          return true;
	        }
	
	        if (!(value instanceof AxialInstance)) {
	          throw new AxialInvalidType(util.typeOf(value).id, 'AxialInstance', instance, property);
	        }
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'reference';
	      }
	    }]);
	
	    return AxialReference;
	  }(AxialType);
	
	  var AxialInterface = function (_AxialObject) {
	    _inherits(AxialInterface, _AxialObject);
	
	    function AxialInterface() {
	      var interfaceId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : BLANK_INTERFACE_NAME;
	      var prototype = arguments[1];
	      var parentInterface = arguments[2];
	
	      _classCallCheck(this, AxialInterface);
	
	      var _this22 = _possibleConstructorReturn(this, (AxialInterface.__proto__ || Object.getPrototypeOf(AxialInterface)).call(this));
	
	      if (util.isPlainObject(interfaceId) && typeof prototype === 'undefined') {
	        // handle case where just single object prototype argument given
	        prototype = interfaceId;
	        interfaceId = BLANK_INTERFACE_NAME;
	      }
	
	      if (interfaceId === BLANK_INTERFACE_NAME) {
	        interfaceId += ++_interfaceId;
	      }
	
	      _this22._id = interfaceId;
	      _this22._properties = new Map();
	      _this22._allProps = new Map();
	      _this22._parentInterface = parentInterface;
	      _this22._methods = new Map();
	
	      _this22.define(prototype);
	
	      if (interfaceId) {
	        Axial.Interface[_this22._id] = _this22;
	      }
	
	      var _id = _this22._id;
	      _interfaces[_id] = _interfaces[_id] ? _interfaces[_id] : [];
	      _interfaces[_id].push(_this22);
	      return _this22;
	    }
	
	    _createClass(AxialInterface, [{
	      key: 'define',
	      value: function define(prototype) {
	        util.expandDotSyntaxKeys(prototype, function (path, key, object) {
	          util.setObjectAtPath(prototype, path, object);
	        });
	
	        for (var key in prototype) {
	          if (prototype.hasOwnProperty(key)) {
	            var definedTypes = {};
	            var typeDef = prototype[key];
	            var Type = Axial.typeOf(typeDef);
	
	            if (!(typeDef instanceof AxialType) && !Array.isArray(typeDef)) {
	              if (Type instanceof AxialObject === false) {
	                // extend type if given type
	                typeDef = Type.extend(typeDef);
	              }
	            }
	
	            var path = this._id ? this._id + '.' + key : BLANK_INTERFACE_NAME + '.' + key;
	
	            var typeArray = Array.isArray(typeDef) ? typeDef : [typeDef];
	
	            if (util.isPlainObject(typeDef)) {
	              typeArray = [new AxialInterface(path, typeDef, this)];
	            } else {
	              // ensure type is wrapped in array, expand/flatten any inner arrays
	              typeArray = util.expandArray(typeArray);
	
	              // check type is only defined once and is AxialType
	              for (var i = 0; i < typeArray.length; i++) {
	                var t = typeArray[i];
	                if (!util.isType(t)) {
	                  // throw when type not found
	                  throw new AxialUnsupportedType(t, this, key);
	                }
	                var typeName = t.id;
	                if (definedTypes[typeName]) {
	                  // throw when type defined multiple times
	                  throw new AxialTypeAlreadyDefined(t.id, key, this);
	                } else {
	                  // mark type as defined
	                  definedTypes[typeName] = true;
	                }
	              }
	            }
	
	            // create property
	            var property = new AxialInterfaceProperty(this, key, typeArray, path);
	
	            // store property
	            this._properties.set(key, property);
	
	            if (property.is(Axial.Function)) {
	              // track default function value in this interfaces known methods
	              this._methods.set(key, property.getType(Axial.Function)._defaultValue);
	            }
	          }
	        }
	      }
	    }, {
	      key: 'create',
	      value: function create() {
	        var _this23 = this;
	
	        var defaultValues = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	        var owner = arguments[1];
	
	        // create instance
	        var instance = new AxialInstance(this, owner);
	
	        // check undefined keys are not being passed
	        var isPlainObject = util.isPlainObject(defaultValues);
	
	        if (isPlainObject) {
	          util.expandDotSyntaxKeys(defaultValues, function (path, key, object) {
	            if (!_this23._properties.has(key) && !_isValidKey(key)) {
	              throw new AxialUnexpectedProperty(key, _this23, instance);
	            }
	            var property = _this23._properties.get(key);
	            var subPath = path.split('.').slice(1).join('.');
	            var obj = {};
	            util.setObjectAtPath(obj, subPath, object);
	            defaultValues[key] = property.primaryInterface.create(obj, instance);
	          });
	        }
	
	        for (var key in defaultValues) {
	          if (isPlainObject && defaultValues.hasOwnProperty(key)) {
	            if (!this._properties.has(key) && !_isValidKey(key)) {
	              throw new AxialUnexpectedProperty(key, this, instance);
	            }
	          }
	        }
	
	        this._properties.forEach(function (property, key) {
	          // install getters and setters for each property in interface
	          var value = defaultValues[key];
	
	          // expect property definition type to be valid AxialType
	          if (defaultValues.hasOwnProperty(key)) {
	            property.validate(value, instance);
	          }
	
	          // define the getter and setter property of the instance
	          instance.defineAccessors(property);
	
	          // if this is an interface, swap with AxialInstance from interface using plain object sub-tree as default values
	          if (property.is(Axial.Interface) && !value) {
	            value = property.primaryInterface.create(value, instance);
	          } else if (!defaultValues.hasOwnProperty(key)) {
	            if (property.isRequired) {
	              throw new AxialMissingProperty(key, _this23, defaultValues);
	            } else {
	              value = property.defaultValue;
	            }
	          }
	
	          // set the value of the property
	          if (typeof value !== 'undefined') {
	            property.set(instance, value);
	          }
	        });
	
	        // call init if present
	        var init = instance.init;
	        if (typeof init === 'function') {
	          init.call(instance);
	        }
	
	        return instance;
	      }
	    }, {
	      key: 'validate',
	      value: function validate(value, instance, property) {
	        // check value is object
	        if (!AxialObject.prototype.is.call(this, value)) {
	          throw new AxialInvalidType(util.typeOf(value).id, this.id, instance, property);
	        }
	
	        // check value has no extra props
	        for (var key in value) {
	          if (value.hasOwnProperty(key)) {
	            if (!this._properties.has(key) && !_isValidKey(key)) {
	              throw new AxialUnexpectedProperty(key, this, instance);
	            }
	          }
	        }
	
	        // check each property validates
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	          for (var _iterator = this._properties.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var _step$value = _slicedToArray(_step.value, 2),
	                k = _step$value[0],
	                _property = _step$value[1];
	
	            if (!value.hasOwnProperty(k) && _property.isRequired) {
	              throw new AxialMissingProperty(k, this, value);
	            }
	            if (value.hasOwnProperty(k) || _property.isRequired) {
	              _property.validate(value[k], instance);
	            }
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator.return) {
	              _iterator.return();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	      }
	    }, {
	      key: 'is',
	      value: function is(value) {
	        if (this._id === null) {
	          // the initial Interface type will never match values
	          return false;
	        }
	
	        if (!AxialObject.prototype.is.call(this, value)) {
	          return false;
	        }
	
	        // check has no extra props
	        for (var key in value) {
	          if (value.hasOwnProperty(key)) {
	            if (!this._properties.has(key)) {
	              return false;
	            }
	          }
	        }
	
	        // check each property validates
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;
	
	        try {
	          for (var _iterator2 = this._properties.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var _step2$value = _slicedToArray(_step2.value, 2),
	                k = _step2$value[0],
	                property = _step2$value[1];
	
	            if (!value.hasOwnProperty(k) && property.isRequired) {
	              // missing property
	              return false;
	            }
	            try {
	              // value must validate
	              if (value.hasOwnProperty(k) || property.isRequired) {
	                property.validate(value[k]);
	              }
	            } catch (e) {
	              return false;
	            }
	          }
	        } catch (err) {
	          _didIteratorError2 = true;
	          _iteratorError2 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	              _iterator2.return();
	            }
	          } finally {
	            if (_didIteratorError2) {
	              throw _iteratorError2;
	            }
	          }
	        }
	
	        return true;
	      }
	    }, {
	      key: 'has',
	      value: function has(key) {
	        return this._properties.has(key);
	      }
	    }, {
	      key: 'property',
	      value: function property(name) {
	        var path = name;
	        if (this._id && path.indexOf(this._id) !== 0) {
	          path = this._id + '.' + path;
	        }
	        return this.rootInterface._allProps.get(path);
	      }
	    }, {
	      key: 'forEach',
	      value: function forEach(fn) {
	        var _iteratorNormalCompletion3 = true;
	        var _didIteratorError3 = false;
	        var _iteratorError3 = undefined;
	
	        try {
	          for (var _iterator3 = this._properties[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	            var _step3$value = _slicedToArray(_step3.value, 2),
	                key = _step3$value[0],
	                property = _step3$value[1];
	
	            fn(property, key);
	          }
	        } catch (err) {
	          _didIteratorError3 = true;
	          _iteratorError3 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion3 && _iterator3.return) {
	              _iterator3.return();
	            }
	          } finally {
	            if (_didIteratorError3) {
	              throw _iteratorError3;
	            }
	          }
	        }
	      }
	    }, {
	      key: 'keys',
	      value: function keys() {
	        var keys = [];
	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;
	
	        try {
	          for (var _iterator4 = this.rootInterface._allProps.keys()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	            var path = _step4.value;
	
	            keys.push(path);
	          }
	        } catch (err) {
	          _didIteratorError4 = true;
	          _iteratorError4 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion4 && _iterator4.return) {
	              _iterator4.return();
	            }
	          } finally {
	            if (_didIteratorError4) {
	              throw _iteratorError4;
	            }
	          }
	        }
	
	        return keys;
	      }
	    }, {
	      key: 'extend',
	      value: function extend(interfaceName) {
	        var prototype = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	        if (typeof interfaceName !== 'string') {
	          // TODO: make proper error
	          throw new Error('Interface requires name');
	        }
	        var iface = new AxialInterface(interfaceName, prototype, this._parentInterface);
	        iface._iparent = this;
	        var obj = this;
	        while (obj) {
	          var _iteratorNormalCompletion5 = true;
	          var _didIteratorError5 = false;
	          var _iteratorError5 = undefined;
	
	          try {
	            for (var _iterator5 = obj._properties.entries()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	              var _step5$value = _slicedToArray(_step5.value, 2),
	                  key = _step5$value[0],
	                  property = _step5$value[1];
	
	              if (!iface.has(key)) {
	                iface._properties.set(key, property);
	                iface._allProps.set(interfaceName + '.' + key, property);
	              }
	            }
	          } catch (err) {
	            _didIteratorError5 = true;
	            _iteratorError5 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion5 && _iterator5.return) {
	                _iterator5.return();
	              }
	            } finally {
	              if (_didIteratorError5) {
	                throw _iteratorError5;
	              }
	            }
	          }
	
	          obj = obj._iparent;
	        }
	        return iface;
	      }
	    }, {
	      key: 'id',
	      get: function get() {
	        return this._id;
	      },
	      set: function set(id) {
	        if (this._id) {
	          delete Axial.Interface[this._id];
	          //test-all gone?
	        }
	        this._id = id;
	        Axial.Interface[this._id] = this;
	      }
	    }, {
	      key: 'rootInterface',
	      get: function get() {
	        var iface = this;
	        while (iface._parentInterface) {
	          iface = iface._parentInterface;
	        }
	        return iface;
	      }
	    }, {
	      key: 'isRootInterface',
	      get: function get() {
	        return this.rootInterface === this;
	      }
	    }, {
	      key: 'isSubInterface',
	      get: function get() {
	        return !this.isRootInterface;
	      }
	    }]);
	
	    return AxialInterface;
	  }(AxialObject);
	
	  var AxialAnything = function (_AxialType12) {
	    _inherits(AxialAnything, _AxialType12);
	
	    function AxialAnything() {
	      _classCallCheck(this, AxialAnything);
	
	      return _possibleConstructorReturn(this, (AxialAnything.__proto__ || Object.getPrototypeOf(AxialAnything)).apply(this, arguments));
	    }
	
	    _createClass(AxialAnything, [{
	      key: 'is',
	      value: function is(value) {
	        return true;
	      }
	    }, {
	      key: 'validate',
	      value: function validate() {}
	    }], [{
	      key: 'id',
	      get: function get() {
	        return '*';
	      }
	    }]);
	
	    return AxialAnything;
	  }(AxialType);
	
	  // -------------------------------------------------------------------------------------- Instances
	
	
	  var AxialInstance = function () {
	    function AxialInstance(iface, owner) {
	      _classCallCheck(this, AxialInstance);
	
	      this._state = {};
	      this._listeners = {};
	      this.isWatching = false;
	      this.id = getInstanceId(iface);
	      this.super = {};
	      this.owner = owner;
	      this.iface = iface;
	      if (iface) {
	        // track instance
	        var id = iface.id;
	        var arrayAtKey = _instances[id];
	        _instances[id] = Array.isArray(arrayAtKey) ? arrayAtKey : [];
	        _instances[id].push(this);
	        if (_instancesCreated.indexOf(iface) === -1) {
	          _instancesCreated.push(iface);
	        }
	
	        // go through each AxialInterface._methods and bind copy to this instance
	        var interfaceToIndex = iface;
	        while (interfaceToIndex) {
	          var methods = {};
	          this.super[interfaceToIndex.id] = methods;
	          var _iteratorNormalCompletion6 = true;
	          var _didIteratorError6 = false;
	          var _iteratorError6 = undefined;
	
	          try {
	            for (var _iterator6 = interfaceToIndex._methods.entries()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	              var _step6$value = _slicedToArray(_step6.value, 2),
	                  key = _step6$value[0],
	                  fn = _step6$value[1];
	
	              methods[key] = fn.bind(this);
	            }
	          } catch (err) {
	            _didIteratorError6 = true;
	            _iteratorError6 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion6 && _iterator6.return) {
	                _iterator6.return();
	              }
	            } finally {
	              if (_didIteratorError6) {
	                throw _iteratorError6;
	              }
	            }
	          }
	
	          interfaceToIndex = interfaceToIndex._iparent;
	        }
	      }
	    }
	
	    _createClass(AxialInstance, [{
	      key: 'definePrivateProperties',
	      value: function definePrivateProperties(descriptor) {
	        for (var name in descriptor) {
	          if (descriptor.hasOwnProperty(name)) {
	            this.definePrivateProperty(name, descriptor[name]);
	          }
	        }
	      }
	    }, {
	      key: 'definePrivateProperty',
	      value: function definePrivateProperty(name, value) {
	        var mem = {
	          value: value
	        };
	        Object.defineProperty(this, name, {
	          enumerable: false,
	          get: function get() {
	            return mem.value;
	          },
	          set: function set(val) {
	            mem.value = val;
	          }
	        });
	      }
	    }, {
	      key: 'typeOf',
	      value: function typeOf(ifaceOrId) {
	        if (typeof ifaceOrId === 'string') {
	          return this.iface.id === ifaceOrId.id;
	        }
	        return this.iface === ifaceOrId;
	      }
	    }, {
	      key: 'shouldAssign',
	      value: function shouldAssign(instance, property) {
	        if (typeof this.onAssign === 'function') {
	          var e = {
	            instance: instance,
	            property: property,
	            role: 'parent',
	            cancel: function cancel(message) {
	              this.canceled = true;
	              this.message = message;
	            }
	          };
	          this.onAssign(e);
	          if (e.canceled) {
	            this.dispatch('reject', {
	              instance: this,
	              target: instance,
	              property: property,
	              method: 'assign',
	              role: 'parent',
	              key: property.key,
	              message: e.message
	            });
	            return false;
	          }
	        }
	
	        if (typeof instance.onAssign === 'function') {
	          var _e = {
	            instance: this,
	            property: property,
	            role: 'child',
	            cancel: function cancel(message) {
	              this.canceled = true;
	              this.message = message;
	            }
	          };
	          instance.onAssign(_e);
	          if (_e.canceled) {
	            instance.dispatch('reject', {
	              instance: instance,
	              target: this,
	              property: property,
	              method: 'assign',
	              role: 'child',
	              key: property.key,
	              message: _e.message
	            });
	            return false;
	          }
	        }
	
	        return true;
	      }
	    }, {
	      key: 'defineAccessors',
	      value: function defineAccessors(property) {
	        var key = property.key;
	        if (this.hasOwnProperty(key)) {
	          // TODO: use real error
	          throw new Error('Illegal property key');
	        }
	        Object.defineProperty(this, key, {
	          enumerable: true,
	          configurable: true,
	          // create setter for instance
	          set: function (value) {
	            // wrap property setter
	            return property.set(this, value);
	          }.bind(this),
	          // create getter for instance
	          get: function () {
	            // wrap property getter
	            return property.get(this);
	          }.bind(this)
	        });
	      }
	    }, {
	      key: 'equals',
	      value: function equals(instance) {
	        if (this === instance) {
	          return true;
	        }
	        if (util.isPlainObject(instance)) {
	          try {
	            instance = this.iface.create(instance);
	          } catch (e) {
	            return false;
	          }
	        }
	        if (!(instance instanceof AxialInstance)) {
	          return false;
	        }
	        var _iteratorNormalCompletion7 = true;
	        var _didIteratorError7 = false;
	        var _iteratorError7 = undefined;
	
	        try {
	          for (var _iterator7 = this.iface._properties.entries()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	            var _step7$value = _slicedToArray(_step7.value, 2),
	                key = _step7$value[0],
	                property = _step7$value[1];
	
	            var sourceValue = this._state[key];
	            var targetValue = instance[key];
	            if (sourceValue instanceof AxialInstance) {
	              if (targetValue instanceof AxialInstance) {
	                return sourceValue.equals(targetValue);
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
	        } catch (err) {
	          _didIteratorError7 = true;
	          _iteratorError7 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion7 && _iterator7.return) {
	              _iterator7.return();
	            }
	          } finally {
	            if (_didIteratorError7) {
	              throw _iteratorError7;
	            }
	          }
	        }
	
	        return true;
	      }
	    }, {
	      key: 'bind',
	      value: function bind(key, fn, method) {
	        if (typeof method === 'string') {
	          (function () {
	            var _fn = fn;
	            fn = function fn(e) {
	              if (e.method === method) {
	                _fn(e);
	              }
	            };
	          })();
	        }
	        this._listeners[key] = this._listeners[key] ? this._listeners[key] : [];
	        this._listeners[key].push(fn);
	      }
	    }, {
	      key: 'unbind',
	      value: function unbind(key, fn) {
	        if (arguments.length === 0) {
	          this._listeners = {};
	        } else if (key && !fn) {
	          this._listeners[key].length = 0;
	        } else {
	          var index = this._listeners[key].indexOf(fn);
	          this._listeners[key].splice(index, 1);
	        }
	      }
	    }, {
	      key: 'dispatch',
	      value: function dispatch(key, eventData) {
	        // dispatch globally too
	        var returnValue = Axial.dispatch(eventData);
	        if (returnValue) {
	          // global handlers override local handlers
	          return returnValue;
	        }
	
	        // dispatch for each event listener attached to key
	        var listeners = this._listeners[key];
	        if (listeners) {
	          var l = listeners.length;
	          for (var i = 0; i < l; i++) {
	            returnValue = listeners[i](eventData);
	            if (returnValue) {
	              return returnValue;
	            }
	          }
	        }
	      }
	    }, {
	      key: 'onSetter',
	      value: function onSetter(key, fn) {
	        return this.bind(key, fn, 'set');
	      }
	    }, {
	      key: 'onGetter',
	      value: function onGetter(key, fn) {
	        return this.bind(key, fn, 'get');
	      }
	    }, {
	      key: 'keys',
	      value: function keys() {
	        return [].concat(_toConsumableArray(this.iface._properties.keys()));
	      }
	    }, {
	      key: 'property',
	      value: function property(path) {
	        return this.iface.property(path);
	      }
	    }, {
	      key: 'value',
	      value: function value(path, shouldThrowIfNotFound) {
	        var root = this.rootOwner;
	        return util.getObjectAtPath(root, path, shouldThrowIfNotFound);
	      }
	    }, {
	      key: 'forEach',
	      value: function forEach(fn) {
	        var iface = this.iface;
	        var _iteratorNormalCompletion8 = true;
	        var _didIteratorError8 = false;
	        var _iteratorError8 = undefined;
	
	        try {
	          for (var _iterator8 = iface._properties.keys()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	            var key = _step8.value;
	
	            fn(key, this._state[key]);
	          }
	        } catch (err) {
	          _didIteratorError8 = true;
	          _iteratorError8 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion8 && _iterator8.return) {
	              _iterator8.return();
	            }
	          } finally {
	            if (_didIteratorError8) {
	              throw _iteratorError8;
	            }
	          }
	        }
	
	        return this;
	      }
	    }, {
	      key: 'map',
	      value: function map(fn) {
	        var array = [];
	        var iface = this.iface;
	        var _iteratorNormalCompletion9 = true;
	        var _didIteratorError9 = false;
	        var _iteratorError9 = undefined;
	
	        try {
	          for (var _iterator9 = iface._properties.keys()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	            var key = _step9.value;
	
	            array.push(fn(key, this._state[key]));
	          }
	        } catch (err) {
	          _didIteratorError9 = true;
	          _iteratorError9 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion9 && _iterator9.return) {
	              _iterator9.return();
	            }
	          } finally {
	            if (_didIteratorError9) {
	              throw _iteratorError9;
	            }
	          }
	        }
	
	        return array;
	      }
	    }, {
	      key: 'dispose',
	      value: function dispose() {
	        var _this25 = this;
	
	        this.iface.forEach(function (property, key) {
	          var item = _this25._state[key];
	          if (typeof item.dispose === 'function') {
	            item.dispose();
	          }
	          delete _this25._state[key];
	          delete _this25[key];
	        });
	        delete this;
	        delete _instances[this.iface.id];
	      }
	    }, {
	      key: 'get',
	      value: function get(key, defaultValue) {
	        var value = this[key];
	        return this._state.hasOwnProperty(key) ? value : defaultValue;
	      }
	    }, {
	      key: 'set',
	      value: function set(key, value) {
	        this[key] = value;
	        return this;
	      }
	    }, {
	      key: 'toPlainObject',
	      value: function toPlainObject() {
	        try {
	          var json = {};
	          var _iteratorNormalCompletion10 = true;
	          var _didIteratorError10 = false;
	          var _iteratorError10 = undefined;
	
	          try {
	            for (var _iterator10 = this.iface._properties.keys()[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
	              var key = _step10.value;
	
	              var property = this.iface._properties.get(key);
	              if (!property.exports) {
	                debugger;
	                // TODO: double check all this serialisation...
	                continue;
	              }
	              var value = this._state[key];
	              var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);
	              if (value instanceof AxialInstance) {
	                json[key] = value.toPlainObject();
	              } else if (value instanceof AxialInstanceArray) {
	                json[key] = value.toPlainObject();
	              } else if (type === 'string' || type === 'number' || type === 'boolean' || util.isPlainObject(value)) {
	                json[key] = value;
	              }
	            }
	          } catch (err) {
	            _didIteratorError10 = true;
	            _iteratorError10 = err;
	          } finally {
	            try {
	              if (!_iteratorNormalCompletion10 && _iterator10.return) {
	                _iterator10.return();
	              }
	            } finally {
	              if (_didIteratorError10) {
	                throw _iteratorError10;
	              }
	            }
	          }
	
	          return json;
	        } catch (e) {
	          return e;
	        }
	      }
	    }, {
	      key: 'stringify',
	      value: function stringify(prettyPrint) {
	        return JSON.stringify.call(null, this.toPlainObject(), null, prettyPrint === true ? 4 : undefined);
	      }
	    }, {
	      key: 'toString',
	      value: function toString() {
	        return (this.iface.isRootInterface ? '+-' : '>-') + this.id;
	      }
	    }, {
	      key: 'onAssign',
	      value: function onAssign(instance, property) {
	        // return false to stop the instance from being assigned to the given property of this
	      }
	    }, {
	      key: 'rootOwner',
	      get: function get() {
	        var obj = this.owner;
	        var root = this;
	        while (obj) {
	          root = obj;
	          obj = obj.owner;
	        }
	        return root;
	      }
	    }]);
	
	    return AxialInstance;
	  }();
	
	  /**
	   * TODO: Bubble up rejection errors to root owner.
	   * This way components can be designed to capture errors from docked children.
	   */
	
	  var AxialInterfaceProperty = function () {
	    function AxialInterfaceProperty(iface, key, types, path) {
	      _classCallCheck(this, AxialInterfaceProperty);
	
	      this.iface = iface;
	      this._key = key;
	      this._types = types;
	      this._path = path;
	
	      iface.rootInterface._allProps.set(path, this);
	    }
	
	    _createClass(AxialInterfaceProperty, [{
	      key: 'is',
	      value: function is(type) {
	        var t = this._types;
	        var l = t.length;
	        for (var i = 0; i < l; i++) {
	          var pType = t[i];
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
	    }, {
	      key: 'validate',
	      value: function validate(value, instance) {
	        var t = this._types;
	        var l = t.length;
	        var hasValidated = false;
	        var errors = [];
	        if (value instanceof AxialInstanceArray) {
	          value = value._array;
	        }
	        for (var i = 0; i < l; i++) {
	          var type = t[i];
	          try {
	            var didValidate = type.validate(value, instance, this) !== false;
	            if (!didValidate) {
	              return false;
	            }
	            hasValidated = true;
	          } catch (e) {
	            e.key = this.key;
	            errors.push({ type: type, error: e });
	          }
	        }
	        if (!hasValidated) {
	          throw errors[0].error;
	        }
	        return true;
	      }
	
	      /**
	       * setter
	       * @param instance
	       * @param value
	       */
	
	    }, {
	      key: 'set',
	      value: function set(instance, value) {
	        var _this26 = this;
	
	        var oldValue = instance._state[this._key];
	        var rawValue = value;
	        var type = util.typeOf(value);
	        var didValidate = void 0;
	
	        try {
	          didValidate = this.validate(value, instance);
	
	          if (!didValidate) {
	            // if any built-in or validate() validation method returns false,
	            // don't set the value
	            instance.dispatch('reject', {
	              instance: instance,
	              target: instance,
	              property: this,
	              method: 'set',
	              key: this._key,
	              value: value,
	              newValue: rawValue,
	              oldValue: oldValue
	            });
	            return;
	          }
	        } catch (e) {
	          instance.dispatch('reject', {
	            instance: instance,
	            target: instance,
	            property: this,
	            method: 'set',
	            key: this._key,
	            value: value,
	            newValue: rawValue,
	            oldValue: oldValue,
	            error: e
	          });
	          throw e;
	        }
	
	        // clip if number with clipping
	        if (this.is(Axial.Number) && type.id === 'number') {
	          var numType = this.getType(Axial.Number);
	          if (numType._clip) {
	            value = numType.clip(value);
	          }
	        }
	
	        // convert to AxialInstance if Interface and object given
	        if (this.is(Axial.Interface) && util.isPlainObject(value)) {
	          var iface = this.primaryInterface;
	          value = iface.create(value, instance);
	        }
	
	        // trigger assign events, give owner a chance to reject the child being assigned
	        if (value instanceof AxialInstance) {
	          var shouldAssign = instance.shouldAssign(value, this);
	          if (shouldAssign === false) {
	            return false;
	          }
	        }
	
	        // convert to AxialInstanceArray if array
	        if (this.is(Axial.Array()) && Array.isArray(value)) {
	          value = new AxialInstanceArray(instance, this, value);
	        }
	
	        // convert to bound function (if function)
	        if (this.is(Axial.Function) && typeof value === 'function' && !value._isAxialBound) {
	          (function () {
	            var fn = value;
	            value = function () {
	              // dispatch call, execute function
	              instance.dispatch(this._key, {
	                instance: instance,
	                target: instance,
	                property: this,
	                method: 'call',
	                key: this._key,
	                value: arguments,
	                arguments: arguments,
	                newValue: fn,
	                oldValue: fn
	              });
	
	              return fn.apply(instance, arguments);
	            }.bind(_this26);
	            value._isAxialBound = true;
	          })();
	        }
	
	        // set state
	        instance._state[this._key] = value;
	
	        // dispatch event
	        var returnValue = instance.dispatch(this._key, {
	          instance: instance,
	          target: instance,
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
	
	        if (value instanceof AxialInstance) {
	          (function () {
	            // let instance value know it was docked
	            var oldOwner = value.owner;
	            value.owner = instance;
	
	            var event = {
	              instance: instance,
	              property: _this26,
	              method: 'assign',
	              role: 'child',
	              key: _this26.key,
	              newOwner: instance,
	              oldOwner: oldOwner,
	              preserveOwner: function preserveOwner() {
	                value.owner = oldOwner;
	              }
	            };
	
	            if (typeof value.onAssigned === 'function') {
	              value.onAssigned(event);
	            }
	
	            value.dispatch(_this26.key, event);
	          })();
	        }
	      }
	
	      /**
	       * getter
	       * @param instance
	       * @returns {*}
	       */
	
	    }, {
	      key: 'get',
	      value: function get(instance) {
	        var value = instance._state[this._key];
	
	        // dispatch event
	        instance.dispatch(this._key, {
	          instance: instance,
	          target: instance,
	          property: this,
	          method: 'get',
	          key: this._key,
	          value: value
	        });
	
	        return value;
	      }
	    }, {
	      key: 'getType',
	      value: function getType(type) {
	        for (var i = 0; i < this._types.length; i++) {
	          if (this._types[i].constructor === type.constructor) {
	            return this._types[i];
	          }
	        }
	        // TODO: proper error
	        throw new Error('Type not found');
	      }
	    }, {
	      key: 'path',
	      get: function get() {
	        return this._path;
	      }
	    }, {
	      key: 'key',
	      get: function get() {
	        return this._key;
	      }
	    }, {
	      key: 'types',
	      get: function get() {
	        return this._types;
	      }
	    }, {
	      key: 'defaultValue',
	      get: function get() {
	        return this.primaryType._defaultValue;
	      }
	    }, {
	      key: 'isSingleType',
	      get: function get() {
	        return this._types.length === 1;
	      }
	    }, {
	      key: 'isInterface',
	      get: function get() {
	        return this.is(Axial.Interface);
	      }
	    }, {
	      key: 'primaryType',
	      get: function get() {
	        return this._types[0];
	      }
	    }, {
	      key: 'deepPrimaryArrayType',
	      get: function get() {
	        var type = this._types[0];
	        if (!(type instanceof AxialArray)) {
	          return null;
	        }
	        while (type instanceof AxialArray && type._type && !(type instanceof AxialInstanceArray)) {
	          type = type._type;
	        }
	        return type;
	      }
	    }, {
	      key: 'primaryInterface',
	      get: function get() {
	        return this._types.find(function (type) {
	          return type instanceof AxialInterface;
	        });
	      }
	    }, {
	      key: 'primaryArrayType',
	      get: function get() {
	        var array = this._types.find(function (type) {
	          return type instanceof AxialArray;
	        });
	        return array ? array.type : null;
	      }
	    }, {
	      key: 'isRequired',
	      get: function get() {
	        for (var i = 0; i < this._types.length; i++) {
	          if (this._types[i]._required) {
	            return true;
	          }
	        }
	        return false;
	      }
	    }, {
	      key: 'exports',
	      get: function get() {
	        for (var i = 0; i < this._types.length; i++) {
	          if (!this._types[i]._exports) {
	            return false;
	          }
	        }
	        return true;
	      }
	    }]);
	
	    return AxialInterfaceProperty;
	  }();
	
	  var AxialBinding = function () {
	    function AxialBinding(instance, key, handler) {
	      _classCallCheck(this, AxialBinding);
	
	      this._instance = instance;
	      this._key = key;
	      this._property = instance.property(this._key);
	      this._handler = handler;
	      this._active = false;
	    }
	
	    _createClass(AxialBinding, [{
	      key: 'bind',
	      value: function bind() {
	        this._instance.bind(this._key, this._handler);
	        this._active = true;
	        _bindings.push(this);
	      }
	    }, {
	      key: 'unbind',
	      value: function unbind() {
	        this._instance.unbind(this._key, this._handler);
	        this._active = false;
	        var i = _bindings.indexOf(this);
	        _bindings.splice(i, 1);
	      }
	    }, {
	      key: 'dispose',
	      value: function dispose() {
	        if (this._active) {
	          this.unbind();
	        }
	        delete this._instance;
	        delete this._handler;
	      }
	    }, {
	      key: 'get',
	      value: function get() {
	        return this._instance._state[this._key];
	      }
	    }, {
	      key: 'toString',
	      value: function toString() {
	        return this._instance.toString() + ':' + this._key;
	      }
	    }, {
	      key: 'instance',
	      get: function get() {
	        return this._instance;
	      }
	    }, {
	      key: 'key',
	      get: function get() {
	        return this._key;
	      }
	    }, {
	      key: 'property',
	      get: function get() {
	        return this._property;
	      }
	    }, {
	      key: 'handler',
	      get: function get() {
	        return this._handler;
	      }
	    }, {
	      key: 'isActive',
	      get: function get() {
	        return this._active;
	      }
	    }]);
	
	    return AxialBinding;
	  }();
	
	  var AxialInstanceArray = function () {
	    function AxialInstanceArray(instance, property) {
	      var _this27 = this;
	
	      var array = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	
	      _classCallCheck(this, AxialInstanceArray);
	
	      this._instance = instance;
	      this.id = getInstanceId(AxialInstanceArray);
	      this._property = property;
	      this._key = property.key;
	      this._indexLength = null;
	      var self = this;
	
	      // expand items to instances if interface type
	      this._array = array;
	      if (array.length) {
	        this._array = this.convertArray(array);
	      }
	      this.length = this._array.length;
	
	      _arrayMembers.forEach(function (member) {
	        // stub each member of Array.prototype
	        // validate arguments if mutator...
	        Object.defineProperty(_this27, member, {
	          enumerable: false,
	
	          value: function value() {
	            var args = Array.prototype.slice.call(arguments);
	            var isMutator = _arrayMutators.indexOf(member) > -1;
	            var hasValidated = true;
	
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
	
	            var oldLength = this._array.length;
	            var returnValue = Array.prototype[member].apply(this._array, args);
	            this.length = this._array.length;
	
	            // ...otherwise validate array (is valid type?) afterwards
	            if (!hasValidated) {
	              property.validate(this._array, self._instance);
	            }
	
	            // if this is an array mutator method, dispatch event
	            if (isMutator) {
	              self.bindIndexes();
	              this.dispatch(this._key, {
	                instance: instance,
	                property: this._property,
	                method: 'set',
	                arrayMethod: member,
	                key: this._key,
	                value: this,
	                newValue: this,
	                oldValue: null,
	                oldLength: oldLength,
	                newLength: this._array.length
	              });
	            }
	
	            return returnValue;
	          }
	        });
	      });
	
	      this.bindIndexes();
	    }
	
	    _createClass(AxialInstanceArray, [{
	      key: 'bindIndexes',
	      value: function bindIndexes() {
	        var _this28 = this;
	
	        var array = this._array;
	        var instance = this._instance;
	        var property = this._property;
	        // delete previous indexes
	        if (this._indexLength) {
	          var _l = this._indexLength;
	          for (var i = 0; i < _l; i++) {
	            delete this[i];
	          }
	        }
	        // write each index as an accessor
	        var l = array.length + 1;
	
	        var _loop = function _loop(_i) {
	          _this28._indexLength++;
	          var key = '' + _i;
	          if (!_this28.hasOwnProperty(key)) {
	            Object.defineProperty(_this28, key, {
	              get: function get() {
	                // dispatch event
	                instance.dispatch(property.key, {
	                  instance: instance,
	                  property: property,
	                  arrayMethod: 'index',
	                  method: 'get',
	                  index: _i,
	                  key: property.key,
	                  value: array[_i]
	                });
	                return array[_i];
	              },
	              set: function set(value) {
	                var _this29 = this;
	
	                var oldValue = array[_i];
	                var rawValue = value;
	
	                property.validate([value], instance);
	
	                // convert to AxialInstance if Interface and object given
	                var arrayType = property.primaryArrayType;
	                if (arrayType && util.isPlainObject(value) && arrayType.is(value)) {
	                  value = arrayType.create(value, instance);
	                }
	
	                // convert to AxialInstanceArray if array
	                if (property.is(Axial.Array()) && Array.isArray(value)) {
	                  value = new AxialInstanceArray(instance, property, value);
	                }
	
	                // convert to bound function (if function)
	                if (property.is(Axial.Function) && typeof value === 'function' && !value._isAxialBound) {
	                  (function () {
	                    var fn = value;
	                    value = function () {
	                      // dispatch call, execute function
	                      instance.dispatch(property._key, {
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
	                    }.bind(_this29);
	                    value._isAxialBound = true;
	                  })();
	                }
	
	                array[_i] = value;
	
	                instance.dispatch(property.key, {
	                  instance: instance,
	                  property: property,
	                  arrayMethod: 'index',
	                  method: 'set',
	                  index: _i,
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
	        };
	
	        for (var _i = 0; _i < l; _i++) {
	          _loop(_i);
	        }
	      }
	    }, {
	      key: 'dispatch',
	      value: function dispatch(key, e) {
	        this._instance.dispatch(key, e);
	      }
	    }, {
	      key: 'convertArray',
	      value: function convertArray(rawArray) {
	        // convert plain array to array of wrapped objects ~ AxialInstance or AxialInstanceArray or value
	        var array = [];
	        var l = rawArray.length;
	        for (var i = 0; i < l; i++) {
	          var item = rawArray[i];
	          if (item instanceof AxialInstance || item instanceof AxialInstanceArray) {
	            array[i] = item;
	            continue;
	          }
	          var deepPrimaryArrayType = this.property.deepPrimaryArrayType;
	          if (deepPrimaryArrayType && deepPrimaryArrayType instanceof AxialInterface && deepPrimaryArrayType.is(item)) {
	            // find primary type form array
	            array[i] = deepPrimaryArrayType.create(item, this._instance);
	            continue;
	          }
	          var type = Axial.typeOf(item);
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
	    }, {
	      key: 'equals',
	      value: function equals(array) {
	        if (this === array) {
	          return true;
	        }
	        var targetArray = array instanceof AxialInstanceArray ? array._array : array;
	        if (array.length !== this.length || !Array.isArray(targetArray)) {
	          return false;
	        }
	        // iterate through and check equal items
	        var l = targetArray.length;
	        var sourceArray = this._array;
	        for (var i = 0; i < l; i++) {
	          var sourceItem = sourceArray[i];
	          var targetItem = targetArray[i];
	          if (sourceItem instanceof AxialInstance) {
	            if (targetItem instanceof AxialInstance) {
	              return sourceItem.equals(targetItem);
	            } else {
	              return false;
	            }
	          } else if (sourceItem instanceof AxialInstanceArray) {
	            if (targetItem instanceof AxialInstanceArray) {
	              return sourceItem.equals(targetItem);
	            } else {
	              return false;
	            }
	          } else if (sourceItem !== targetItem) {
	            return false;
	          }
	        }
	        return true;
	      }
	    }, {
	      key: 'add',
	      value: function add() /*items, ...*/{
	        var items = util.argsToItems.apply(null, arguments);
	        this.push.apply(this, items);
	      }
	    }, {
	      key: 'remove',
	      value: function remove() /*items, ...*/{
	        var array = this._array;
	        var items = util.argsToItems.apply(null, arguments);
	        var l = items.length;
	        for (var i = 0; i < l; i++) {
	          var item = items[i];
	          var index = array.indexOf(item);
	          this.splice(index, 1);
	        }
	        this.length = this._array.length;
	      }
	    }, {
	      key: 'contains',
	      value: function contains() /*items, ...*/{
	        var items = util.argsToItems.apply(null, arguments);
	        var l = items.length;
	        var array = this._array;
	        for (var i = 0; i < l; i++) {
	          if (array.indexOf(items[i]) > -1) {
	            return true;
	          }
	        }
	        return false;
	      }
	    }, {
	      key: 'move',
	      value: function move(fromIndex, toIndex) {
	        var item = this.splice(fromIndex, 1)[0];
	        this.splice(toIndex, 0, item);
	        return item;
	      }
	    }, {
	      key: 'moveUp',
	      value: function moveUp(item) {
	        var fromIndex = this.indexOf(item);
	        if (fromIndex > 0) {
	          this.move(fromIndex, fromIndex - 1);
	          return true;
	        }
	        return false;
	      }
	    }, {
	      key: 'moveDown',
	      value: function moveDown(item) {
	        var fromIndex = this.indexOf(item);
	        if (fromIndex > -1 && fromIndex < this._array.length - 1) {
	          this.move(fromIndex, fromIndex + 1);
	          return true;
	        }
	        return false;
	      }
	    }, {
	      key: 'shiftLeft',
	      value: function shiftLeft() {
	        var item = this.shift();
	        this.push(item);
	        return item;
	      }
	    }, {
	      key: 'shiftRight',
	      value: function shiftRight() {
	        var item = this.pop();
	        this.unshift(item);
	        return item;
	      }
	    }, {
	      key: 'first',
	      value: function first() {
	        return this._array[0];
	      }
	    }, {
	      key: 'last',
	      value: function last() {
	        return this._array[this._array.length - 1];
	      }
	    }, {
	      key: 'plural',
	      value: function plural() {
	        return this.length === 1 ? '' : 's';
	      }
	    }, {
	      key: 'toPlainObject',
	      value: function toPlainObject() {
	        var array = [];
	        var l = this._array.length;
	        for (var i = 0; i < l; i++) {
	          var item = this._array[i];
	          if (item instanceof AxialInstance) {
	            array[i] = item.toPlainObject();
	          } else if (item instanceof AxialInstanceArray) {
	            array[i] = item.toPlainObject();
	          } else {
	            array[i] = item;
	          }
	        }
	        return array;
	      }
	    }, {
	      key: 'stringify',
	      value: function stringify(prettyPrint) {
	        return JSON.stringify.call(null, this.toPlainObject(), null, prettyPrint === true ? 4 : undefined);
	      }
	    }, {
	      key: 'isEmpty',
	      get: function get() {
	        return this.length === 0;
	      }
	    }, {
	      key: 'instance',
	      get: function get() {
	        return this._instance;
	      }
	    }, {
	      key: 'property',
	      get: function get() {
	        return this._property;
	      }
	    }, {
	      key: 'key',
	      get: function get() {
	        return this._key;
	      }
	    }, {
	      key: 'array',
	      get: function get() {
	        return this._array;
	      }
	    }], [{
	      key: 'id',
	      get: function get() {
	        return 'AxialInstanceArray';
	      }
	    }]);
	
	    return AxialInstanceArray;
	  }();
	
	  // -------------------------------------------------------------------------------------- Util
	
	
	  util = {
	    isPlainObject: function isPlainObject(o) {
	      var t = o;
	      return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) !== 'object' || o === null ? false : function () {
	        while (true) {
	          if (Object.getPrototypeOf(t = Object.getPrototypeOf(t)) === null) {
	            break;
	          }
	        }
	        return Object.getPrototypeOf(o) === t;
	      }();
	    },
	    merge: function merge(source, target) {
	      var _this30 = this;
	
	      var copy = function copy(_source, _target) {
	        for (var _key in _target) {
	          if (_target.hasOwnProperty(_key)) {
	            var sourceValue = _source[_key];
	            var targetValue = _target[_key];
	            if (_this30.isPlainObject(targetValue)) {
	              if (_this30.isPlainObject(sourceValue)) {
	                copy(sourceValue, targetValue);
	              } else {
	                var obj = {};
	                _source[_key] = obj;
	                copy(obj, targetValue);
	              }
	            } else {
	              _source[_key] = targetValue;
	            }
	          }
	        }
	        return source;
	      };
	      return copy(source, target);
	    },
	    typeOf: function typeOf(value, nativeOnly) {
	      if (value instanceof AxialInstance) {
	        if (nativeOnly) {
	          return T.Object;
	        }
	        return value.iface;
	      }
	      if (T.Null.is(value)) {
	        return T.Null;
	      } else if (T.Undefined.is(value)) {
	        return T.Undefined;
	      } else if (T.String.is(value)) {
	        return T.String;
	      } else if (T.Number.is(value)) {
	        return T.Number;
	      } else if (T.Boolean.is(value)) {
	        return T.Boolean;
	      } else if (T.Date.is(value)) {
	        return T.Date;
	      } else if (T.Regex.is(value)) {
	        return T.Regex;
	      } else if (T.Function.is(value)) {
	        return T.Function;
	      } else if (T.Array.is(value)) {
	        if (nativeOnly) {
	          return T.Array();
	        }
	        if (value.length) {
	          return T.Array(this.typeOf(value[0]));
	        } else {
	          return T.Array();
	        }
	      } else if (T.Object.is(value)) {
	        return T.Object;
	      } else if (T.Interface.is(value)) {
	        if (nativeOnly) {
	          return T.Object;
	        }
	        return T.Interface;
	      }
	      throw new AxialUnsupportedType(value);
	    },
	    isType: function isType(type) {
	      type = Array.isArray(type) ? type : [type];
	      var l = type.length;
	      for (var i = 0; i < l; i++) {
	        if (!(type[i] instanceof AxialType)) {
	          return false;
	        }
	      }
	      return true;
	    },
	    getObjectPaths: function getObjectPaths(obj, includeBranchPaths) {
	      var _this31 = this;
	
	      var keys = [];
	      var ref = null;
	      var path = null;
	      var walk = function walk(o, p) {
	        for (var k in o) {
	          if (o.hasOwnProperty(k)) {
	            ref = o[k];
	            path = p ? p + '.' + k : k;
	            if (_this31.isPlainObject(ref)) {
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
	    getObjectPathValues: function getObjectPathValues(obj, includeBranchPaths) {
	      var _this32 = this;
	
	      var keyValues = [];
	      var ref = null;
	      var path = null;
	      var walk = function walk(o, p) {
	        for (var k in o) {
	          if (o.hasOwnProperty(k)) {
	            ref = o[k];
	            path = p ? p + '.' + k : k;
	            if (_this32.isPlainObject(ref)) {
	              if (includeBranchPaths === true) {
	                keyValues.push({ path: path, value: ref, isBranch: true });
	              }
	              walk(ref, path);
	            } else {
	              keyValues.push({ path: path, value: ref, isBranch: false });
	            }
	          }
	        }
	      };
	      walk(obj);
	      return keyValues;
	    },
	    getObjectAtPath: function getObjectAtPath(obj, path, shouldThrowIfNotFound) {
	      var steps = path.split('.');
	      var l = steps.length;
	      var ref = obj;
	      var k = null;
	      for (var i = 0; i < l; i++) {
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
	    setObjectAtPath: function setObjectAtPath(obj, path, value) {
	      var ref = obj;
	      var steps = path.split('.');
	      var l = steps.length - 1;
	      var k = null;
	      for (var i = 0; i < l; i++) {
	        k = steps[i];
	        if (!ref.hasOwnProperty(k)) {
	          ref[k] = {};
	        }
	        ref = ref[k];
	      }
	      ref[steps[l]] = value;
	    },
	    multiSetObjectAtPath: function multiSetObjectAtPath(obj, pathOrObject, value) {
	      var modifiedPaths = null;
	      if (this.isPlainObject(pathOrObject)) {
	        this.merge(obj, pathOrObject);
	        modifiedPaths = this.getObjectPaths(pathOrObject);
	      } else if (typeof pathOrObject === 'string') {
	        this.setObjectAtPath(obj, pathOrObject, value);
	        modifiedPaths = [pathOrObject];
	      }
	      return modifiedPaths;
	    },
	    expandDotSyntaxKeys: function expandDotSyntaxKeys(obj, resolver) {
	      for (var path in obj) {
	        if (obj.hasOwnProperty(path)) {
	          if (path.indexOf('.') > -1) {
	            var _key2 = path.split('.')[0];
	            resolver(path, _key2, obj[path]);
	            delete obj[path];
	          }
	        }
	      }
	      return obj;
	    },
	    expandArray: function expandArray(inArray) {
	      var outArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	
	      var l = inArray.length;
	      for (var i = 0; i < l; i++) {
	        var item = inArray[i];
	        if (Array.isArray(item)) {
	          this.expandArray(item, outArray);
	        } else {
	          outArray[outArray.length] = item;
	        }
	      }
	      return outArray;
	    },
	    stringify: function stringify(value) {
	      var _this33 = this;
	
	      var refs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	
	      if (typeof value === 'function') {
	        return 'function () {...}';
	      }
	      if (Array.isArray(value)) {
	        return '[#' + value.length + ']';
	      }
	      if (value instanceof AxialInstance) {
	        if (refs.indexOf(value) > -1) {
	          return 'circular!' + value.toString();
	        } else {
	          refs.push(value);
	        }
	        var props = value.map(function (k, v) {
	          return k + ':' + _this33.stringify(v, refs);
	        });
	        return '*' + value.iface.id + '#' + value.id + '{' + props.join(', ') + '}';
	      }
	      if (value instanceof AxialInstanceArray) {
	        return '*array#' + value.id + '[' + value.length + ']';
	      }
	      try {
	        return JSON.stringify(value);
	      } catch (e) {
	        return '' + value;
	      }
	    },
	    argsToItems: function argsToItems() {
	      var array = [];
	      var l = arguments.length;
	      if (l === 1 && Array.isArray(arguments[0])) {
	        array.push.apply(array, arguments);
	      } else if (l > 0) {
	        for (var i = 0; i < l; i++) {
	          var item = arguments[i];
	          array.push(item);
	        }
	      }
	      return array;
	    },
	    toString: function toString(value) {
	      if (value instanceof AxialInstance || value instanceof AxialInstanceArray) {
	        return value.id;
	      }
	      try {
	        return JSON.stringify(value);
	      } catch (e) {
	        return '' + value;
	      }
	    }
	  };
	
	  // -------------------------------------------------------------------------------------- Define Types
	  T = {
	    Null: new AxialNull(),
	    Undefined: new AxialUndefined(),
	    String: new AxialString(),
	    Number: new AxialNumber(),
	    Boolean: new AxialBoolean(),
	    Date: new AxialDate(),
	    Regex: new AxialRegex(),
	    Function: new AxialFunction(),
	    Array: function Array(type) {
	      var typeId = type ? type.id : '*';
	      var t = _arrayTypes[typeId];
	      if (t) {
	        return t;
	      } else {
	        t = _arrayTypes[typeId] = new AxialArray(type);
	        t._baseType = this.Array();
	        t._id = 'array[' + typeId + ']';
	      }
	      return t;
	    },
	    Object: new AxialObject(),
	    Interface: new AxialInterface(null),
	    Reference: new AxialReference(),
	    Anything: new AxialAnything()
	  };
	
	  Object.keys(T).forEach(function (typeName) {
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
	    if (value instanceof AxialInstanceArray) {
	      return true;
	    }
	    return Array.isArray(value);
	  };
	  T.Array.Type = T.Array();
	
	  // -------------------------------------------------------------------------------------- Axial
	  var Axial = (_Axial = {
	    define: function define(id, prototype) {
	      return new AxialInterface(id, prototype);
	    },
	    getInterface: function getInterface() {
	      var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'null';
	
	      // return first one defined (allows easy mocking/testing)
	      var ifaceArray = _interfaces[id];
	      if (ifaceArray) {
	        return ifaceArray[ifaceArray.length - 1];
	      }
	    },
	    interfaceIds: function interfaceIds() {
	      return Object.keys(_interfaces).filter(function (id) {
	        var ifaceArray = _interfaces[id];
	        return ifaceArray[0].isRootInterface;
	      });
	    },
	    interfaces: function interfaces() {
	      var o = {};
	      this.interfaceIds().forEach(function (id) {
	        return o[id] = _interfaces[id];
	      });
	      return o;
	    },
	
	    get instances() {
	      return _instances;
	    },
	    get bindings() {
	      return _bindings;
	    },
	    get bindingInfo() {
	      return this.bindings.map(function (binding) {
	        return binding.instance.id + ':' + binding.key;
	      });
	    },
	    getInstance: function getInstance(id) {
	      var arrayAtKey = _instances[id];
	      return Array.isArray(arrayAtKey) ? arrayAtKey[arrayAtKey.length - 1] : null;
	    }
	  }, _defineProperty(_Axial, 'instances', function instances() {
	    return _instances;
	  }), _defineProperty(_Axial, 'instanceCount', function instanceCount() {
	    var count = {};
	    for (var id in _instances) {
	      if (_instances.hasOwnProperty(id)) {
	        count[id] = _instances[id].length;
	      }
	    }
	    return count;
	  }), _defineProperty(_Axial, 'instancesCreated', function instancesCreated(includeSubInterfaces) {
	    return _instancesCreated.filter(function (iface) {
	      return includeSubInterfaces || iface.isRootInterface;
	    }).map(function (iface) {
	      return iface.id;
	    });
	  }), _defineProperty(_Axial, 'bind', function bind(fn) {
	    _listeners.push(fn);
	  }), _defineProperty(_Axial, 'unbind', function unbind(fn) {
	    if (fn) {
	      var index = _listeners.indexOf(fn);
	      _listeners.splice(index, 1);
	    } else {
	      _listeners.length = 0;
	    }
	  }), _defineProperty(_Axial, 'dispatch', function dispatch(eventData) {
	    if (_logListenerCount) {
	      // logging is a separate listener collection,
	      // in case Axial.unbind() is called logging can continue.
	      this.log(eventData);
	    }
	    var l = _listeners.length;
	    for (var i = 0; i < l; i++) {
	      var returnValue = _listeners[i](eventData);
	      if (returnValue) {
	        return returnValue;
	      }
	    }
	  }), _defineProperty(_Axial, 'Binding', AxialBinding), _defineProperty(_Axial, 'CONST', CONST), _defineProperty(_Axial, 'Instance', new AxialInstance()), _defineProperty(_Axial, 'InstanceArray', AxialInstanceArray), _defineProperty(_Axial, 'util', util), _defineProperty(_Axial, 'addLogListener', function addLogListener(method, fn) {
	    _logListeners[method] = _logListeners[method] || [];
	    _logListeners[method].push(fn);
	    _logListenerCount++;
	    return this;
	  }), _defineProperty(_Axial, 'removeLogListener', function removeLogListener(method, fn) {
	    if (typeof fn === 'undefined') {
	      _logListeners[method] = [];
	      return;
	    }
	    var index = _logListeners[method].indexOf(fn);
	    _logListeners[method].splice(index, 1);
	    _logListenerCount--;
	    return this;
	  }), _defineProperty(_Axial, 'log', function log(e) {
	    if (_logListeners.hasOwnProperty(e.method)) {
	      var array = _logListeners[e.method];
	      var l = array.length;
	      for (var i = 0; i < l; i++) {
	        array[i](e);
	      }
	    }
	  }), _defineProperty(_Axial, 'addDefaultLogListeners', function addDefaultLogListeners() {
	    this.addLogListener('get', function (e) {
	      if (typeof e.value === 'function') {
	        console.log('%cGET: ' + (e.instance.toString() + '.' + e.key) + (e.hasOwnProperty('index') ? '[' + e.index + ']' : '') + ':<' + e.property.types.join('|') + '>()', 'color:#999');
	      } else {
	        console.log('%cGET: ' + (e.instance.toString() + '.' + e.key) + (e.hasOwnProperty('index') ? '[' + e.index + ']' : '') + ':<' + e.property.types.join('|') + '> = ' + util.toString(e.value), 'color:#999');
	      }
	    }).addLogListener('set', function (e) {
	      console.log('%cSET: ' + e.property.path + ':<' + e.property.types.join('|') + '> = ' + util.stringify(e.value), 'color:orange');
	    }).addLogListener('call', function (e) {
	      var args = [];
	      var l = e.arguments.length;
	      for (var i = 0; i < l; i++) {
	        var arg = void 0;
	        try {
	          arg = JSON.stringify(e.arguments[i]);
	        } catch (ex) {
	          arg = util.typeOf(e.arguments[i]).id;
	        }
	        args.push(arg + ':' + _typeof(e.arguments[i]));
	      }
	      console.log('%cCALL: ' + e.property.path + ('(' + (args.length ? '<' : '')) + args.join('>, <') + ((args.length ? '>' : '') + ')'), 'color:pink');
	    });
	  }), _defineProperty(_Axial, 'typeOf', function typeOf(value, nativeOnly) {
	    var type = util.typeOf(value, nativeOnly);
	    if (type.constructor === AxialObject) {
	      if (nativeOnly) {
	        return type;
	      }
	      var ifaceNames = this.interfaceIds();
	      var l = ifaceNames.length;
	      for (var i = 0; i < l; i++) {
	        var id = ifaceNames[i];
	        var iface = this.getInterface(id);
	        // gets latest version with same id
	        if (iface.is(value)) {
	          return iface;
	        }
	      }
	    }
	    return type;
	  }), _defineProperty(_Axial, 'debug', function debug() {
	    this.addDefaultLogListeners();
	  }), _Axial);
	
	  // syntax sugar
	  Axial.$ = Axial.getInterface;
	  Axial.$$ = Axial.getInstance;
	
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
	}();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  BLANK_INTERFACE_NAME: 'anonymous',
	  VALID_KEYS: ['_state', '_listeners', 'isWatching', 'super', 'id', 'iface', 'owner', '_lockedPaths'],
	  ARRAY_MEMBERS: ['concat', 'copyWithin', 'entries', 'every', 'fill', 'filter', 'find', 'findIndex', 'forEach', 'includes', 'indexOf', 'join', 'keys', 'lastIndexOf', 'map', 'pop', 'push', 'reduce', 'reduceRight', 'reverse', 'shift', 'slice', 'some', 'sort', 'splice', 'toLocaleString', 'toSource', 'toString', 'unshift', 'values'],
	  ARRAY_MUTATORS: ['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'],
	  ARRAY_MUTATORS_REQUIRE_ARGS_VALIDATED: ['fill', 'push', 'splice', 'unshift']
	};

/***/ }
/******/ ]);
//# sourceMappingURL=axial.js.map