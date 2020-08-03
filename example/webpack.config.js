const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UploadWebpackPlugin = require('../dist/cjs');
const uploaders = require('./uploaders');
const PUBLIC_PATH = 'https://cdn.lkangd.com/';

const genPublicPath = path => {
  return `${PUBLIC_PATH}${path}`;
};
const htmlWebpackPluginOptions = (filename, chunks) => {
  return { filename, chunks, template: path.resolve(__dirname, 'index.html'), minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        removeAttributeQuotes: true,
      }
    }
  }

module.exports = {
  mode: 'production',
  entry: {
    main: path.resolve(__dirname, 'src/index'),
    sub: path.resolve(__dirname, 'src/sub'),
  },
  context: __dirname,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:7].[contentHash:7].js',
    chunkFilename: '[name].[chunkhash:7].[contentHash:7].bundle.js',
    publicPath: genPublicPath('entry/'),
  },
  module: {
    rules: [
      {
        test: /\.(zip|txt|ttf|woff)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[contentHash:7].[ext]',
          publicPath: genPublicPath('file/'),
          outputPath: 'others',
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[contentHash:7].[ext]',
          publicPath: genPublicPath('img/'),
          outputPath: 'images',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  optimization: {
    minimize: false,
    splitChunks: {
      cacheGroups: {
        common: {
          name: 'common',
          chunks: 'initial',
          minSize: 1,
          priority: 0,
          minChunks: 2,
        },
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
          priority: 10,
          minChunks: 2,
        },
      },
    },
    runtimeChunk: { name: 'manifest' },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(htmlWebpackPluginOptions('index.html', ['main'])),
    new HtmlWebpackPlugin(htmlWebpackPluginOptions('sub.html', ['sub'])),
    new CopyWebpackPlugin({ patterns: [{ from: path.resolve(__dirname, 'static'), to: path.resolve(__dirname, 'dist/static') }] }),
    new MiniCssExtractPlugin({
      publicPath: genPublicPath('css/'),
      filename: '[name].[chunkhash:7].css',
      chunkFilename: '[name].[chunkhash:7].bundle.css',
      ignoreOrder: true,
    }),
    new UploadWebpackPlugin({
      uploader: uploaders.gather,
      options: {
        enable: true,
        // muteLog: false,
        gather: true,
        // clean: [/.*\.((?!(html)).)+/],
        // exclude: ['index.html', /\.ttf$/, /\.js$/, 'dynamicSub.1e2a156.2dce103.bundle.js', 'dynamic.56ad341.bundle.css'],
        // include: ['index.html', /\.ttf$/, /\.js$/, 'dynamicSub.1e2a156.2dce103.bundle.js', 'dynamicSub.1e2a156.bundle.css'],
        replace: {
          // typesWithOrder: [],
          // useRealFilename: true,
        },
      },
    }),
    new OptimizeCSSAssetsPlugin({})
  ],
};
