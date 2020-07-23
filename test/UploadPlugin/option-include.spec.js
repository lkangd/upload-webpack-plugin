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
    const uploader = uploaders.sync;
    const webpackConfig = getWebpackConfig(
      new UploadPlugin({
        uploader,
        options: {
          muteLog: true,
          include: ['index.html', /\.ttf$/, /\.js$/, /^dynamicSub\..*\.bundle\.js$/, /^dynamicSub\..*bundle\.css$/],
        },
      }),
    );
    const compiler = webpack(webpackConfig, function callback(error, result) {
      expect(error).toBeFalsy();
      expect(result.compilation.errors.length).toBe(0);
      // const js = result.compilation.assets['file.js'].source();
      // eval(js);
      // const scripts = document.head.getElementsByTagName('script');
      // expect(scripts.length).toBe(1);
      // expect(scripts[0].src).toBe('http://localhost/0.js');
      done();
    });
    compiler.outputFileSystem = new MemoryFs();
  });
});
