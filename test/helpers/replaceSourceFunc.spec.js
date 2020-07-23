/**
 * @jest-environment jsdom
 */
/* eslint-disable no-undef */
import {
  genDotSeparateRegexp,
  grepFuncWithKeyword,
  genJsChunkLoadFunc,
  genCssChunkLoadFunc,
  getCssChunkLoadFuncVarName,
} from '../../src/helpers/replaceSourceFunc';
import jsMainChunk from '../fixtures/jsMainChunk';
import jsMainChunkMinimized from '../fixtures/jsMainChunkMinimized';

describe('helpers:replaceSourceFunc', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });
  describe('genDotSeparateRegexp', () => {
    test('should return a dot separate regexp', () => {
      let regExp = genDotSeparateRegexp('others/dimmed.424ed69.ttf');
      expect(regExp).toEqual(/others.*?dimmed.*?424ed69.*?ttf/);
      regExp = genDotSeparateRegexp('others/dimmed.424ed69.ttf', 'gim');
      expect(regExp).toEqual(/others.*?dimmed.*?424ed69.*?ttf/gim);
      regExp = genDotSeparateRegexp('dimmed', 'gim');
      expect(regExp).toEqual(/dimmed/gim);
    });
  });
  describe('grepFuncWithKeyword', () => {
    const jsChunkId = '3';
    test('should return js chunk load function correctly from not minimized js main chunk', () => {
      const jsChunkName = 'dynamic.56ad341.2a7837e.bundle.js';
      const jsChunkRegExp = genDotSeparateRegexp(jsChunkName);
      const jsChunkLoadFunc = grepFuncWithKeyword(jsMainChunk, jsChunkRegExp);
      // eslint-disable-next-line prefer-const
      let jsChunkNameFromFunc = '';
      // eslint-disable-next-line no-eval
      eval(`const __webpack_require__={p:''};jsChunkNameFromFunc=(${jsChunkLoadFunc.source})(${jsChunkId})`);
      expect(jsChunkNameFromFunc).toBe(jsChunkName);
    });
    test('should return js chunk load function correctly from minimized js main chunk', () => {
      const jsChunkName = 'dynamic.e3215df.454d6cc.bundle.js';
      const jsChunkRegExp = genDotSeparateRegexp(jsChunkName);
      const jsChunkLoadFunc = grepFuncWithKeyword(jsMainChunkMinimized, jsChunkRegExp);
      // eslint-disable-next-line prefer-const
      let jsChunkNameFromFunc = '';
      // eslint-disable-next-line no-eval
      eval(`const i={ p: ''};jsChunkNameFromFunc=(${jsChunkLoadFunc.source})(${jsChunkId})`);
      expect(jsChunkNameFromFunc).toBe(jsChunkName);
    });

    const cssChunkId = '3';
    test('should return css chunk load function correctly from not minimized js main chunk', () => {
      const cssChunkName = 'dynamic.56ad341.bundle.css';
      const cssChunkRegExp = genDotSeparateRegexp(cssChunkName);
      const cssChunkLoadFunc = grepFuncWithKeyword(jsMainChunk, cssChunkRegExp);
      // eslint-disable-next-line no-eval
      eval(`const __webpack_require__={p:''};const chunkId=${cssChunkId};new Promise(${cssChunkLoadFunc.source});`);
      const links = Array.from(document.head.getElementsByTagName('link'));
      expect(links.length).toBe(1);
      expect(links[0].href).toBe(`http://localhost/${cssChunkName}`);
    });
    test('should return css chunk load function correctly from minimized js main chunk', () => {
      const cssChunkName = 'dynamic.e3215df.bundle.css';
      const cssChunkRegExp = genDotSeparateRegexp(cssChunkName);
      const cssChunkLoadFunc = grepFuncWithKeyword(jsMainChunkMinimized, cssChunkRegExp);
      // eslint-disable-next-line no-eval
      eval(`const i={ p: ''};const e=${cssChunkId};new Promise(${cssChunkLoadFunc.source});`);
      const links = Array.from(document.head.getElementsByTagName('link'));
      expect(links.length).toBe(1);
      expect(links[0].href).toBe(`http://localhost/${cssChunkName}`);
    });
    test('should return correctly when "non-function" string input', () => {
      const func = grepFuncWithKeyword(' ', / /);
      expect(func).toEqual({ name: null, source: ' ', sourceBody: ' ' });
    });
  });

  describe('genJsChunkLoadFunc', () => {
    const jsChunkId = '3';
    test('should wrap origin js chunk load function correctly from not minimized js main chunk', () => {
      const jsChunksIdMap = { [jsChunkId]: 'https://cdn.lkangd.com/dynamic.56ad341.2a7837e.bundle.js' };
      const jsChunkName = 'dynamic.56ad341.2a7837e.bundle.js';
      const jsChunkRegExp = genDotSeparateRegexp(jsChunkName);
      const jsChunkLoadFunc = grepFuncWithKeyword(jsMainChunk, jsChunkRegExp);
      const newJsChunkLoadFunc = genJsChunkLoadFunc(jsChunkLoadFunc.name, jsChunkLoadFunc.sourceBody, jsChunksIdMap);
      // eslint-disable-next-line prefer-const
      let jsChunkNameFromFunc = '';
      // eslint-disable-next-line no-eval
      eval(`const __webpack_require__={p:'https://cdn.origin.com/'};jsChunkNameFromFunc=(${newJsChunkLoadFunc})(${jsChunkId})`);
      expect(jsChunkNameFromFunc).toBe(jsChunksIdMap[jsChunkId]);
      const originChunkId = '4';
      // eslint-disable-next-line prefer-const
      let jsChunkNameFromFuncOrigin = '';
      // eslint-disable-next-line no-eval
      eval(`const __webpack_require__={p:'https://cdn.origin.com/'};jsChunkNameFromFunc=(${newJsChunkLoadFunc})(${originChunkId})`);
      // eslint-disable-next-line no-eval
      eval(`const __webpack_require__={p:'https://cdn.origin.com/'};jsChunkNameFromFuncOrigin=(${jsChunkLoadFunc.source})(${originChunkId})`);
      expect(jsChunkNameFromFunc).toBe(jsChunkNameFromFuncOrigin);
    });
  });
  describe('genJsChunkLoadFunc', () => {
    const jsChunkId = '3';
    test('should wrap origin js chunk load function correctly from minimized js main chunk', () => {
      const jsChunksIdMap = { [jsChunkId]: 'https://cdn.lkangd.com/dynamic.e3215df.454d6cc.bundle.js' };
      const jsChunkName = 'dynamic.e3215df.454d6cc.bundle.js';
      const jsChunkRegExp = genDotSeparateRegexp(jsChunkName);
      const jsChunkLoadFunc = grepFuncWithKeyword(jsMainChunkMinimized, jsChunkRegExp);
      const newJsChunkLoadFunc = genJsChunkLoadFunc(jsChunkLoadFunc.name, jsChunkLoadFunc.sourceBody, jsChunksIdMap);
      // eslint-disable-next-line prefer-const
      let jsChunkNameFromFunc = '';
      // eslint-disable-next-line no-eval
      eval(`const i={p:'https://cdn.origin.com/'};jsChunkNameFromFunc=(${newJsChunkLoadFunc})(${jsChunkId})`);
      expect(jsChunkNameFromFunc).toBe(jsChunksIdMap[jsChunkId]);
      const originChunkId = '4';
      // eslint-disable-next-line prefer-const
      let jsChunkNameFromFuncOrigin = '';
      // eslint-disable-next-line no-eval
      eval(`const i={p:'https://cdn.origin.com/'};jsChunkNameFromFunc=(${newJsChunkLoadFunc})(${originChunkId})`);
      // eslint-disable-next-line no-eval
      eval(`const i={p:'https://cdn.origin.com/'};jsChunkNameFromFuncOrigin=(${jsChunkLoadFunc.source})(${originChunkId})`);
      expect(jsChunkNameFromFunc).toBe(jsChunkNameFromFuncOrigin);
    });
  });

  describe('getCssChunkLoadFuncVarName', () => {
    test('should return variable name of css chunk load function correctly from not minimized js main chunk', () => {
      const cssChunkName = 'dynamic.56ad341.bundle.css';
      const cssChunkRegExp = genDotSeparateRegexp(cssChunkName);
      const cssChunkLoadFuncVarName = getCssChunkLoadFuncVarName(jsMainChunk, cssChunkRegExp);
      expect(cssChunkLoadFuncVarName).toEqual('chunkId');
    });
    test('should return variable name of css chunk load function correctly from minimized js main chunk', () => {
      const cssChunkName = 'dynamic.e3215df.bundle.css';
      const cssChunkRegExp = genDotSeparateRegexp(cssChunkName);
      const cssChunkLoadFuncVarName = getCssChunkLoadFuncVarName(jsMainChunkMinimized, cssChunkRegExp);
      expect(cssChunkLoadFuncVarName).toEqual('e');
    });
    test('should return "" when not matched', () => {
      const cssChunkLoadFuncVarName = getCssChunkLoadFuncVarName();
      expect(cssChunkLoadFuncVarName).toBe('');
    });
  });
  describe('genCssChunkLoadFunc', () => {
    const cssChunkId = '3';
    test('should wrap origin css chunk load function correctly from not minimized js main chunk ', () => {
      const cssChunksIdMap = { [cssChunkId]: 'https://cdn.lkangd.com/dynamic.56ad341.bundle.css' };
      const cssChunkName = 'dynamic.56ad341.bundle.css';
      const cssChunkRegExp = genDotSeparateRegexp(cssChunkName);
      const cssChunkLoadFunc = grepFuncWithKeyword(jsMainChunk, cssChunkRegExp);
      const cssChunkLoadFuncVarName = getCssChunkLoadFuncVarName(jsMainChunk, cssChunkRegExp);
      const newCssChunkLoadFunc = genCssChunkLoadFunc(cssChunkLoadFuncVarName, cssChunkLoadFunc.source, cssChunksIdMap);
      // eslint-disable-next-line no-eval
      eval(`const __webpack_require__={p:''};const chunkId=${cssChunkId};new Promise(${newCssChunkLoadFunc});`);
      let links = Array.from(document.head.getElementsByTagName('link'));
      expect(links.length).toBe(1);
      expect(links[0].href).toBe(cssChunksIdMap[cssChunkId]);
      const originChunkId = '4';
      // eslint-disable-next-line no-eval
      eval(`const __webpack_require__={p:''};const chunkId=${originChunkId};new Promise(${newCssChunkLoadFunc});`);
      links = Array.from(document.head.getElementsByTagName('link'));
      expect(links.length).toBe(2);
      expect(links[1].href).toBe('http://localhost/dynamicInDynamic.088e3a7.bundle.css');
    });
    test('should wrap origin css chunk load function correctly from not minimized js main chunk ', () => {
      const cssChunksIdMap = { [cssChunkId]: 'https://cdn.lkangd.com/dynamic.e3215df.bundle.css' };
      const cssChunkName = 'dynamic.e3215df.bundle.css';
      const cssChunkRegExp = genDotSeparateRegexp(cssChunkName);
      const cssChunkLoadFunc = grepFuncWithKeyword(jsMainChunkMinimized, cssChunkRegExp);
      const cssChunkLoadFuncVarName = getCssChunkLoadFuncVarName(jsMainChunkMinimized, cssChunkRegExp);
      const newCssChunkLoadFunc = genCssChunkLoadFunc(cssChunkLoadFuncVarName, cssChunkLoadFunc.source, cssChunksIdMap);
      // eslint-disable-next-line no-eval
      eval(`const i={p:''};const e=${cssChunkId};new Promise(${newCssChunkLoadFunc});`);
      let links = Array.from(document.head.getElementsByTagName('link'));
      expect(links.length).toBe(1);
      expect(links[0].href).toBe(cssChunksIdMap[cssChunkId]);
      const originChunkId = '4';
      // eslint-disable-next-line no-eval
      eval(`const i={p:''};const e=${originChunkId};new Promise(${newCssChunkLoadFunc});`);
      links = Array.from(document.head.getElementsByTagName('link'));
      expect(links.length).toBe(2);
      expect(links[1].href).toBe('http://localhost/dynamicInDynamic.9ed676d.bundle.css');
    });
  });
});
