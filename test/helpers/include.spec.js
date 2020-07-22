import include from '../../src/helpers/include';

describe('helpers:include', () => {
  test('should include the file when the "options" is not a "array"', () => {
    const result = include(true, 'foo.ext');
    expect(result).toBe(true);
  });
  test('should include the file when the "length" fo"options" is 0', () => {
    const result = include([], 'foo.ext');
    expect(result).toBe(true);
  });
  test('should include the file when the filename is equal to the string in "options"', () => {
    const result = include(['foo.ext', 'bar.ext'], 'foo.ext');
    expect(result).toBe(true);
  });
  test('should include the file when the filename is matched by the regular in "options"', () => {
    const resultExt = include([/\.ext$/, 'bar.ext'], 'foo.ext');
    expect(resultExt).toBe(true);
  });
  test('should not include the file when the filename is not matched', () => {
    const resultExt = include([/\.ext$/, 'bar.baz'], 'foo.baz');
    expect(resultExt).toBe(false);
  });
});
