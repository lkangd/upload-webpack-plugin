import mergeOption from '../../src/helpers/mergeOption';

describe('helpers:mergeOption', () => {
  test('should only merge option in "to"', () => {
    const to = { foo: '_foo' };
    const from = { foo: '_foo_', bar: '_bar_' };
    mergeOption(to, from);
    expect(to).toEqual({ foo: '_foo_' });
  });
  test('should recursively merge plain object option', () => {
    const to = { foo: { foo: '_foo', baz: '_baz' }, bar: ['_bar', 'bar_'] };
    const from = { foo: { foo: '_foo_' }, bar: ['_bar_'] };
    mergeOption(to, from);
    expect(to).toEqual({ foo: { foo: '_foo_', baz: '_baz' }, bar: ['_bar_'] });
  });
});
