/**
 * @jest-environment jsdom
 */
/* eslint-disable no-undef */
/* eslint-disable no-eval */
import webpack from 'webpack';
import getWebpackConfig from '../fixtures/getWebpackConfig';
const uploaders = require('../fixtures/uploaders');
const MemoryFs = require('memory-fs');
const UploadPlugin = require('../../src/cjs');

jest.setTimeout(30000);

describe('UploadPlugin:option-clean', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });
  test('should replace all returned url', done => {
    const uploader = uploaders.sync();
    const webpackConfig = getWebpackConfig(new UploadPlugin({ uploader, options: { muteLog: true, clean: [/.*\.((?!(html)).)+/] } }));
    const compiler = webpack(webpackConfig, function callback(error, result) {
      expect(error).toBeFalsy();
      expect(result.compilation.errors.length).toBe(0);

      const keys = Object.keys(result.compilation.assets);
      expect(keys.length).toBe(2);
      expect(keys.every(key => /\.html$/.test(key))).toBeTruthy();
      done();
    });
    compiler.outputFileSystem = new MemoryFs();
  });
});
