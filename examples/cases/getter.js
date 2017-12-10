import { React, ReactDOM, Axial, AxialComponent, createExampleScope } from './common';

export class ScopedByGetterAxialComponent extends AxialComponent {
  get scope () {
    // set scope via instance method getter
    return createExampleScope('scope2');
  }
};

export default class Example extends Axial.Component {
  static begin() {
    // set default scope
    Axial.scope = createExampleScope('scope1');
  }

  render() {
    return (
      <AxialComponent title="getter" source="Axial.scope" expect="scope1">
        <ScopedByGetterAxialComponent source="getter" expect="scope2">
          {Axial.scope1.clicks % 2 === 0 ? <AxialComponent source="inherit" expect="scope2"></AxialComponent> : null}
        </ScopedByGetterAxialComponent>
      </AxialComponent>
    );
  }
};