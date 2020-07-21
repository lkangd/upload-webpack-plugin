import { isArray, isString, isRegExp } from './utils';

const delAsset = (compilation, filename) => {
  compilation.assets[filename] = null; // eslint-disable-line no-param-reassign
  delete compilation.assets[filename]; // eslint-disable-line no-param-reassign
};

export default function clean(options, compilation, filename) {
  if (options === false) return;

  if (options === true) {
    delAsset(compilation, filename);
    return;
  }
  if (!isArray(options)) return;

  for (const flag of options) {
    if ((isString(flag) && flag === filename) || (isRegExp(flag) && flag.test(filename))) {
      delAsset(compilation, filename);
    }
  }
}
