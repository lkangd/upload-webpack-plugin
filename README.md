<div align="center">
  <a href="https://github.com/lkangd/upload-webpack-plugin">
    <img width="200" height="200"
      src="https://github.com/lkangd/upload-webpack-plugin/blob/master/logo.png">
  </a>
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>

[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![cover][cover]][cover-url]
[![size][size]][size-url]
[![vulnerability][vulnerability]][vulnerability-url]

<!-- [![typescript][typescript]][typescript-url] -->
<!-- [![tests][tests]][tests-url] -->

<h1>upload-webpack-plugin</h1>
</div>

<p align="center">A plugin for webpack which uploads file to the remote server before the files are emitted.</p>

<h2 align="center">开始使用</h2>

使用 npm：

```bash
$ npm install upload-webpack-plugin --save-dev
```

使用 yarn：
```bash
$ yarn add upload-webpack-plugin --dev
```

然后在`webpack`配置文件内引入插件，提供上传函数，并根据实际情况，看是否返回上传后的地址，如：

**webpack.config.js**

```js
const UploadPlugin = require('upload-webpack-plugin');
const uploader = (file, filename) => {

  // do some stuff

  return `${cdnPrefix}/${filename}`; // return the remote url of current asset is optional
}

module.exports = {
  plugins: [
    new UploadPlugin({ uploader }),
  ],
};
```

或者使用`Promise`的方式：

```js
const UploadPlugin = require('upload-webpack-plugin');
const uploader = (file, filename) => {
  return new Promise(resolve => {

    // do some stuff

    resolve(`${cdnPrefix}/${filename}`);
  })
}

module.exports = {
  plugins: [
    new UploadPlugin({ uploader }),
  ],
};
```
> ℹ️ 在不需要替换`css`、`js`、`html`内引用的已上传的文件的链接时，可以不用返回或者返回`undefined`。

> ℹ️ 使用`Promise`的方式时，会等待上传结果返回后，才会继续打包流程，记得最后一定要调用`resolve`(值可为空)。



<h2 align="center">选项</h2>

插件启用所有值的选项签名如下：

**webpack.config.js**

```js
const UploadPlugin = require('upload-webpack-plugin');
const uploader = (file, filename) => {

  // do some stuff

  return `${cdnPrefix}/${filename}`; // return the remote url of current asset is optional
}

module.exports = {
  plugins: [
    new UploadPlugin({
      uploader,
      options: {
        enable: true,
        muteLog: false,
        gather: false,
        clean: [/.*\.((?!(html)).)+/],
        exclude: [/\.css$/, /\.js$/],
        include: ['index.html', /\.css$/, /\.js$/],
        replace: {
          typesWithOrder: ['.css', '.js', '.html'],
          useRealFilename: false,
        },
      } }),
  ],
};
```

