import updateAssetSource from '../../src/helpers/updateAssetSource';

describe('helpers:updateAssetSource', () => {
  test('should update the origin "compilation"', () => {
    const compilation = {
      assets: {
        foo: {
          source: () => '_foo',
          size: () => '_foo'.length,
        },
        bar: {
          source: () => '_bar',
          size: () => '_bar'.length,
        },
        baz: {
          source: () => '_baz',
          size: () => '_baz'.length,
        },
      },
    };

    updateAssetSource(compilation, 'foo', '_foo_');
    expect(compilation.assets.foo.source()).toBe('_foo_');
    expect(compilation.assets.foo.size()).toBe('_foo_'.length);

    updateAssetSource(compilation, 'bar', '_bar_');
    expect(compilation.assets.bar.source()).toBe('_bar_');
    expect(compilation.assets.bar.size()).toBe('_bar_'.length);

    updateAssetSource(compilation, 'baz', '_baz_');
    expect(compilation.assets.baz.source()).toBe('_baz_');
    expect(compilation.assets.baz.size()).toBe('_baz_'.length);
  });
});
