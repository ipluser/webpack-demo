const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./libs/parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'node_modules', 'purecss'),
    path.join(__dirname, 'app', 'main.css')
  ],
  build: path.join(__dirname, 'build')
};

const common = {
  entry: {
    style: PATHS.style,
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]?[loaders]'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack Demo'
    })
  ]
};

var config;

switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build,
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.clean(PATHS.build),
      parts.setFreeVariables({
        'process.env.NODE_ENV': 'production'
      }),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react']
      }),
      parts.minify(),
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.app])
    );
    break;
  case 'stats':
    config = merge(
        common,
        {
          devtool: 'source-map',
          output: {
            path: PATHS.build,
            filename: '[name].[chunkhash].js',
            chunkFilename: '[chunkhash].js'
          }
        },
        parts.clean(PATHS.build),
        parts.setFreeVariables({
          'process.env.NODE_ENV': 'production'
        }),
        parts.extractBundle({
          name: 'vendor',
          entries: ['react']
        }),
        parts.minify(),
        parts.extractCSS(PATHS.style),
        parts.purifyCSS([PATHS.app])
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
      parts.setupCSS(PATHS.style)
    );
}

module.exports = validate(config, {
  quiet: true
});