|名称|类型|默认值|描述|
|:--:|:--:|:-----:|:----------|
|**[`uploader`](#uploader)**|`{Function}`|`null`|默认上传函数
|**[`gather`](#gather)**|`{Boolean}`|`false`|汇总上传，如果为`true`，会一次性提供所有生成的文件
|**[`enable`](#enable)**|`{Boolean}`|`true`|是否启用插件
|**[`include`](#include)**|`{String[]\|RegExp[]}`|`[]`|只上传指定`类型|名称`的文件
|**[`exclude`](#exclude)**|`{String[]\|RegExp[]}`|`[]`|除了指定`类型|名称`的文件，都上传，与`include`互斥，级别比`include`高
|**[`clean`](#clean)**|`{Boolean\|String[]\|RegExp[]}`|`false`|删除上传成功后的资源
|**[`muteLog`](#muteLog)**|`{Boolean}`|`false`|禁止插件所有提示
|**[`replace.typesWithOrder`](#replacetypeswithorder)**|`{Array}`|`['.css', '.js', '.html']`|需要替换引用资源链接的文件类型和顺序
|**[`replace.useRealFilename`](#replaceuserealfilename)**|`{Boolean}`|`false`|替换引用资源链接时，使用真实文件名进行匹配

#### `uploader`

Type: `Function`
Default: `null`

资源上传函数，也是唯一的必须提供的选项，如果只是单纯地获取资源进行上传，不需要返回任何值，如果需要根据不同文件类型定制不同的远程地址，可以返回指定值。

> ⚠️ 请务必提供上传函数，否则插件会静默失败并跳过调用过程

```js
module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src/index'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:7].[contentHash:7].js',
    publicPath: 'https://cdn.lkangd.com/', // 默认的 publicPath
  },
  plugins: [
    new UploadWebpackPlugin({ uploader(source, name) => {

      // do some stuff

      return `https://cdn.custom.com/${name}`; // 需要与 output.output 区分的情况
    } }),
  ],
};
```

也可以使用`Promise`的方式。

```js
module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src/index'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:7].[contentHash:7].js',
    publicPath: 'https://cdn.lkangd.com/', // 默认的 publicPath
  },
  plugins: [
    new UploadWebpackPlugin({ uploader(source, name) => {
      return new Promise(resolve => {

        // do some stuff

        setTimeout(() => { // 模拟上传时间 3 秒
          resolve(`https://cdn.custom.com/${name}`); // 需要与 output.output 区分的情况
        }, 3000);
      });

    } }),
  ],
};
```

#### `gather`

Type: `Boolean`
Default: `false`

汇总上传，此时会将所有生成的资源一次性提供给`uploader`函数使用，`uploader`的第一个参数会变为形如`{ foo: [source_of_foo], bar: [source_of_bar] }`的对象。

上传完成后，根据实际情况返回形如`{ foo: [remote_url_of_foo], bar: [remote_url_of_bar] }`的`map`对象。

> ⚠️ 返回值只接受原来存在的文件对应地址，其他值会静默过滤

**webpack.config.js**
```js
module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src/index'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:7].[contentHash:7].js',
    publicPath: 'https://cdn.lkangd.com/', // 默认的 publicPath
  },
  plugins: [
    new UploadWebpackPlugin({ uploader(sourceMaps) => {
      const result = {};
      Object.keys(sourceMaps).forEach(localPath => {
        const file = sourceMaps[localPath];
        const remoteUrl = (function() { /** do some stuff */  })();
        result[localPath] = remoteUrl;
      })

      return result;
    }, options: {
      gather: true, // 设置 options.gather 为 true
    } }),
  ],
};
```

#### `enable`

Type: `Boolean`
Default: `true`

插件总开关，可根据运行环境决定是否使用插件。

**webpack.config.js**

```js
const UploadPlugin = require('upload-webpack-plugin');
const uploader = (file, filename) => {

  // do some stuff

  return `${cdnPrefix}/${filename}`; // return the remote url of current asset is optional
}

module.exports = {
  plugins: [
    new UploadPlugin({
      uploader,
      options: {
        enable: verdictProduction(), // 环境判断函数...
      } }),
  ],
};
```

#### `include`

Type: `String[]|RegExp[]`
Default: `[]`

只上传指定类型或指定文件名的文件，与`exclude`选项互斥，级别比`exclude`低。

> ⚠️ 选项值为空时不过滤任何文件。

**webpack.config.js**

```js
const UploadPlugin = require('upload-webpack-plugin');
const uploader = (file, filename) => {

  // do some stuff

  return `${cdnPrefix}/${filename}`; // return the remote url of current asset is optional
}

module.exports = {
  plugins: [
    new UploadPlugin({
      uploader,
      options: {
        include: ['index.html', /\.css$/, /\.js$/], // 只上传文件名为'index.html'和类型为`css`、`js`的文件
      } }),
  ],
};
```

#### `exclude`

Type: `String[]|RegExp[]`
Default: `[]`

只上传指定类型或指定文件名的文件，与`include`选项互斥，级别比`include`高。

> ⚠️ 选项值为空时不过滤任何文件。

**webpack.config.js**

```js
const UploadPlugin = require('upload-webpack-plugin');
const uploader = (file, filename) => {

  // do some stuff

  return `${cdnPrefix}/${filename}`; // return the remote url of current asset is optional
}

module.exports = {
  plugins: [
    new UploadPlugin({
      uploader,
      options: {
        include: ['index.html', /\.css$/, /\.js$/], // 因为同时提供了 exclude 选项，而且值有冲突，所以只会上传 'index.html'
        exclude: [/\.css$/, /\.js$/], // 只上传文件名为'index.html'和类型为`css`、`js`以外的文件
      } }),
  ],
};
```

#### `clean`

Type: `Boolean|String[]|RegExp[]`
Default: `false`

删除即将生成的指定类型的文件。

> ⚠️ 选项值为`true`时，删除所有即将生成的文件，打包结束后本地将不会生成任何文件。

**webpack.config.js**

```js
const UploadPlugin = require('upload-webpack-plugin');
const uploader = (file, filename) => {

  // do some stuff

  return `${cdnPrefix}/${filename}`; // return the remote url of current asset is optional
}

