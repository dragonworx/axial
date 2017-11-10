import { setObjectAtPath, recursiveSetRootContext } from './util';
import settings from './settings';

const _stack = [];

export function stack () {
  return _stack.slice();
}

export function peek () {
  return _stack[_stack.length - 1];
}

export function push (axis) {
  _stack.push(axis);
  init(axis);
  return axis;
}

export function pop () {
  return _stack.pop();
}

export function init (axis) {
  // don't re-initialise already initialised axis
  if (axis.hasOwnProperty('__axial')) {
    return axis;
  }

  const subscribers = [];   // all components listening for state changes
  const listeners = [];     // all functions to receive logging as state changes

  const meta = {}
  axis.__axial = meta;

  if (!axis.hasOwnProperty(settings.token)) {
    axis[settings.token] = {};
  }

  // recursively set the *this* context of all deep function properties to the axis, to reduce dot-syntax usage
  recursiveSetRootContext(axis);

  meta.addSubscriber = function (subscriber) {
    subscribers.push(subscriber);
  };

  meta.isSubscribing = function (subscriber) {
    return subscribers.indexOf(subscriber) > -1;
  };

  meta.removeSubscriber = function (subscriber) {
    const index = subscribers.indexOf(subscriber);
    subscribers.splice(index, 1);
  };

  meta.addListener = function (fn) {
    listeners.push(fn);
  };

  meta.removeListener = function (fn) {
    const index = listeners.indexOf(fn);
    listeners.splice(index, 1);
  };

  function log (event) {
    for (let i = 0; i < listeners.length; i++) {
      listeners[i].call(axis, event);
    }
  };

  // add the set() method to the axis
  axis.set = function (a, b) {
    const state = axis[settings.token];

    if (typeof a === 'object' && !Array.isArray(a) && a !== null) {
      // merge partial state with current state
      const partialState = a;
      for (let key in partialState) {
        state[key] = partialState[key];
      }
      log({ axis: axis, type: 'partial', value: a, state: state });
    } else if (typeof a === 'string') {
      // key value, set object at path
      setObjectAtPath(state, a, b);
      log({ axis: axis, type: 'keyval', key: a, value: b, state: state });
    } else if (typeof a === 'function') {
      // invoke function, pass state as first arg followed by any remaining passed args
      const args = Array.isArray(b) ? b : [];
      args.splice(0, 0, state);
      a.apply(state, args);
      log({ axis: axis, type: 'function', value: a, state: state });
    }

    // set state on all subscribers
    for (let i = 0; i < subscribers.length; i++) {
      subscribers[i].setState(state);
    }

    return axis;
  };

  if (typeof axis.init === 'function') {
    axis.init();
  }

  return axis;
}