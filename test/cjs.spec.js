import src from '../src';
import cjs from '../src/cjs';

describe('cjs', () => {
  it('should export the src index', () => {
    expect(cjs).toEqual(src);
  });
});
