/* eslint-disable no-param-reassign */
export default function updateAssetSource(compilation, filename, source) {
  compilation.assets[filename].source = () => source;
  compilation.assets[filename].size = () => source.length;
}
