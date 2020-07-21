import { isPlainObject, isOwnProperty } from './utils';

export default function mergeOption(to, from) {
  for (const key in to) {
    if (isOwnProperty(to, key) && isOwnProperty(from, key)) {
      if (isPlainObject(to[key])) {
        mergeOption(to[key], from[key]);
      } else {
        // eslint-disable-next-line no-param-reassign
        to[key] = from[key];
      }
    }
  }
}
