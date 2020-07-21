import { isOwnProperty } from './utils';
const escapeStringRegexp = require('escape-string-regexp');
const globParent = require('glob-parent');

function updateUrlInSource(source, sourceName, urls, useRealFilename = false) {
  let result = source;
  for (const localUrl in urls) {
    if (isOwnProperty(urls, localUrl)) {
      const remoteUrl = urls[localUrl];
      result = wrapReplace(result, sourceName, localUrl, remoteUrl, useRealFilename);
    }
  }
  return result;
}

function wrapReplace(source, sourceName, localUrl, remoteUrl, useRealFilename = false) {
  let toReplaceUrl = localUrl;
  if (useRealFilename) {
    const fileGlobParent = globParent(toReplaceUrl);
    if (fileGlobParent !== '.') {
      toReplaceUrl = toReplaceUrl.replace(fileGlobParent, '');
    }
  }
  if (/\.css$/.test(sourceName)) {
    const regExp = new RegExp(`url\\([^(]*?${escapeStringRegexp(toReplaceUrl)}\\)`, 'gm');
    return source.replace(regExp, `url(${remoteUrl})`);
  }
  if (/\.js$/.test(sourceName)) {
    // handle the situations like `src = ((someArgs) + toReplaceUrl)` or `{src: ((someArgs) + toReplaceUrl)}`
    let regExp = new RegExp(`\\+ ?(['"])[^'"]*?${escapeStringRegexp(toReplaceUrl)}\\1`, 'gm');
    if (regExp.test(source)) {
      regExp = new RegExp(`[:=][^:=]*(['"])[^'"]*?${escapeStringRegexp(toReplaceUrl)}\\1`, 'gm');
      return source.replace(regExp, (w, $1) => {
        const pairs = w.replace(/[^()]/g, '').replace(/()/g, '');
        return `${w[0]}${pairs}${$1}${remoteUrl}${$1}`;
      });
    }
    regExp = new RegExp(`(['"])[^'"]*?${escapeStringRegexp(toReplaceUrl)}\\1`, 'gm');
    return source.replace(regExp, `$1${remoteUrl}$1`);
  }
  if (/\.html$/.test(sourceName)) {
    const regExp = new RegExp(`=(['"])?\\S*?${escapeStringRegexp(toReplaceUrl)}\\1`, 'gm');
    return source.replace(regExp, `="${remoteUrl}"`);
  }
  return source;
}

export default updateUrlInSource;
