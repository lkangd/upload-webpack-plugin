const { toString, hasOwnProperty } = Object.prototype;

export function isString(val) {
  return toString.call(val) === '[object String]';
}

export function isPlainObject(val) {
  return toString.call(val) === '[object Object]';
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

export function deepMerge(...objects) {
  const result = getEmptyMap();
  objects.forEach(obj => {
    if (obj) {
      Object.keys(obj).forEach(key => {
        const val = obj[key];
        if (isPlainObject(val)) {
          if (isPlainObject(result[key])) {
            result[key] = deepMerge(result[key], val);
          } else {
            result[key] = deepMerge(val);
          }
        } else {
          result[key] = val;
        }
      });
    }
  });
  return result;
}