module.exports = {
  plugins: [
    new UploadPlugin({
      uploader,
      options: {
        clean: [/.*\.((?!(html)).)+/], // 删除除了 .html 后缀以外的所有文件
      } }),
  ],
};
```

#### `replace.typesWithOrder`

Type: `Array`
Default: `['.css', '.js', '.html']`

需要替换引用资源链接的文件类型和顺序，web 环境下的常规引用顺序分为下面几种情况:

1. `html`引用`js`;
2. `html`引用`css`;
3. `js`引用`css`;

所以默认值`['.css', '.js', '.html']`代表的就是上面描述的情况。

> ⚠️ 因为`webpack`打包涉及**动态加载**chunk 的情况，而 chunk 之间可能存在依赖关系，所以'.css'和'.js'默认会进行替换。因此，当选项配置为['.html']时和默认值是对等的。

**webpack.config.js**

```js
const UploadPlugin = require('upload-webpack-plugin');
const uploader = (file, filename) => {

  // do some stuff

  return `${cdnPrefix}/${filename}`; // return the remote url of current asset is optional
}

module.exports = {
  plugins: [
    new UploadPlugin({
      uploader,
      options: {
         replace: { typesWithOrder: [] }, // 数组为空时，html 类型文件内的所有资源引用将不会被返回的远程地址所替换
      } }),
  ],
};
```

#### `replace.useRealFilename`

Type: `Boolean`
Default: `false`

替换引用资源链接时，使用真实文件名进行匹配。

> ⚠️ 当使用`file-loader`和`url-loader`之类的插件时，可配置`outputPath`，如果这个值配置了和原始文件所在的目录不同的时候，比如原始文件`foo.jpg`的本地相对地址为`/assets/foo.jpg`，而相关 loader 的`outputPath`为`/image/`时，`foo.jpg`在其它文件的引用地址为`/image/foo.jpg`，构建过程中插件拿到的是本地地址`/assets/foo.jpg`，所以会出现不替换的情况，因此请遵守以下要求：
- 配置`outputPath`与原始路径不同时，设置`replace.useRealFilename = true`，并确保文件命名具有唯一辨识值，如：`name: '[name].[contentHash:7].[ext]'`;
- 配置命名方式为形如`name: '[name].[ext]'`等不具有唯一`hash`值时，请勿配置`outputPath`；
- 上面两个要求都是基于`uploader`函数有返回的情况下进行要求的；

> ⚠️ 建议使用`file-loader`和`url-loader`之类的插件时不配置`outputPath`，并保持`replace.useRealFilename`为原始值`false`。

**webpack.config.js**

```js
const UploadPlugin = require('upload-webpack-plugin');
const uploader = (file, filename) => {

  // do some stuff

  return `${cdnPrefix}/${filename}`; // return the remote url of current asset is optional
}

