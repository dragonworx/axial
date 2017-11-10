import { getObjectAtPath } from './util';
import Axial from './axial';
import React from 'react';
import Enzyme, { shallow, mount, render } from 'enzyme';
import AxialComponent from './component';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('Component', () => {
  it('should bind to axis', () => {
    
  });
  // it('should bind to axis', () => {
    // expect(render(<AxialComponent />).text()).toBe('Axial');
  // });
});