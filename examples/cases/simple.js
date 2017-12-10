import { React, ReactDOM, Axial, AxialComponent, createExampleScope } from './common';

export default class Example extends Axial.Component {  
  static begin () {
    Axial.scope = createExampleScope('scope1');
  }

  render () {
    return (
      <AxialComponent title="simple" source="Axial.scope" expect="scope1"></AxialComponent>
    );
  }
};