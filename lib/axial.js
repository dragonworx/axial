import AxialComponent from './component';
import Scope from './scope';
import { peek, push } from './state';

const Axial = {
  Scope: Scope,
  Component: AxialComponent,
  get scope () {
    return peek();
  },
  set scope (scope) {
    push(scope);
  }
};

export default Axial;