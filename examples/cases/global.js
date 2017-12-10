import { React, ReactDOM, Axial, AxialComponent, createExampleScope } from './common';

export default class Example extends Axial.Component {
  static begin() {
    // set default scope
    Axial.scope = createExampleScope('scope1');
  }
  
  render() {
    return (
      <AxialComponent title="global" source="Axial.scope" expect="scope1">
        <AxialComponent source="inherit" expect="scope1">
          <AxialComponent source="inherit" expect="scope1"></AxialComponent>
        </AxialComponent>
      </AxialComponent>
    );
  }
};