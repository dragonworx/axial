import { React, ReactDOM, Axial, AxialComponent, createExampleScope } from './common';
import {events, tracers, tracersById, tracersByPath, render} from '../../lib/trace';

window.tracers = tracers;
window.events = events;
window.tracersById = tracersById;
window.tracersByPath = tracersByPath;

export default class Example extends Axial.Component {  
  static begin () {
    Axial.scope = createExampleScope('scope1');
    setTimeout(() => {
      // const selected = events.slice(0, 10);
      // events.length = 0;
      // events.push.apply(events, selected);
      render('#trace', 400);
    }, 100);
  }

  render () {
    return (
      <AxialComponent title="simple" source="Axial.scope" expect="scope1"></AxialComponent>
    );
  }
};