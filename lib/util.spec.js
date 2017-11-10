import { 
  getObjectAtPath,
  setObjectAtPath,
  getTypeOfProperty,
  isObjectLiteral,
  recursiveSetRootContext,
  getObjectKeys
} from './util';
import Axis from './axis';
import { init } from './state';

describe('Util', () => {
  describe('getObjectAtPath', () => {
    const innerObject = {
      z: 2
    };
    const obj = {
      x: 1,
      y: innerObject
    };

    it('should return value for shallow depth key', () => {
      expect(getObjectAtPath(obj, 'x')).toBe(1);
    });

    it('should return value for deep depth key', () => {
      expect(getObjectAtPath(obj, 'y')).toBe(innerObject);
    });

    it('should return value for deep depth key value', () => {
      expect(getObjectAtPath(obj, 'y.z')).toBe(innerObject.z);
    });

    it('should return undefined for invalid paths', () => {
      expect(getObjectAtPath(obj, 'w')).toBe(undefined);
    });

    it('should throw error for invalid paths when invoked with option', () => {
      expect(() => getObjectAtPath(obj, 'w', true)).toThrow();
    });
  });

  describe('setObjectAtPath', () => {
    const obj = {};

    it('should set shallow depth key', () => {
      setObjectAtPath(obj, 'x', 1);
      expect(obj.x).toBe(1);
    });

    it('should set deep depth key with lazy initialisation of objects', () => {
      setObjectAtPath(obj, 'w.y.z', 2);
      expect(obj.w.y.z).toBe(2);
    });
  });

  describe('getTypeOfProperty', () => {
    const obj = {
      get getter () {},
      set setter (val) {},
      data: 1,
      func () {}
    };
    
    it('should identify getter properties', () => {
      expect(getTypeOfProperty(obj, 'getter')).toBe('getter');
    });

    it('should identify setter properties', () => {
      expect(getTypeOfProperty(obj, 'setter')).toBe('setter');
    });

    it('should identify data properties', () => {
      expect(getTypeOfProperty(obj, 'data')).toBe('data');
      expect(getTypeOfProperty(obj, 'func')).toBe('data');
    });
  });

  describe('isObjectLiteral', () => {
    it('should identify object literals', () => {
      expect(isObjectLiteral({})).toBe(true);
    });

    it('should not identify non-object literals', () => {
      class A {};
      expect(isObjectLiteral(null)).toBe(false);
      expect(isObjectLiteral([])).toBe(false);
      expect(isObjectLiteral(new RegExp())).toBe(false);
      expect(isObjectLiteral(new Date())).toBe(false);
      expect(isObjectLiteral(new A())).toBe(false);
      expect(isObjectLiteral(Object)).toBe(false);
    });
  });

  describe('recursiveSetRootContext', () => {
    const obj = {
      x: 1,
      func1 () {
        return this.x;
      },
      y: {
        func2 () {
          return this.x;
        },
        z: {
          func3 () {
            return this.x;
          }
        }
      }
    };

    it('should set root context for each function at any depth', () => {
      expect(obj.func1()).toBe(obj.x);
      expect(obj.y.func2()).toBe(undefined);
      expect(obj.y.z.func3()).toBe(undefined);

      recursiveSetRootContext(obj);
      
      expect(obj.func1()).toBe(obj.x);
      expect(obj.y.func2()).toBe(obj.x);
      expect(obj.y.z.func3()).toBe(obj.x);
    });
  });

  describe('getObjectKeys', () => {
    it('should return keys for object literals', () => {
      expect(getObjectKeys({x:1, y:2})).toEqual(['x', 'y']);
    });

    it('should return keys for class instance properties', () => {
      class A {
        constructor () {
          this.x = 1;
        }
        y () {}
        z () {}
      };
      expect(getObjectKeys(new A())).toEqual(['x']);
    });

    it('should return keys for Axis instances', () => {
      class A extends Axis {
        constructor () {
          super();
          this.x = 1;
        }
      };
      A.$ = {y:2};
      const inst = new A();
      init(inst);
      expect(inst.$.y).toBe(2);
      expect(getObjectKeys(inst)).toEqual(['x']);
    });
  });
});