import { stack, peek, push, pop, init } from './state';
import settings from './settings';

describe('State', () => {
  describe('Axis initialisation', () => {
    const axis = {
      init: jest.fn()
    };

    it('should attach meta api to given axis', () => {
      push(axis);
      expect(axis).toHaveProperty('__axial');
      expect(axis.__axial).toHaveProperty('addSubscriber');  
      expect(axis.__axial).toHaveProperty('removeSubscriber');  
      expect(axis.__axial).toHaveProperty('addListener');  
      expect(axis.__axial).toHaveProperty('removeListener');  
    });

    it('should attach a state property to given axis if not there by default', () => {
      expect(axis).toHaveProperty(settings.token);
    });

    it('should add set method to axis', () => {
      expect(typeof axis.set).toBe('function');
    });

    it('should call init() if found in axis', () => {
      expect(axis.init).toHaveBeenCalledTimes(1);
    });

    it('should not initialise an already initialised axis', () => {
      axis.__axial.foo = 'bar';
      init(axis);
      expect(axis.__axial.foo).toBe('bar');
      expect(axis.init).toHaveBeenCalledTimes(1);
    });

    it('should add axis to stack', () => {
      expect(stack()).toHaveLength(1);
      expect(peek()).toBe(axis);
    });
  });

  describe('Subscribing to state changes', () => {
    const axis = init({});
    const comp = {
      setState: jest.fn()
    };

    axis.__axial.addSubscriber(comp);

    it('should call setState() on all subscribers when set() called on axis', () => {
      expect(comp.setState).toHaveBeenCalledTimes(0);
      axis.set({});
      expect(comp.setState).toHaveBeenCalledTimes(1);
    });

    it('should return true for isSubscribing', () => {
      expect(axis.__axial.isSubscribing(comp)).toBe(true);
    });

    it('should remove subscriber', () => {
      axis.__axial.removeSubscriber(comp);
      axis.set({});
      expect(comp.setState).toHaveBeenCalledTimes(1);
      expect(axis.__axial.isSubscribing(comp)).toBe(false);
    });
  });

  describe('Logging state changes', () => {
    const axis = init({});
    const listener = jest.fn();

    it('should call listener when axis.set() is called', () => {
      axis.__axial.addListener(listener);
      axis.set({});
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});