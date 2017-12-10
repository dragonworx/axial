import { React, ReactDOM, Axial, AxialComponent, createExampleScope } from './common';

export default class Example extends Axial.Component {
  static begin() {
    // set default scope
    Axial.scope = createExampleScope('scope1');
  }

  render() {
    return (
      <AxialComponent title="props" source="Axial.scope" expect="scope1">
        <AxialComponent scope={createExampleScope('scope2')} source="getter" expect="scope2">
          {Axial.scope1.clicks % 2 === 0 ? <AxialComponent source="inherit" expect="scope2"></AxialComponent> : null}
        </AxialComponent>
      </AxialComponent>
    );
  }
};