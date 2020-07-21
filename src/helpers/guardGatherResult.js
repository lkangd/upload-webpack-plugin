import { isPlainObject, isString, isOwnProperty } from './utils';

export default function guardGatherResult(assets, uploadedUrls) {
  const result = {};
  if (!isPlainObject(uploadedUrls)) return result;

  Object.keys(assets).forEach(filename => {
    if (isOwnProperty(uploadedUrls, filename) && isString(uploadedUrls[filename])) {
      result[filename] = uploadedUrls[filename];
    }
  });
  return result;
}
