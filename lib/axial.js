import AxialComponent from './component';
import Axis from './axis';
import { peek, push } from './state';
import settings from './settings';

const Axial = {
  Axis: Axis,
  Component: AxialComponent,
  set () {
    const axis = peek();
    axis.set.apply(axis, arguments);
    return axis;
  },
  get peek () {
    return peek();
  },
  get stateToken () {
    return settings.token;
  },
  set stateToken (token) {
    settings.token = token;
  }
};

// read-only accessor to current global axis
Object.defineProperty(Axial, 'axis', {
  get () {
    return peek();
  },
  set (axis) {
    push(axis);
  }
});

export default Axial;