import clean from '../../src/helpers/clean';

describe('helpers:clean', () => {
  const getCompilation = () => ({
    assets: {
      foo: '_foo',
      bar: '_bar',
      baz: '_baz',
    },
  });
  test('should do nothing when the "options" is not a "array"', () => {
    const compilation = getCompilation();
    clean({}, compilation, 'foo');
    expect(compilation).toEqual(getCompilation());
  });
  test('should do nothing when the "options" is equal "false"', () => {
    const compilation = getCompilation();
    const result = clean(false, compilation, 'foo');
    // eslint-disable-next-line no-undefined
    expect(result).toBe(undefined);
    expect(compilation).toEqual(getCompilation());
  });
  test('should delete file when the "options" is equal "true"', () => {
    const compilation = getCompilation();
    clean(true, compilation, 'foo');
    clean(true, compilation, 'bar');
    expect(compilation).toEqual({ assets: { baz: '_baz' } });
  });
  test('should delete file when the filename is equal to the string in "options"', () => {
    const compilation = getCompilation();
    clean(['foo', 'bar'], compilation, 'foo');
    expect(compilation).toEqual({ assets: { bar: '_bar', baz: '_baz' } });
    clean(['foo', 'bar'], compilation, 'bar');
    expect(compilation).toEqual({ assets: { baz: '_baz' } });
  });
  test('should delete file when the filename is matched by the regular in "options"', () => {
    const compilation = getCompilation();
    clean([/foo/, /bar/], compilation, 'foo');
    expect(compilation).toEqual({ assets: { bar: '_bar', baz: '_baz' } });
    clean([/foo/, /bar/], compilation, 'bar');
    expect(compilation).toEqual({ assets: { baz: '_baz' } });
  });
});
