export function grepFuncWithKeyword(source, regExp) {
  const result = {};
  let [middlePart] = source.match(regExp);
  while (regExp.test(middlePart.slice(1))) [middlePart] = middlePart.slice(1).match(regExp);

  let [leftPart, rightPart] = source.split(middlePart);
  leftPart = leftPart.slice(leftPart.lastIndexOf('function'));
  leftPart += middlePart;
  let [leftBracketCount, rightBracketCount] = [(leftPart.match(/\{/g) || []).length, (leftPart.match(/\}/g) || []).length];
  for (let i = 0; i < rightPart.length; i++) {
    const letter = rightPart[i];
    if (letter === '{') {
      leftBracketCount += 1;
    } else if (letter === '}') {
      rightBracketCount += 1;
    }
    if (leftBracketCount === rightBracketCount) {
      rightPart = rightPart.slice(0, i + 1);
    }
  }
  result.source = leftPart + rightPart;
  result.sourceBody = result.source.replace(/^function[^(]*?(?=\()/, '');
  const hasFuncName = result.source.match(/^function (\S+)(?=\()/);
  result.name = hasFuncName && hasFuncName[1];
  return result;
}

export function genJsChunkLoadFunc(funcOriginName, funcOriginSourceBody, chunksIdMap) {
  return `function ${funcOriginName || ''}(chunkId){var funcOrigin=function ${funcOriginSourceBody};var result=${JSON.stringify(
    chunksIdMap,
  )}[chunkId]||funcOrigin(chunkId);return result}`;
}

export function genCssChunkLoadFunc(chunkIdFlag, funcOriginSource, chunksIdMap) {
  return `function(t,r){var funcOrigin=${funcOriginSource};var chunksIdMap = ${JSON.stringify(
    chunksIdMap,
  )};var n=chunksIdMap[${chunkIdFlag}];if(!n){return funcOrigin(t,r)};for(var n=chunksIdMap[${chunkIdFlag}],a=n,u=document.getElementsByTagName("link"),c=0;c<u.length;c++){var l=(d=u[c]).getAttribute("data-href")||d.getAttribute("href");if("stylesheet"===d.rel&&(l===n||l===a)){return t()}}var f=document.getElementsByTagName("style");for(c=0;c<f.length;c++){var d;if((l=(d=f[c]).getAttribute("data-href"))===n||l===a){return t()}}var s=document.createElement("link");(s.rel="stylesheet"),(s.type="text/css"),(s.onload=t),(s.onerror=function(t){var n=(t&&t.target&&t.target.src)||a,u=new Error("Loading CSS chunk "+e+" failed.("+n+")");(u.code="CSS_CHUNK_LOAD_FAILED"),(u.request=n),delete o[e],s.parentNode.removeChild(s),r(u)}),(s.href=a),document.getElementsByTagName("head")[0].appendChild(s)}`;
}

export function getCssChunkLoadFuncVarName(source, flag) {
  let result = '';
  const [leftPart] = String(source).split(flag);
  const match = String(leftPart).match(/\[((\w|\d)+?)\] ?= ?new Promise.*?$/m);
  if (match) [, result] = match;

  return result;
}

export function genDotSeparateRegexp(filename, flags = '') {
  return new RegExp(
    `${String(filename)
      .split(/[^(\w|\d)]/)
      .join('.*?')}`,
    flags,
  );
}
