import { React, ReactDOM, Axial, AxialNestedComponent, AxialComponent, createNestedExampleScope } from './common';

export default class Example extends Axial.Component {
  static begin () {
    // set default scope
    Axial.scope = createNestedExampleScope('scope1');
  }
  
  render () {
    return (
      <AxialNestedComponent title="nested" source="Axial.scope" expect="scope1">
        <AxialComponent source="inherit" expect="scope1">
          <AxialComponent scope={Axial.scope.foo} source="props" expect="foo"></AxialComponent>
        </AxialComponent>
      </AxialNestedComponent>
    );
  }
};