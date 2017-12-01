import { getObjectAtPath } from './util';
import Axial from './axial';
import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import AxialComponent from './component';
import Adapter from 'enzyme-adapter-react-16';
import settings from './settings';

Enzyme.configure({ adapter: new Adapter() });

describe('Component', () => {
  describe('Initialisation', () => {
    const axis = Axial.axis = {
      func () {}
    };
    const state = {
      foo: 1
    };
    axis[settings.token] = state;
    class A extends Axial.Component {}
    const inst = new A();
  
    it('should subscribe to axis when constructed', () => {
      expect(inst.__axis).toBe(axis);
      expect(inst.axis).toBe(axis);
    });
  
    it('should merge axis state with self', () => {
      expect(inst[settings.token]).toBe(state);
    });
  
    it('should merge axis properties with self', () => {
      expect(inst.func).toBe(axis.func);
    });
  });

  // it('should bind to axis', () => {
    // expect(render(<AxialComponent />).text()).toBe('Axial');
  // });

  describe('State changes', () => {
    it()
  });
});