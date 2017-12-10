import { getObjectAtPath, getTypeOfProperty, isObjectLiteral, getObjectKeys, getterSetter } from './util';
import { peek, push, pop, scope_ref, is_scope, as_scope, META_TOKEN } from './state';
import React from 'react';

export const REACT_EVENTS = ['onCopy', 'onCut', 'onPaste', 'onCompositionEnd', 'onCompositionStart', 'onCompositionUpdate', 'onKeyDown', 'onKeyPress', 'onKeyUp', 'onFocus', 'onBlur', 'onChange', 'onInput', 'onInvalid', 'onSubmit', 'onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd', 'onDragEnter', 'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart', 'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseMove', 'onMouseOutnMouseOver', 'onMouseUp', 'onSelect', 'onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart', 'onScroll', 'onWheel', 'onAbort', 'onCanPlay', 'onCanPlayThrough', 'onDurationChange', 'onEmptied', 'onEncrypted', 'onEnded', 'onError', 'onLoadedData', 'onLoadedMetadata', 'onLoadStart', 'onPause', 'onPlay', 'onPlaying', 'onProgress', 'onRateChange', 'onSeeked', 'onSeeking', 'onStalled', 'onSuspend', 'onTimeUpdate', 'onVolumeChange', 'nWaiting', 'onLoad', 'onError', 'onAnimationStart', 'onAnimationEnd', 'onAnimationIteration', 'onTransitionEnd', 'onToggle'];

let STATE_ID = 0;

class AxialComponent extends React.Component {
  constructor (props) {
    super(props);

    // default scope 1/3 from global scope
    let peekScope = peek();
    let scope = peekScope;

    // get scope 2/3 from instance prototype getter
    const scopeByAccessor = this.scope;
    scope = (scopeByAccessor && scope_ref(scopeByAccessor)) || scope;
    
    // get scope 3/3 from prop
    const hasScopeProp = props.hasOwnProperty('scope');
    scope = hasScopeProp ? scope_ref(props.scope) : scope;

    // define scope getter/setter
    getterSetter(this, 'scope', () => scope, newScope => {
      as_scope(scope).unbind(this);

      newScope = scope_ref(newScope);

      // push if different from peek scope
      if (newScope !== peekScope) {
        push(newScope);
      }

      // set current scope
      scope = newScope;

      // copy schema values into this component instance
      const keys = scope[META_TOKEN].keys;
      keys.forEach((key) => {
        getterSetter(this, key, 
          () => scope[key],
          value => scope[key] = value);
      });

      // set default state from scope values
      this.state = {
        id: -1
      };
    });

    if (!scope) {
      throw new Error('AxialComponent requires at least global scope. None found.');
    }

    this.scope = scope;
  }

  componentWillMount () {
    // auto-bind event handlers to this
    REACT_EVENTS.forEach((k) => {
      if (typeof v === 'function') {
        this[k] = v.bind(this);
      }
    });

    as_scope(this.scope).bind(this);
  }

  componentDidMount () {
     // TODO: wrap these in constructor to save subclasses calling super
  }

  componentWillUnmount () {
    if (this.props.hasOwnProperty('scope')) {
      pop();
    }
    as_scope(this.scope).unbind(this);
  }

  update (key, value, oldValue) {
    if (value !== oldValue) {
      this.setState({
        id: STATE_ID++
      });
    }
  }
}

export default AxialComponent;