import { isArray, isString, isRegExp } from './utils';

export default function exclude(options, filename) {
  if (!isArray(options) || options.length === 0) return false;

  for (const flag of options) {
    if ((isString(flag) && flag === filename) || (isRegExp(flag) && flag.test(filename))) {
      return true;
    }
  }
  return false;
}
