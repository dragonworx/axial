import Axis from './axis';
import settings from './settings';

describe('Axis', () => {
  const state = {};
  class AxisA extends Axis {}
  class AxisB extends Axis {}
  AxisB[settings.token] = state;
  const axisA = new AxisA(state);
  const axisB = new AxisB();

  it('should take state from constructor', () => {
    expect(axisA[settings.token]).toBe(state);
  });

  it('should take state from static token property', () => {
    expect(axisB[settings.token]).toBe(state);
  });
});