module.exports = {
  module: {
    rules: [
      {
        test: /\.(zip|txt|ttf|woff)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[contentHash:7].[ext]',
          outputPath: 'others',
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[contentHash:7].[ext]',
          outputPath: 'images',
        },
      },
    ],
  },
  plugins: [
    new UploadPlugin({
      uploader,
      options: {
         replace: { useRealFilename: true }, // 此时会对本地址路径为 /assets/foo.123456.jpg 的资源，使用 foo.123456.jpg 进行查找替换
      } }),
  ],
};
```

#### `muteLog`

Type: `Boolean`
Default: `false`

禁止插件所有提示，为`false`会提示每个资源的上传情况。

**bash / console**

```bash
🌟 ✔ Upload complete 21/21
🌟 ✔ images/happy-boy.b85a8a2.gif is uploaded and it will be as https://custom.lkangd.com/images/happy-boy.b85a8a2.gif
🌟 ✔ others/example.d45b548.txt is uploaded and it will be as https://custom.lkangd.com/others/example.d45b548.txt
🌟 ✔ others/example.2f8a720.zip is uploaded and it will be as https://custom.lkangd.com/others/example.2f8a720.zip
🌟 ✔ others/dimmed.ff2b498.woff is uploaded and it will be as https://custom.lkangd.com/others/dimmed.ff2b498.woff
🌟 ✔ others/dimmed.424ed69.ttf is uploaded and it will be as https://custom.lkangd.com/others/dimmed.424ed69.ttf
🌟 ✔ static/favicon.ico is uploaded and it will be as https://custom.lkangd.com/static/favicon.ico
🌟 ✔ static/loading.gif is uploaded and it will be as https://custom.lkangd.com/static/loading.gif
🌟 ✔ static/static.jpg is uploaded and it will be as https://custom.lkangd.com/static/static.jpg
🌟 ✔ dynamicInDynamic.088e3a7.6879457.bundle.js is uploaded and it will be as https://custom.lkangd.com/dynamicInDynamic.088e3a7.6879457.bundle.js
🌟 ✔ dynamic.56ad341.bundle.css is uploaded and it will be as https://custom.lkangd.com/dynamic.56ad341.bundle.css
🌟 ✔ dynamic.56ad341.2a7837e.bundle.js is uploaded and it will be as https://custom.lkangd.com/dynamic.56ad341.2a7837e.bundle.js
🌟 ✔ dynamicSub.1e2a156.bundle.css is uploaded and it will be as https://custom.lkangd.com/dynamicSub.1e2a156.bundle.css
🌟 ✔ dynamicSub.1e2a156.2dce103.bundle.js is uploaded and it will be as https://custom.lkangd.com/dynamicSub.1e2a156.2dce103.bundle.js
🌟 ✔ manifest.6cf1b05.cb9796c.js is uploaded and it will be as https://custom.lkangd.com/manifest.6cf1b05.cb9796c.js
🌟 ✔ vendor.4752143.ae53a19.bundle.js is uploaded and it will be as https://custom.lkangd.com/vendor.4752143.ae53a19.bundle.js
🌟 ✔ common.cca58f5.bundle.css is uploaded and it will be as https://custom.lkangd.com/common.cca58f5.bundle.css
🌟 ✔ common.cca58f5.abae7d8.bundle.js is uploaded and it will be as https://custom.lkangd.com/common.cca58f5.abae7d8.bundle.js
🌟 ✔ main.dc19a08.564a3f0.bundle.js is uploaded and it will be as https://custom.lkangd.com/main.dc19a08.564a3f0.bundle.js
🌟 ✔ sub.7f0f75e.8dcdfd1.bundle.js is uploaded and it will be as https://custom.lkangd.com/sub.7f0f75e.8dcdfd1.bundle.js
🌟 ✔ sub.html is uploaded and it will be as https://custom.lkangd.com/sub.html
🌟 ✔ index.html is uploaded and it will be as https://custom.lkangd.com/index.html
```

## License

[MIT](./LICENSE)

[npm]: https://img.shields.io/npm/v/upload-webpack-plugin.svg
[npm-url]: https://npmjs.com/package/upload-webpack-plugin
[node]: https://img.shields.io/node/v/upload-webpack-plugin.svg
[node-url]: https://nodejs.org
[deps]: https://david-dm.org/lkangd/upload-webpack-plugin.svg
[deps-url]: https://david-dm.org/lkangd/upload-webpack-plugin

<!-- [tests]: https://github.com/lkangd/upload-webpack-plugin/workflows/upload-webpack-plugin/badge.svg -->
<!-- [tests-url]: https://github.com/lkangd/upload-webpack-plugin/actions -->

[cover]: https://codecov.io/gh/lkangd/upload-webpack-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/lkangd/upload-webpack-plugin
[size]: https://packagephobia.now.sh/badge?p=upload-webpack-plugin
[size-url]: https://packagephobia.now.sh/result?p=upload-webpack-plugin
[typescript]: https://badgen.net/badge/icon/typescript?icon=typescript&label
[typescript-url]: https://badgen.net/badge/icon/typescript?icon=typescript&label
[glob-options]: https://github.com/sindresorhus/globby#options
[vulnerability]: https://snyk.io/test/github/lkangd/upload-webpack-plugin/badge.svg?targetFile=package.json
[vulnerability-url]: https://snyk.io/test/github/lkangd/upload-webpack-plugin