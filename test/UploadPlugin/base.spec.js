/**
 * @jest-environment jsdom
 */
/* eslint-disable no-undef */
/* eslint-disable no-eval */
import webpack from 'webpack';
import getWebpackConfig from '../fixtures/getWebpackConfig';
import { findFile } from '../utils';
const uploaders = require('../fixtures/uploaders');
const MemoryFs = require('memory-fs');
const UploadPlugin = require('../../src/cjs');

jest.setTimeout(30000);

describe('UploadPlugin:base', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });
  test('should replace all returned url', done => {
    const customPrefix = 'http://localhost/';
    const uploader = uploaders.sync(customPrefix);
    const webpackConfig = getWebpackConfig(new UploadPlugin({ uploader }));
    const compiler = webpack(webpackConfig, function callback(error, result) {
      expect(error).toBeFalsy();
      expect(result.compilation.errors.length).toBe(0);
      // index.html
      const indexHtml = findFile(result.compilation.assets, 'index', 'html');
      document.documentElement.innerHTML = indexHtml;
      let scripts = Array.from(document.getElementsByTagName('script'));
      let srcs = scripts.map(({ src }) => src);
      expect(scripts.length).toBe(4);
      expect(srcs.every(src => src.startsWith(customPrefix)));
      let links = Array.from(document.getElementsByTagName('link'));
      let hrefs = links.map(({ href }) => href);
      expect(links.length).toBe(2);
      expect(hrefs.every(href => href.startsWith(customPrefix)));
      // sub.html
      const subHtml = findFile(result.compilation.assets, 'sub', 'html');
      document.documentElement.innerHTML = subHtml;
      scripts = Array.from(document.getElementsByTagName('script'));
      srcs = scripts.map(({ src }) => src);
      expect(srcs.every(src => src.startsWith(customPrefix)));
      expect(scripts.length).toBe(4);
      links = Array.from(document.getElementsByTagName('link'));
      hrefs = links.map(({ href }) => href);
      expect(links.length).toBe(2);
      expect(hrefs.every(href => href.startsWith(customPrefix)));
      done();
    });
    compiler.outputFileSystem = new MemoryFs();
  });
  test('should not replace all returned void url', done => {
    const configPrefix = 'https://cdn.lkangd.com/';
    const customPrefix = 'http://localhost/';
    const uploader = uploaders.syncVoidReturn(customPrefix);
    const webpackConfig = getWebpackConfig(new UploadPlugin({ uploader, options: { muteLog: true } }));
    const compiler = webpack(webpackConfig, function callback(error, result) {
      expect(error).toBeFalsy();
      expect(result.compilation.errors.length).toBe(0);
      // index.html
      const indexHtml = findFile(result.compilation.assets, 'index', 'html');
      document.documentElement.innerHTML = indexHtml;
      let scripts = Array.from(document.getElementsByTagName('script'));
      let srcs = scripts.map(({ src }) => src);
      expect(scripts.length).toBe(4);
      expect(srcs.every(src => src.startsWith(configPrefix)));
      let links = Array.from(document.getElementsByTagName('link'));
      let hrefs = links.map(({ href }) => href);
      expect(links.length).toBe(2);
      expect(hrefs.every(href => href.startsWith(configPrefix)));
      // sub.html
      const subHtml = findFile(result.compilation.assets, 'sub', 'html');
      document.documentElement.innerHTML = subHtml;
      scripts = Array.from(document.getElementsByTagName('script'));
      srcs = scripts.map(({ src }) => src);
      expect(srcs.every(src => src.startsWith(configPrefix)));
      expect(scripts.length).toBe(4);
      links = Array.from(document.getElementsByTagName('link'));
      hrefs = links.map(({ href }) => href);
      expect(links.length).toBe(2);
      expect(hrefs.every(href => href.startsWith(configPrefix)));
      done();
    });
    compiler.outputFileSystem = new MemoryFs();
  });
});
