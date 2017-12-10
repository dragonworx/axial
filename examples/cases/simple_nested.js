import { React, ReactDOM, Axial, AxialNestedComponent, createNestedExampleScope } from './common';

export default class Example extends Axial.Component {  
  static begin () {
    Axial.scope = window.test = createNestedExampleScope('scope1');
  }

  render () {
    return (
      <AxialNestedComponent title="simple_nested" source="Axial.scope" expect="scope1"></AxialNestedComponent>
    );
  }
};