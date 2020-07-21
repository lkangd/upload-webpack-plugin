import validateOptions from 'schema-utils';
import schema from './options.json';
import defaultOptions from './optionsDefault.json';

import { isString, getEmptyMap, isEmptyObject } from './helpers/utils';
import updateAssetSource from './helpers/updateAssetSource';
import updateUrlInSource from './helpers/updateUrlInSource';
import guardGatherResult from './helpers/guardGatherResult';
import sortUploadOrder from './helpers/sortUploadOrder';
import mergeOption from './helpers/mergeOption';
import handleExclude from './helpers/exclude';
import handleInclude from './helpers/include';
import handleClean from './helpers/clean';
import Spinner from './helpers/spinner';
import {
  genDotSeparateRegexp,
  genJsChunkLoadFunc,
  genCssChunkLoadFunc,
  getCssChunkLoadFuncVarName,
  grepFuncWithKeyword,
} from './helpers/replaceSourceFunc';

const chalk = require('chalk');

const THIS_PLUGIN = { name: 'upload-webpack-plugin' };
const spinner = new Spinner();

class UploadPlugin {
  constructor(options) {
    const safeOptions = defaultOptions;
    mergeOption(safeOptions, options);
    validateOptions(schema, safeOptions, {
      name: THIS_PLUGIN.name,
      baseDataPath: 'options',
    });

    this.uploader = (...args) => {
      !this.options.muteLog && spinner.start(args[1]);
      return safeOptions.uploader(...args);
    };
    this.gatherUploader = safeOptions.uploader;
    this.options = safeOptions.options;

    // record the remote url of all uploaded assets, eg: { [localPath]: [remoteUrl] }
    this.uploadedUrl = getEmptyMap();
    this.gatherUploadedUrl = getEmptyMap();

    // record jss & css uploaded chunks id map, eg: { [chunkId]: [remoteUrl] }
    this.jsChunksIdMap = getEmptyMap();
    this.cssChunksIdMap = getEmptyMap();

    // to find the 'chunk load function' in entry point chunks
    this.jsChunksFlag = '';
    this.cssChunksFlag = '';

    // webpack options from webpack.config.js
    this.chunkFilename = '';
    this.publicPath = '';
  }
  apply(compiler) {
    if (!this.options.enable) {
      // eslint-disable-next-line no-console
      !this.options.muteLog && console.info(chalk.yellowBright(`${THIS_PLUGIN.name} has been disabled.`));
      return;
    }

    compiler.hooks.emit.tapPromise(THIS_PLUGIN, async compilation => {
      if (this.options.gather) {
        const gatherAssets = Object.keys(compilation.assets).reduce((result, filename) => {
          if (!handleInclude(this.options.include, filename) || handleExclude(this.options.exclude, filename)) {
            return result;
          }
          // eslint-disable-next-line no-param-reassign
          result[filename] = compilation.assets[filename].source();
          return result;
        }, getEmptyMap());
        // debugger
        this.gatherUploadedUrl = await this.gatherUploader(gatherAssets);
        this.gatherUploadedUrl = guardGatherResult(gatherAssets, this.gatherUploadedUrl);
      }
      const entryChunkGroups = compilation.chunkGroups.filter(chunkGroup => chunkGroup.getParents().length === 0);
      // const sortFilterFunc = filename => !handleInclude(this.options.include, filename) || handleExclude(this.options.exclude, filename);
      const sortedAssets = sortUploadOrder(Object.keys(compilation.assets), this.options.replace.typesWithOrder);
      const { priority: prioriAssets, nonPriority: nonPrioriAssets } = sortedAssets;
      spinner.setFileCount(sortedAssets.all.length);
      const updateNonPrioriAssets = filename => {
        const hasFileIdx = nonPrioriAssets.findIndex(remain => remain === filename);
        hasFileIdx !== -1 && nonPrioriAssets.splice(hasFileIdx, 1);
      };
      const handleResult = (filename, chunkId, resultUrl) => {
        handleClean(this.options.clean, compilation, filename);
        !this.options.muteLog && spinner.end(filename, resultUrl);
        if (!isString(resultUrl)) return;

        this.uploadedUrl[filename] = resultUrl;
        if (/.js$/.test(filename)) {
          this.jsChunksIdMap[chunkId] = resultUrl;
          return;
        }
        if (/.css$/.test(filename)) {
          this.cssChunksIdMap[chunkId] = resultUrl;
        }
      };
      const uploadChunk = async chunkGroups => {
        for (const chunkGroup of chunkGroups) {
          const childChunkGroups = chunkGroup.getChildren();
          // eslint-disable-next-line no-await-in-loop
          await uploadChunk(childChunkGroups);
          const chunkUploads = chunkGroup.chunks.map(async chunk => {
            const fileUploads = chunk.files.map(async filename => {
              const file = compilation.assets[filename];
              if (!file || this.uploadedUrl[filename]) return;

              let toUploadSource = file.source();
              toUploadSource = this.handleJSChunkReplace(filename, toUploadSource, chunkGroup, compilation);
              toUploadSource = this.handleCSSChunkReplace(filename, toUploadSource, chunkGroup, compilation);
              toUploadSource = updateUrlInSource(toUploadSource, filename, this.uploadedUrl, this.options.replace.useRealFilename);
              updateAssetSource(compilation, filename, toUploadSource);
              updateNonPrioriAssets(filename);

              if (!handleInclude(this.options.include, filename) || handleExclude(this.options.exclude, filename)) {
                // updateNonPrioriAssets(filename);
                spinner.delCount(filename);
                return;
              }
              this.grepChunkFlag(filename, chunkGroup);
              let resultUrl;
              if (this.options.gather) {
                resultUrl = this.gatherUploadedUrl[filename];
              } else {
                resultUrl = await this.uploader(toUploadSource, filename);
              }
              handleResult(filename, chunk.id, resultUrl);
            });
            const result = await Promise.all(fileUploads);
            return result;
          });
          // eslint-disable-next-line no-await-in-loop
          await Promise.all(chunkUploads);
        }
      };
      const uploadAsset = async (assetFilenames, needReplace = true) => {
        const uploads = assetFilenames.map(async filename => {
          let toUploadSource = compilation.assets[filename].source();
          if (needReplace) {
            toUploadSource = updateUrlInSource(toUploadSource, filename, this.uploadedUrl, this.options.replace.useRealFilename);
            updateAssetSource(compilation, filename, toUploadSource);
          }
          if (!handleInclude(this.options.include, filename) || handleExclude(this.options.exclude, filename)) {
            spinner.delCount(filename);
            return;
          }
          let resultUrl;
          if (this.options.gather) {
            resultUrl = this.gatherUploadedUrl[filename];
          } else {
            resultUrl = await this.uploader(toUploadSource, filename);
          }
          // non-chunk assets without 'chunkId'
          handleResult(filename, '', resultUrl);
        });
        await Promise.all(uploads);
      };
      await uploadAsset(prioriAssets, false);
      await uploadChunk(entryChunkGroups);
      await uploadAsset(nonPrioriAssets);
    });
    compiler.hooks.compilation.tap(THIS_PLUGIN, compilation => {
      this.chunkFilename = compilation.outputOptions.chunkFilename;
      this.publicPath = compilation.outputOptions.publicPath;
    });
  }
  grepChunkFlag(filename, chunkGroup) {
    if (chunkGroup.getParents().length === 0) return;

    if (/\.css$/.test(filename)) {
      this.cssChunksFlag = genDotSeparateRegexp(filename, 'm');
      return;
    }
    if (/\.js$/.test(filename)) {
      this.jsChunksFlag = genDotSeparateRegexp(filename);
    }
  }
  handleJSChunkReplace(filename, toUploadSource, chunkGroup, compilation) {
    let result = toUploadSource;
    if (chunkGroup.getParents().length !== 0 || isEmptyObject(this.jsChunksIdMap) || !this.jsChunksFlag || !this.jsChunksFlag.test(result))
      return result;

    const jsonpScriptSrcFunc = grepFuncWithKeyword(result, this.jsChunksFlag);
    // keep first time matched origin function body to avoid duplicate 'src function' wrap
    this.jsonpScriptSrcFuncOrigin = this.jsonpScriptSrcFuncOrigin || jsonpScriptSrcFunc.sourceBody;
    const newJsonpScriptSrcFunc = genJsChunkLoadFunc(jsonpScriptSrcFunc.name, this.jsonpScriptSrcFuncOrigin, this.jsChunksIdMap);
    result = result.replace(this.lastNewJsonpScriptSrcFunc || jsonpScriptSrcFunc.source, newJsonpScriptSrcFunc);
    this.lastNewJsonpScriptSrcFunc = newJsonpScriptSrcFunc;
    updateAssetSource(compilation, filename, result);
    return result;
  }
  handleCSSChunkReplace(filename, toUploadSource, chunkGroup, compilation) {
    let result = toUploadSource;
    if (chunkGroup.getParents().length !== 0 || isEmptyObject(this.cssChunksIdMap) || !this.cssChunksFlag || !this.cssChunksFlag.test(result))
      return result;

    const cssChunkHrefFunc = grepFuncWithKeyword(result, this.cssChunksFlag);
    // keep first time matched origin function body to avoid duplicate 'href function' wrap
    this.cssChunkHrefFuncOrigin = this.cssChunkHrefFuncOrigin || cssChunkHrefFunc.source;
    const cssChunkHrefFuncVarName = getCssChunkLoadFuncVarName(result, this.cssChunksFlag);
    const newCssChunkHrefFunc = genCssChunkLoadFunc(cssChunkHrefFuncVarName, this.cssChunkHrefFuncOrigin, this.cssChunksIdMap);
    result = result.replace(this.lastNewCssChunkHrefFunc || cssChunkHrefFunc.source, newCssChunkHrefFunc);
    this.lastNewCssChunkHrefFunc = newCssChunkHrefFunc;
    updateAssetSource(compilation, filename, result);
    return result;
  }
}

export default UploadPlugin;
