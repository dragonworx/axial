(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["Axial"] = factory(require("react"));
	else
		root["Axial"] = factory(root["react"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SETTER = exports.GETTER = exports.ACCESSOR = exports.DATA = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.setObjectAtPath = setObjectAtPath;
exports.getObjectAtPath = getObjectAtPath;
exports.getTypeOfProperty = getTypeOfProperty;
exports.isObjectLiteral = isObjectLiteral;
exports.recursiveSetRootContext = recursiveSetRootContext;
exports.getObjectKeys = getObjectKeys;
exports.setter = setter;
exports.getter = getter;
exports.getterSetter = getterSetter;

var _scope = __webpack_require__(1);

var _scope2 = _interopRequireDefault(_scope);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DATA = exports.DATA = 'data';
var ACCESSOR = exports.ACCESSOR = 'accessor';
var GETTER = exports.GETTER = 'getter';
var SETTER = exports.SETTER = 'setter';

function setObjectAtPath(obj, path, value) {
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
}

function getObjectAtPath(obj, path) {
  var shouldThrowIfNotFound = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var steps = path.split('.');
  var l = steps.length;
  var ref = obj;
  var k = null;
  for (var i = 0; i < l; i++) {
    k = steps[i];
    ref = ref[k];
    if (ref === null || typeof ref === 'undefined') {
      if (shouldThrowIfNotFound === true) {
        throw new Error('Object not found at path "' + path + '"');
      }
      return ref;
    }
  }
  return ref;
}

function getTypeOfProperty(object, property) {
  var desc = Object.getOwnPropertyDescriptor(object, property);
  if (typeof desc === 'undefined') {
    desc = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(object), property);
  }
  if (desc.hasOwnProperty('value')) {
    return DATA;
  } else if (typeof desc.get === 'function' && typeof desc.set === 'function') {
    return ACCESSOR;
  }
  return typeof desc.get === 'function' ? GETTER : SETTER;
}

function isObjectLiteral(o) {
  var t = o;
  return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) !== 'object' || o === null ? false : function () {
    while (!false) {
      if (Object.getPrototypeOf(t = Object.getPrototypeOf(t)) === null) {
        break;
      }
    }
    return Object.getPrototypeOf(o) === t;
  }();
}

function recursiveSetRootContext(root) {
  var bind = function bind(prop) {
    return function () {
      return prop.apply(root, arguments);
    };
  };

  var setRootContext = function setRootContext(obj) {
    var keys = getObjectKeys(obj);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var prop = obj[key];
      if (typeof prop === 'function') {
        obj[key] = bind(prop);
      } else if (isObjectLiteral(prop)) {
        setRootContext(prop);
      }
    }
  };

  var keys = getObjectKeys(root);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (isObjectLiteral(root[key])) {
      setRootContext(root[key]);
    }
  }
}

function getObjectKeys(obj) {
  if (obj instanceof _scope2.default) {
    var proto = Object.getPrototypeOf(obj);
    var keys = Object.getOwnPropertyNames(Object.getPrototypeOf(obj)).filter(function (key) {
      return key !== 'constructor';
    });
    keys.push.apply(keys, Object.keys(obj));
    return keys;
  }
  return Object.keys(obj);
}

function setter(obj, key, fn) {
  Object.defineProperty(obj, key, {
    set: fn
  });
}

function getter(obj, key, fn) {
  Object.defineProperty(obj, key, {
    get: fn
  });
}

function getterSetter(obj, key, getterFn, setterFn) {
  Object.defineProperty(obj, key, {
    get: getterFn,
    set: setterFn,
    configurable: true,
    enumerable: true
  });
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScopeMeta = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ScopeMeta = exports.ScopeMeta = function () {
  function ScopeMeta(scope, prototype) {
    var _this = this;

    _classCallCheck(this, ScopeMeta);

    this.scope = scope;
    this.prototype = prototype;

    // track listeners
    var listeners = [];
    this.listeners = listeners;

    // track and expose schema array
    var schema = [];
    this.schema = schema;

    // create getters/setters for schema, bind to component
    var keys = (0, _util.getObjectKeys)(prototype);
    keys.forEach(function (key) {
      var type = (0, _util.getTypeOfProperty)(prototype, key);
      if (type === _util.DATA) {
        (0, _util.getterSetter)(scope, key, function () {
          return prototype[key];
        }, function (value) {
          var oldValue = prototype[key];
          prototype[key] = value;
          _this.updateListeners(key, value, oldValue);
        });
      }
      schema.push(key);
    });
  }

  _createClass(ScopeMeta, [{
    key: 'addListener',
    value: function addListener(listener) {
      this.listeners.push(listener);
    }
  }, {
    key: 'updateListeners',
    value: function updateListeners(key, value, oldValue) {
      console.log('update:', this.scope.name, this.listeners);
      this.listeners.forEach(function (listener) {
        return listener.update(key, value, oldValue);
      });
    }
  }, {
    key: 'hasListener',
    value: function hasListener(listener) {
      return this.listeners.indexOf(listener) > -1;
    }
  }, {
    key: 'removeListener',
    value: function removeListener(listener) {
      var listeners = this.listeners;
      var index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    }
  }]);

  return ScopeMeta;
}();

var Scope = function Scope() {
  var prototype = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, Scope);

  this.$ = new ScopeMeta(this, prototype);

  // init
  var init = this.init;
  if (init && !init.hasInit) {
    init.call(this);
    init.hasInit = true;
  }
};

