import { React, ReactDOM, Axial, AxialComponent, createExampleScope } from './common';

export class ScopedByConstructorAxialComponent extends AxialComponent {
    constructor (props) {
      super(props);

      // set via instance setter method in constructor
      this.scope = createExampleScope('scope2');
    }
  };

export default class Example extends Axial.Component {
  static begin() {
    // set default scope
    Axial.scope = createExampleScope('scope1');
  }

  render() {
    return (
      <AxialComponent title="constructor" source="Axial.scope" expect="scope1">
      <ScopedByConstructorAxialComponent source="constructor" expect="scope2">
        {Axial.scope1.clicks % 2 === 0 ? <AxialComponent source="inherit" expect="scope2"></AxialComponent> : null}
        </ScopedByConstructorAxialComponent>
      </AxialComponent>
    );
  }
};