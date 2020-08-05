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

describe('UploadPlugin:option-include', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });
  test('should replace all returned url', done => {
    const uploader = uploaders.sync();
    const mockFn = jest.fn(uploader);
    // eslint-disable-next-line func-names
    const uploaderMockFn = function (...args) {
      return mockFn(...args);
    };
    const include = ['index.html', /\.ttf$/, /\.js$/, /^dynamicSub\..*\.bundle\.js$/, /^dynamicSub\..*bundle\.css$/];
    const webpackConfig = getWebpackConfig(
      new UploadPlugin({
        uploader: uploaderMockFn,
        options: {
          muteLog: true,
          include,
        },
      }),
    );
    const compiler = webpack(webpackConfig, function callback(error, result) {
      expect(error).toBeFalsy();
      expect(result.compilation.errors.length).toBe(0);
      expect(mockFn).toHaveBeenCalledTimes(11);
      Object.keys(result.compilation.assets).forEach(filename => {
        if (include.some(flag => flag === filename || (flag.test && flag.test(filename)))) {
          expect(mockFn).toHaveBeenCalledWith(result.compilation.assets[filename].source(), filename);
        }
      });
      done();
    });
    compiler.outputFileSystem = new MemoryFs();
  });
});