exports.default = Scope;
;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.scopes = scopes;
exports.peek = peek;
exports.push = push;
exports.asScope = asScope;
exports.pop = pop;

var _util = __webpack_require__(0);

var _scope = __webpack_require__(1);

var _scope2 = _interopRequireDefault(_scope);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _scopes = [];

function scopes() {
  return _scopes.slice();
}

function peek() {
  return _scopes[_scopes.length - 1];
}

function push(scope) {
  _scopes.push(asScope(scope));
}

function asScope(scope) {
  if (scope instanceof _scope2.default) {
    // return instance
    return scope;
  } else if ((0, _util.isObjectLiteral)(scope)) {
    // check if any scope instances exist with those values, if so return them
    var l = _scopes.length;
    for (var i = 0; i < l; i++) {
      var scope_i = _scopes[i];
      if (scope_i.prototype === scope) {
        return scope_i;
      }
    }
    // otherwise return a new instance
    return new _scope2.default(scope);
  }
}

function pop() {
  return _scopes.pop();
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _component = __webpack_require__(4);

var _component2 = _interopRequireDefault(_component);

var _scope = __webpack_require__(1);

var _scope2 = _interopRequireDefault(_scope);

var _state = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Axial = {
  Scope: _scope2.default,
  Component: _component2.default,
  get scope() {
    return (0, _state.peek)();
  },
  set scope(scope) {
    (0, _state.push)(scope);
  }
};

exports.default = Axial;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.REACT_EVENTS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = __webpack_require__(0);

var _state = __webpack_require__(2);

var _react = __webpack_require__(5);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var REACT_EVENTS = exports.REACT_EVENTS = ['onCopy', 'onCut', 'onPaste', 'onCompositionEnd', 'onCompositionStart', 'onCompositionUpdate', 'onKeyDown', 'onKeyPress', 'onKeyUp', 'onFocus', 'onBlur', 'onChange', 'onInput', 'onInvalid', 'onSubmit', 'onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseOutnMouseOver', 'onMouseUp', 'onSelect', 'onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart', 'onScroll', 'onWheel', 'onAbort', 'onCanPlay', 'onCanPlayThrough', 'onDurationChange', 'onEmptied', 'onEncrypted', 'onEnded', 'onError', 'onLoadedData', 'onLoadedMetadata', 'onLoadStart', 'onPause', 'onPlay', 'onPlaying', 'onProgress', 'onRateChange', 'onSeeked', 'onSeeking', 'onStalled', 'onSuspend', 'onTimeUpdate', 'onVolumeChange', 'nWaiting', 'onLoad', 'onError', 'onAnimationStart', 'onAnimationEnd', 'onAnimationIteration', 'onTransitionEnd', 'onToggle'];

var STATE_ID = 0;

var AxialComponent = function (_React$Component) {
  _inherits(AxialComponent, _React$Component);

  function AxialComponent(props) {
    _classCallCheck(this, AxialComponent);

    // default scope if global scope
    var _this = _possibleConstructorReturn(this, (AxialComponent.__proto__ || Object.getPrototypeOf(AxialComponent)).call(this, props));

    var peekScope = (0, _state.peek)();
    var scope = peekScope;

    // override with prop if given
    var defaultScope = _this.scope;
    var hasScopeProp = props.hasOwnProperty('scope');
    if (defaultScope) {
      scope = (0, _state.asScope)(defaultScope);
    } else if (hasScopeProp) {
      scope = (0, _state.asScope)(props.scope);
    }

    // define scope getter/setter
    (0, _util.getterSetter)(_this, 'scope', function () {
      return scope;
    }, function (newScope) {
      newScope = (0, _state.asScope)(newScope);

      // push if different from peek scope
      if (newScope !== peekScope) {
        (0, _state.push)(newScope);
      }

      // clear old schema
      if (scope) {
        var _schema = scope.$.schema;
        _schema.forEach(function (key) {
          delete _this[key];
        });
      }

      // set current scope
      scope = newScope;

      // copy schema values into this component instance
      var schema = scope.$.schema;
      schema.forEach(function (key) {
        (0, _util.getterSetter)(_this, key, function () {
          return scope[key];
        }, function (value) {
          return scope[key] = value;
        });
      });

      // set default state from scope values
      _this.state = {
        id: STATE_ID++
      };
    });

    _this.scope = scope;
    return _this;
  }

  _createClass(AxialComponent, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      // TODO: wrap these in constructor to save subclasses calling super
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      // auto-bind event handlers to this
      REACT_EVENTS.forEach(function (k) {
        if (typeof v === 'function') {
          _this2[k] = v.bind(_this2);
        }
      });

      this.scope.$.addListener(this);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.hasOwnProperty('scope')) {
        (0, _state.pop)();
      }
      this.scope.$.removeListener(this);
    }
  }, {
    key: 'update',
    value: function update(key, value, oldValue) {
      if (value !== oldValue) {
        this.setState({
          id: STATE_ID++
        });
      }
    }
  }, {
    key: 'ref',
    value: function ref(key) {
      var _this3 = this;

      return function (el) {
        return _this3[key] = el;
      };
    }
  }]);

  return AxialComponent;
}(_react2.default.Component);

exports.default = AxialComponent;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=axial.js.map