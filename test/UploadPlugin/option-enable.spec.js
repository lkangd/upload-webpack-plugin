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

describe('UploadPlugin:option-enable', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });
  test('should do noting when option "enable" equal "false"', done => {
    const uploader = uploaders.sync();
    const mockFn = jest.fn();
    // eslint-disable-next-line func-names
    const uploaderMockFn = function (...args) {
      mockFn(...args);
      return uploader(...args);
    };
    const webpackConfig = getWebpackConfig(new UploadPlugin({ uploader: uploaderMockFn, options: { muteLog: false, enable: false } }));
    const compiler = webpack(webpackConfig, function callback(error, result) {
      expect(error).toBeFalsy();
      expect(result.compilation.errors.length).toBe(0);
      expect(mockFn).not.toHaveBeenCalled();
      done();
    });
    compiler.outputFileSystem = new MemoryFs();
  });
});
