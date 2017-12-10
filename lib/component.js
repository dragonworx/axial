import { getObjectAtPath, getTypeOfProperty, isObjectLiteral, getObjectKeys, getterSetter } from './util';
import { peek, push, pop, asScope } from './state';
import React from 'react';

export const REACT_EVENTS = ['onCopy', 'onCut', 'onPaste', 'onCompositionEnd', 'onCompositionStart', 'onCompositionUpdate', 'onKeyDown', 'onKeyPress', 'onKeyUp', 'onFocus', 'onBlur', 'onChange', 'onInput', 'onInvalid', 'onSubmit', 'onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseOutnMouseOver', 'onMouseUp', 'onSelect', 'onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart', 'onScroll', 'onWheel', 'onAbort', 'onCanPlay', 'onCanPlayThrough', 'onDurationChange', 'onEmptied', 'onEncrypted', 'onEnded', 'onError', 'onLoadedData', 'onLoadedMetadata', 'onLoadStart', 'onPause', 'onPlay', 'onPlaying', 'onProgress', 'onRateChange', 'onSeeked', 'onSeeking', 'onStalled', 'onSuspend', 'onTimeUpdate', 'onVolumeChange', 'nWaiting', 'onLoad', 'onError', 'onAnimationStart', 'onAnimationEnd', 'onAnimationIteration', 'onTransitionEnd', 'onToggle'];

let STATE_ID = 0;

class AxialComponent extends React.Component {
  constructor(props) {
    super(props);

    // default scope if global scope
    let peekScope = peek();
    let scope = peekScope;

    // override with prop if given
    const defaultScope = this.scope;
    const hasScopeProp = props.hasOwnProperty('scope');
    if (defaultScope) {
      scope = asScope(defaultScope);
    } else if (hasScopeProp) {
      scope = asScope(props.scope);
    }

    // define scope getter/setter
    getterSetter(this, 'scope', () => scope, newScope => {
      newScope = asScope(newScope);

      // push if different from peek scope
      if (newScope !== peekScope) {
        push(newScope);
      }

      // clear old schema
      if (scope) {
        const schema = scope.$.schema;
        schema.forEach((key) => {
          delete this[key];
        });
      }

      // set current scope
      scope = newScope;

      // copy schema values into this component instance
      const schema = scope.$.schema;
      schema.forEach((key) => {
        getterSetter(this, key, () => scope[key], value => scope[key] = value);
      });

      // set default state from scope values
      this.state = {
        id: STATE_ID++
      };
    });

    this.scope = scope;
  }

  componentWillMount() {
    // TODO: wrap these in constructor to save subclasses calling super
  }

  componentDidMount() {
    // auto-bind event handlers to this
    REACT_EVENTS.forEach((k) => {
      if (typeof v === 'function') {
        this[k] = v.bind(this);
      }
    });

    this.scope.$.addListener(this);
  }

  componentWillUnmount() {
    if (this.props.hasOwnProperty('scope')) {
      pop();
    }
    this.scope.$.removeListener(this);
  }

  update(key, value, oldValue) {
    if (value !== oldValue) {
      this.setState({
        id: STATE_ID++
      });
    }
  }

  ref(key) {
    return el => {
      return this[key] = el;
    }
  }
}

export default AxialComponent;