const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./libs/parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const common = {
  entry: {
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]?[loaders]'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack'
    })
  ]
};

var config;

switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      { devtool: 'source-map' },
      parts.setupCSS(PATHS.app)
    );
    break;
  default:
    config = merge(
      common,
      { devtool: 'eval-source-map' },
      parts.devServer({
        host: process.env.HOST,
        port: process.env.PORT
      }),
      parts.setupCSS(PATHS.app)
    );
}

module.exports = validate(config);
