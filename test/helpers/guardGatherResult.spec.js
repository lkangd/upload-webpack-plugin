import guardGatherResult from '../../src/helpers/guardGatherResult';

describe('helpers:clean', () => {
  const assets = {
    foo: '_foo',
    bar: '_bar',
  };
  test('should return a empty object when the uploadedUrls is not a plain object', () => {
    expect(guardGatherResult(assets, [])).toEqual({});
    expect(guardGatherResult(assets, true)).toEqual({});
    expect(guardGatherResult(assets, 'foo')).toEqual({});
  });
  test('should not accept props that are not in "assets"', () => {
    expect(guardGatherResult(assets, { foo: '_foo_', bar: '_bar_', baz: '_baz_' })).toEqual({ foo: '_foo_', bar: '_bar_' });
  });
  test('should not accept props that are not "String"', () => {
    expect(guardGatherResult(assets, { foo: '_foo_', bar: { bar: '_bar_' } })).toEqual({ foo: '_foo_' });
  });
});
