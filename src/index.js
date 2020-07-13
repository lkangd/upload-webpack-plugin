import validateOptions from 'schema-utils';

import schema from './options.json';

class UploadPlugin {
  constructor(options = {}) {
    validateOptions(schema, options, {
      name: 'Upload Plugin',
      baseDataPath: 'options',
    });

    this.uploader = options.uploader;
    this.options = options.options || {};
  }
  apply(compiler) {
    const plugin = { name: 'UploadPlugin' };
    compiler.hooks.afterEmit.tapPromise(plugin, compilation => {
      return new Promise((resolve, reject) => {
        if (typeof this.uploader !== 'function') {
          reject(new Error('"uploader" is expected a function'));
        } else {
          resolve(compilation);
        }
      });
    });
  }
}

export default UploadPlugin;
