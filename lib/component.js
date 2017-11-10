import { getObjectAtPath, getTypeOfProperty, isObjectLiteral, getObjectKeys } from './util';
import { peek, push, pop } from './state';
import Axis from './axis';
import React from 'react';
import settings from './settings';

const REACT_EVENTS = ['onCopy', 'onCut', 'onPaste', 'onCompositionEnd', 'onCompositionStart', 'onCompositionUpdate', 'onKeyDown', 'onKeyPress', 'onKeyUp', 'onFocus', 'onBlur', 'onChange', 'onInput', 'onInvalid', 'onSubmit', 'onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseOutnMouseOver', 'onMouseUp', 'onSelect', 'onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart', 'onScroll', 'onWheel', 'onAbort', 'onCanPlay', 'onCanPlayThrough', 'onDurationChange', 'onEmptied', 'onEncrypted', 'onEnded', 'onError', 'onLoadedData', 'onLoadedMetadata', 'onLoadStart', 'onPause', 'onPlay', 'onPlaying', 'onProgress', 'onRateChange', 'onSeeked', 'onSeeking', 'onStalled', 'onSuspend', 'onTimeUpdate', 'onVolumeChange', 'nWaiting', 'onLoad', 'onError', 'onAnimationStart', 'onAnimationEnd', 'onAnimationIteration', 'onTransitionEnd', 'onToggle'];

class AxialComponent extends React.Component {
  constructor (props) {
    super(props);

    let axis = peek();

    if (!axis) {
      throw new Error('No axis available for AxialComponent. Create global, pass by props, or in component constructor.');
    }

    // override current global axis if props one given
    this._shouldPopAxis = false;
    if (props.hasOwnProperty('axis')) {
      axis = props.axis;
      this._shouldPopAxis = true;
    }

    // wrap life-cycle methods to auto-register component as subscriber to axis
    const noop = () => {};
    const componentWillMount = typeof this.componentWillMount === 'function' ? this.componentWillMount : noop;
    const componentDidMount = typeof this.componentDidMount === 'function' ? this.componentDidMount : noop;
    const componentWillUnmount = typeof this.componentWillUnmount === 'function' ? this.componentWillUnmount : noop;
    const render = typeof this.render === 'function' ? this.render : noop;

    this.componentWillMount = () => {
      this.__axis.__axial.addSubscriber(this);
      return componentWillMount.apply(this, arguments);
    };

    this.componentDidMount = () => {
      return componentDidMount.apply(this, arguments);
    };

    this.componentWillUnmount = () => {
      if (this._shouldPopAxis) {
        this._shouldPopAxis = false;
        pop();
      }
      this.__axis.__axial.removeSubscriber(this);
      return componentWillUnmount.apply(this, arguments);
    };

    this.render = () => {
      return render.call(this, axis[settings.token]);
    };

    // auto-bind event handlers to this
    for (let i = 0; i < REACT_EVENTS.length; i++) {
      const k = REACT_EVENTS[i];
      const v = this[k];
      if (typeof v === 'function') {
        this[k] = v.bind(this);
      }
    }

    Object.defineProperty(this, settings.token, {
      get () {
        return this.__axis[settings.token];
      },

      set (state) {
        // TODO: required? when?
        this.__axis[settings.token] = state;
      }
    });

    this.axis = axis;
  }

  set axis (axis) {
    this._shouldPopAxis = true;

    if (this.__axis) {
      const keys = getObjectKeys(this.__axis);
      const l = keys.length;
      // clean up previous bindings
      for (let i = 0; i < l; i++) {
        delete this[keys[i]];
      }
    }

    // copy axis methods
    const keys = getObjectKeys(axis);
    const l = keys.length;
    for (let i = 0; i < l; i++) {
      const key = keys[i];

      if (this.hasOwnProperty(key)) {
        console.warn(`AxialComponent [${this.constructor.name}] overrides property "${key}" with axis property of same name`);
      }

      // merge any property except [settings.token] inline with component (special accessors are used for [settings.token])
      if (key !== settings.token) {
        const propType = getTypeOfProperty(axis, key);
        if (propType === 'getter') {
          Object.defineProperty(this, key, {
            get() {
              return axis[key];
            }
          });
        } else if (propType === 'setter') {
          Object.defineProperty(this, key, {
            set(value) {
              axis[key] = value;
            }
          });
        } else if (propType === 'accessor') {
          Object.defineProperty(this, key, {
            get() {
              return axis[key];
            },
            set(value) {
              axis[key] = value;
            }
          });
        } else if (propType === 'data') {
          this[key] = axis[key];
        }
      }
    }

    this.__axis = push(axis);
  }

  ref (key) {
    return el => {
      return this[key] = el;
    }
  }

  set (a, b) {
    this.__axis.set.apply(null, arguments);
  }

  has (path, defaultValue = true) {
    let value = getObjectAtPath(this[settings.token], path);
    if (Array.isArray(value)) {
      value = value.length;
    }
    return !!value ? defaultValue : null;
  }

  render () {
    return <div>Axial</div>;
  }
}

export default AxialComponent;