/**
 * @jest-environment jsdom
 */
/* eslint-disable no-undef */
/* eslint-disable no-eval */
import webpack from 'webpack';
import getWebpackConfig from '../fixtures/getWebpackConfig';
import { findFile } from '../utils';
const escapeStringRegexp = require('escape-string-regexp');
const uploaders = require('../fixtures/uploaders');
const MemoryFs = require('memory-fs');
const UploadPlugin = require('../../src/cjs');

jest.setTimeout(30000);

describe('UploadPlugin:option-gather', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });
  const configPrefix = 'https://cdn.lkangd.com/';
  const customPrefix = 'https://custom.lkangd.com/';
  test('should replace all returned url', done => {
    const uploader = uploaders.gather();
    const mockFn = jest.fn(uploader);
    // eslint-disable-next-line func-names
    const uploaderMockFn = function (...args) {
      return mockFn(...args);
    };
    const webpackConfig = getWebpackConfig(
      new UploadPlugin({
        uploader: uploaderMockFn,
        options: {
          gather: true,
          muteLog: true,
          replace: {
            useRealFilename: true,
          },
        },
      }),
    );
    const compiler = webpack(webpackConfig, function callback(error, result) {
      expect(error).toBeFalsy();
      expect(result.compilation.errors.length).toBe(0);
      expect(mockFn).toHaveBeenCalledTimes(1);
      const indexHtml = findFile(result.compilation.assets, 'index', 'html');
      expect(new RegExp(`${escapeStringRegexp(customPrefix)}`).test(indexHtml)).toBeTruthy();
      expect(new RegExp(`${escapeStringRegexp(configPrefix)}`).test(indexHtml)).toBeFalsy();
      done();
    });
    compiler.outputFileSystem = new MemoryFs();
  });
  test('should not replace all returned url', done => {
    const uploader = uploaders.gatherVoidReturn();
    const mockFn = jest.fn(uploader);
    // eslint-disable-next-line func-names
    const uploaderMockFn = function (...args) {
      return mockFn(...args);
    };
    const webpackConfig = getWebpackConfig(new UploadPlugin({ uploader: uploaderMockFn, options: { gather: true, muteLog: true } }));
    const compiler = webpack(webpackConfig, function callback(error, result) {
      expect(error).toBeFalsy();
      expect(result.compilation.errors.length).toBe(0);
      expect(mockFn).toHaveBeenCalledTimes(1);
      const indexHtml = findFile(result.compilation.assets, 'index', 'html');
      expect(new RegExp(`${escapeStringRegexp(customPrefix)}`).test(indexHtml)).toBeFalsy();
      expect(new RegExp(`${escapeStringRegexp(configPrefix)}`).test(indexHtml)).toBeTruthy();
      done();
    });
    compiler.outputFileSystem = new MemoryFs();
  });
});
