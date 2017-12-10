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

var _state = __webpack_require__(2);

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
    (0, _state.scope_ref)(obj);
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
  // if (is_scope(obj)) {
  //   const proto = Object.getPrototypeOf(obj);
  //   const keys = Object.getOwnPropertyNames(proto)
  //     .filter(key => key !== 'constructor');
  //   keys.push.apply(keys, Object.keys(obj));
  //   return keys;
  // }
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
exports.Scope = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = __webpack_require__(0);

var _state = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scope = exports.Scope = function () {
  function Scope(ref) {
    var _this = this;

    _classCallCheck(this, Scope);

    // take the ref object and convert to scope
    var keys = (0, _util.getObjectKeys)(ref);

    // ensure any functions within nested objects have a scope of the top level ref object
    //  - this means that everything in the scope has access to the entire scope, but no higher.
    (0, _util.recursiveSetRootContext)(ref);

    (0, _util.getter)(ref, _state.META_TOKEN, function () {
      return _this;
    });
    this.ref = ref;

    // track listeners
    var listeners = [];
    this.listeners = listeners;

    // move values to internal map, create getters/setters for schema, re-bind to component
    var values = {};
    keys.forEach(function (key) {
      var value = ref[key];
      var type = (0, _util.getTypeOfProperty)(ref, key);
      var type_of = typeof value === 'undefined' ? 'undefined' : _typeof(value);
      if (type_of !== 'function' && type === _util.DATA) {
        // check if array
        if (Array.isArray(value)) {
          var l = value.length;
          for (var i = 0; i < l; i++) {
            value[i] = (0, _state.scope_ref)(value[i]);
          }
        }

        // move value into internal map
        values[key] = value;

        // create getter and setter which updates listeners
        (0, _util.getterSetter)(ref, key, function () {
          return values[key];
        }, function (newValue) {
          var oldValue = values[key];
          values[key] = newValue;
          _this.update(key, newValue, oldValue);
        });
      }
    });

    this.keys = keys;
  }

  _createClass(Scope, [{
    key: 'bind',
    value: function bind(listener) {
      var _this2 = this;

      // add listeners to this scope
      var listeners = this.listeners;
      listeners.push(listener);

      // go through properties looking for Scopes, bind to them
      this.keys.forEach(function (k) {
        var value = _this2.ref[k];
        if ((0, _state.is_scope)(value)) {
          value[_state.META_TOKEN].bind(listener);
        }
      });

      console.log({ 'type': 'bind', 'ref': this.ref.name, 'listener': listener, 'listeners': listeners });
    }
  }, {
    key: 'update',
    value: function update(key, value, oldValue) {
      var _this3 = this;

      // assumes listeners implement .update(key, value, oldValue)
      var listeners = this.listeners;
      console.group('update[' + this.listeners.length + '] key:"' + key + ' value:"' + value + '" oldValue:"' + oldValue + '"');
      listeners.forEach(function (listener) {
        console.log({ 'listener:': listener });
        listener.update(key, value, oldValue, _this3.ref);
      });
      console.groupEnd();
    }
  }, {
    key: 'hasBinding',
    value: function hasBinding(listener) {
      return this.listeners.indexOf(listener) > -1;
    }
  }, {
    key: 'unbind',
    value: function unbind(listener) {
      var listeners = this.listeners;
      var index = listeners.indexOf(listener);
      if (index === -1) {
        // handle case when not-bound
        return;
      }
      listeners.splice(index, 1);
      console.log({ 'type': 'unbind', 'ref': this.ref.name, 'listener': listener, 'listeners': listeners });
    }
  }]);

  return Scope;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.META_TOKEN = undefined;
exports.scopes = scopes;
exports.peek = peek;
exports.push = push;
exports.is_scope = is_scope;
exports.scope_ref = scope_ref;
exports.as_scope = as_scope;
exports.pop = pop;

var _util = __webpack_require__(0);

var _scope = __webpack_require__(1);

var _scopes = [];

var META_TOKEN = exports.META_TOKEN = '__scope__';

function scopes() {
  return _scopes.slice();
}

function peek() {
  return _scopes[_scopes.length - 1];
}

function push(scope) {
  scope = scope_ref(scope);
  _scopes.push(scope);
  return scope;
}

function is_scope(ref) {
  if (ref instanceof _scope.Scope) {
    return ref;
  }
  var prop = ref[META_TOKEN];
  return prop && prop instanceof _scope.Scope;
}

function scope_ref(scope) {
  if (is_scope(scope)) {
    return scope;
  }

  if ((0, _util.isObjectLiteral)(scope)) {
    new _scope.Scope(scope);
  }

  return scope;
}

function as_scope(scope) {
  if (scope[META_TOKEN]) {
    return scope[META_TOKEN];
  }
  return scope_ref(scope)[META_TOKEN];
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
    scope = (0, _state.scope_ref)(scope);
    (0, _state.push)(scope);
    return scope;
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

    // default scope 1/3 from global scope
    var _this = _possibleConstructorReturn(this, (AxialComponent.__proto__ || Object.getPrototypeOf(AxialComponent)).call(this, props));

    var peekScope = (0, _state.peek)();
    var scope = peekScope;

    // get scope 2/3 from instance prototype getter
    var scopeByAccessor = _this.scope;
    scope = scopeByAccessor && (0, _state.scope_ref)(scopeByAccessor) || scope;

    // get scope 3/3 from prop
    var hasScopeProp = props.hasOwnProperty('scope');
    scope = hasScopeProp ? (0, _state.scope_ref)(props.scope) : scope;

    // define scope getter/setter
    (0, _util.getterSetter)(_this, 'scope', function () {
      return scope;
    }, function (newScope) {
      (0, _state.as_scope)(scope).unbind(_this);

      newScope = (0, _state.scope_ref)(newScope);

      // push if different from peek scope
      if (newScope !== peekScope) {
        (0, _state.push)(newScope);
      }

      // set current scope
      scope = newScope;

      // copy schema values into this component instance
      var keys = scope[_state.META_TOKEN].keys;
      keys.forEach(function (key) {
        (0, _util.getterSetter)(_this, key, function () {
          return scope[key];
        }, function (value) {
          return scope[key] = value;
        });
      });

      // set default state from scope values
      _this.state = {
        id: -1
      };
    });

    if (!scope) {
      throw new Error('AxialComponent requires at least global scope. None found.');
    }

    _this.scope = scope;
    return _this;
  }

  _createClass(AxialComponent, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      // auto-bind event handlers to this
      REACT_EVENTS.forEach(function (k) {
        if (typeof v === 'function') {
          _this2[k] = v.bind(_this2);
        }
      });

      (0, _state.as_scope)(this.scope).bind(this);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      // TODO: wrap these in constructor to save subclasses calling super
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.props.hasOwnProperty('scope')) {
        (0, _state.pop)();
      }
      (0, _state.as_scope)(this.scope).unbind(this);
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