const { toString, hasOwnProperty } = Object.prototype;

export function isString(val) {
  return toString.call(val) === '[object String]';
}

export function isPlainObject(val) {
  return toString.call(val) === '[object Object]';
}

export function isArray(val) {
  return toString.call(val) === '[object Array]';
}

export function isRegExp(val) {
  return toString.call(val) === '[object RegExp]';
}

export function isOwnProperty(obj, key) {
  return hasOwnProperty.call(obj, key);
}

export function isEmptyObject(val) {
  if (!isPlainObject(val)) return false;

  for (const key in val) {
    if (isOwnProperty(val, key)) return false;
  }

  return true;
}

export function getEmptyMap() {
  return Object.create(null);
}
