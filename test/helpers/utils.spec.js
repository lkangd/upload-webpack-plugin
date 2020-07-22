import { isString, isPlainObject, isArray, isRegExp, isOwnProperty, isEmptyObject, getEmptyMap } from '../../src/helpers/utils';

describe('helpers:utils', () => {
  describe('isXX', () => {
    test('should validate String', () => {
      expect(isString('')).toBeTruthy();
      expect(isString('filename.ext')).toBeTruthy();
      expect(isString(false)).toBeFalsy();
      // eslint-disable-next-line no-undefined
      expect(isString(undefined)).toBeFalsy();
    });
    test('should validate PlainObject', () => {
      expect(isPlainObject({})).toBeTruthy();
      expect(isPlainObject([])).toBeFalsy();
    });
    test('should validate Array', () => {
      expect(isArray([])).toBeTruthy();
      expect(isArray({})).toBeFalsy();
    });
    test('should validate RegExp', () => {
      expect(isRegExp(/test/)).toBeTruthy();
      expect(isRegExp({})).toBeFalsy();
    });
    test('should validate OwnProperty', () => {
      const foo = { foo: 'foo' };
      const bar = Object.create(foo);
      bar.bar = 'bar';
      expect(isOwnProperty(bar, 'bar')).toBeTruthy();
      expect(isOwnProperty(bar, 'foo')).toBeFalsy();
    });
    test('should validate EmptyObject', () => {
      const foo = {};
      const bar = { bar: 'bar' };
      const baz = Object.create({ baz: 'baz' });
      expect(isEmptyObject(foo)).toBeTruthy();
      expect(isEmptyObject(baz)).toBeTruthy();
      expect(isEmptyObject(bar)).toBeFalsy();
      expect(isEmptyObject('')).toBeFalsy();
    });
  });
  describe('getEmptyMap', () => {
    test('should return empty map', () => {
      const foo = getEmptyMap();
      expect(foo).toEqual({});
    });
  });
});
