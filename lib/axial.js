import AxialComponent from './component';
import Scope from './scope';
import { peek, push, scope_ref } from './state';

const Axial = {
  Scope: Scope,
  Component: AxialComponent,
  get scope () {
    return peek();
  },
  set scope (scope) {
    scope = scope_ref(scope);
    push(scope);
    return scope;
  }
};

export default Axial;