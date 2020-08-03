/* eslint-disable import/prefer-default-export */
export function findFile(files, name, ext) {
  const nameMaps = Object.keys(files);
  const regExp = new RegExp(`^${name}.*\\.${ext}$`);
  const filename = nameMaps.find(n => regExp.test(n));
  return filename ? files[filename].source() : null;
}
