import settings from './settings';

class Axis {
  constructor (state) {
    // try take state from static class property
    if (this.constructor[settings.token]) {
      this[settings.token] = this.constructor[settings.token];
    }

    // or/and try take state from constructor
    if (state) {
      this[settings.token] = state;
    }
  }
}

export default Axis;