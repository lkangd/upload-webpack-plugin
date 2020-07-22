import exclude from '../../src/helpers/exclude';

describe('helpers:exclude', () => {
  test('should not exclude the file when the "options" is not a "array"', () => {
    const result = exclude(true, 'foo.ext');
    expect(result).toBe(false);
  });
  test('should not exclude the file when the "length" fo"options" is 0', () => {
    const result = exclude([], 'foo.ext');
    expect(result).toBe(false);
  });
  test('should exclude the file when the filename is equal to the string in "options"', () => {
    const result = exclude(['foo.ext', 'bar.ext'], 'foo.ext');
    expect(result).toBe(true);
  });
  test('should exclude the file when the filename is matched by the regular in "options"', () => {
    const resultExt = exclude([/\.ext$/, 'bar.ext'], 'foo.ext');
    expect(resultExt).toBe(true);
  });
  test('should not exclude the file when the filename is not matched', () => {
    const resultExt = exclude([/\.ext$/, 'bar.baz'], 'foo.baz');
    expect(resultExt).toBe(false);
  });
});
